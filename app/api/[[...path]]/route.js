import { NextResponse } from 'next/server'
import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'

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

export async function GET(request, { params }) {
  const parts = (params?.path) || []
  const route = parts.join('/')
  try {
    if (route === '' || route === 'health') {
      return NextResponse.json({ ok: true, service: 'malik-poultry-api', time: new Date().toISOString() }, { headers: corsHeaders() })
    }
    return NextResponse.json({ error: 'Not Found', route }, { status: 404, headers: corsHeaders() })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() })
  }
}

export async function POST(request, { params }) {
  const parts = (params?.path) || []
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

    return NextResponse.json({ error: 'Not Found', route }, { status: 404, headers: corsHeaders() })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() })
  }
}
