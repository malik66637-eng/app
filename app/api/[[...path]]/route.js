import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const maxDuration = 180

let client
let db

async function getDb() {
  if (db) return db
  client = new MongoClient(process.env.MONGO_URL)
  await client.connect()
  db = client.db(process.env.DB_NAME || 'malik_poultry')
  return db
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() })
}

// ------------------ Image generation (via Emergent LLM proxy) ------------------
async function generateBrandImage({ prompt, filename, size = '1024x1024', model = 'gpt-image-2' }) {
  const key = process.env.EMERGENT_LLM_KEY
  if (!key) throw new Error('EMERGENT_LLM_KEY missing')
  const res = await fetch('https://integrations.emergentagent.com/llm/openai/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({ model, prompt, n: 1, size })
  })
  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { throw new Error(`Non-JSON response: ${text.slice(0, 200)}`) }
  if (!res.ok) throw new Error(data?.error?.message || `Image API failed (${res.status})`)

  const b64 = data?.data?.[0]?.b64_json
  const url = data?.data?.[0]?.url
  let buffer
  if (b64) {
    buffer = Buffer.from(b64, 'base64')
  } else if (url) {
    const r = await fetch(url)
    const ab = await r.arrayBuffer()
    buffer = Buffer.from(ab)
  } else {
    throw new Error('No image returned')
  }

  const safe = String(filename || uuidv4()).replace(/[^a-z0-9-_]/gi, '_')
  const fileName = `${safe}.png`
  const uploadDir = path.join(process.cwd(), 'public', 'brands')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(path.join(uploadDir, fileName), buffer)
  return { fileName, url: `/brands/${fileName}` }
}

// ------------------ Routes ------------------
export async function GET(request, { params }) {
  const p = await params
  const parts = p?.path || []
  const route = parts.join('/')
  try {
    if (route === '' || route === 'health') {
      return NextResponse.json({ ok: true, service: 'malik-poultry-api', time: new Date().toISOString() }, { headers: corsHeaders() })
    }
    if (route === 'brands/list') {
      // list files in public/brands
      const dir = path.join(process.cwd(), 'public', 'brands')
      try {
        const fs = await import('fs/promises')
        const files = await fs.readdir(dir)
        return NextResponse.json({ files: files.filter(f => !f.startsWith('.')) }, { headers: corsHeaders() })
      } catch {
        return NextResponse.json({ files: [] }, { headers: corsHeaders() })
      }
    }
    return NextResponse.json({ error: 'Not Found', route }, { status: 404, headers: corsHeaders() })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() })
  }
}

export async function POST(request, { params }) {
  const p = await params
  const parts = p?.path || []
  const route = parts.join('/')
  try {
    const body = await request.json().catch(() => ({}))

    if (route === 'inquiries' || route === 'contact') {
      const { name = '', phone = '', message = '', product = '' } = body
      if (!name || !phone) {
        return NextResponse.json({ error: 'Name and phone are required' }, { status: 400, headers: corsHeaders() })
      }
      const database = await getDb()
      const doc = {
        id: uuidv4(),
        name: String(name).slice(0, 120),
        phone: String(phone).slice(0, 40),
        message: String(message).slice(0, 1000),
        product: String(product).slice(0, 120),
        createdAt: new Date().toISOString()
      }
      await database.collection('inquiries').insertOne(doc)
      return NextResponse.json({ ok: true, id: doc.id }, { headers: corsHeaders() })
    }

    if (route === 'generate-image') {
      const { prompt, filename } = body
      if (!prompt) return NextResponse.json({ error: 'prompt required' }, { status: 400, headers: corsHeaders() })
      const out = await generateBrandImage({ prompt, filename })
      // persist meta
      try {
        const database = await getDb()
        await database.collection('generated_images').insertOne({
          id: uuidv4(), prompt, filename: out.fileName, url: out.url,
          createdAt: new Date().toISOString()
        })
      } catch {}
      return NextResponse.json({ ok: true, ...out }, { headers: corsHeaders() })
    }

    if (route === 'generate-brand-images') {
      // Batch generator: expects { brands: [{key, prompt, filename}] }
      const items = Array.isArray(body?.brands) ? body.brands : []
      const results = []
      for (const it of items) {
        try {
          const out = await generateBrandImage({ prompt: it.prompt, filename: it.filename })
          results.push({ key: it.key, ok: true, url: out.url, fileName: out.fileName })
        } catch (err) {
          results.push({ key: it.key, ok: false, error: err.message })
        }
      }
      return NextResponse.json({ ok: true, results }, { headers: corsHeaders() })
    }

    return NextResponse.json({ error: 'Not Found', route }, { status: 404, headers: corsHeaders() })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() })
  }
}
