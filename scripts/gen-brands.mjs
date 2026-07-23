#!/usr/bin/env node
// Generate remaining brand promo images sequentially
const BASE = 'http://localhost:3000/api/generate-image'

const brands = [
  {
    filename: 'pepsi',
    prompt: 'Ultra premium commercial product photography of Pepsi Cola beverages arranged on a bed of crushed ice cubes. Show multiple sizes: a 1.5 liter PET bottle, a 1 liter bottle, a 500ml bottle, and a Pepsi aluminum can — all with the iconic red-white-blue Pepsi circle logo and dark cola liquid clearly visible. Water droplets and condensation on the bottles, sparkling ice cubes around, deep blue studio background, dramatic soft lighting from above, sharp focus, 4k, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'sprite',
    prompt: 'Ultra premium commercial product photography of Sprite lemon-lime soda beverages on a bed of crushed ice cubes. Show multiple sizes: a 1.5 liter green PET bottle, a 1 liter bottle, a 500ml bottle and a Sprite aluminum can — all with the iconic green Sprite label with yellow accents. Clear light-yellow soda visible in bottles, fresh lemon slices and lime slices around the base, water droplets and condensation, sparkling ice cubes, fresh green studio background, bright soft lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: '7up',
    prompt: 'Ultra premium commercial product photography of 7Up lemon-lime soda beverages on a bed of crushed ice cubes. Show multiple sizes: a 1.5 liter green PET bottle, a 1 liter bottle, a 500ml bottle and a 7Up aluminum can — all with the classic 7Up green label and iconic red 7 with the word Up. Fresh lemon and lime slices around, water droplets, sparkling ice, bright green studio background, soft dramatic lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'mountain-dew',
    prompt: 'Ultra premium commercial product photography of Mountain Dew citrus soda beverages on a bed of crushed ice cubes. Show multiple sizes: a 1.5 liter Mountain Dew green PET bottle, a 1 liter bottle, a 500ml bottle and a Mountain Dew aluminum can — all with the iconic bright green Mountain Dew label and red MTN DEW logotype. Bright yellow-green soda visible, splashes and energy droplets, sparkling ice, vibrant green-yellow studio background, dynamic lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'fanta',
    prompt: 'Ultra premium commercial product photography of Fanta orange soda beverages on a bed of crushed ice cubes. Show multiple sizes: a 1.5 liter Fanta orange PET bottle, a 1 liter bottle, a 500ml bottle and a bright orange Fanta aluminum can — all with the iconic swirly Fanta orange logo. Orange soda visible in bottles, fresh orange slices around the base, water droplets and condensation, sparkling ice cubes, vibrant orange studio background, warm bright lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'minute-maid',
    prompt: 'Ultra premium commercial product photography of Minute Maid fruit juice bottles on a bed of crushed ice cubes. Show multiple juice bottle sizes with different flavors — orange juice bottle, apple juice bottle, mango juice bottle, and a small pulpy juice bottle — all with the iconic Minute Maid green label and colorful fruit imagery. Fresh whole oranges, apples and mangoes scattered around the base, water droplets and condensation, sparkling ice cubes, bright green and orange fresh studio background, warm inviting lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'nestle-pure-life',
    prompt: 'Ultra premium commercial product photography of Nestlé Pure Life drinking water bottles arranged together. Show multiple sizes: a large 1.5 liter clear plastic Nestlé Pure Life water bottle and a smaller 500ml water bottle — both with the iconic blue Nestlé Pure Life label showing mountain and water imagery. Crystal clear water visible, cool water droplets and condensation on bottles, splashes of water around, light blue studio background with a hint of mountain silhouette, clean bright soft lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'aquafina',
    prompt: 'Ultra premium commercial product photography of Aquafina drinking water bottles arranged together. Show multiple sizes: a large 1.5 liter clear plastic Aquafina bottle and a smaller 500ml bottle — both with the iconic blue Aquafina label with mountain and sun graphic. Crystal clear pure water visible, cool water droplets and dramatic condensation, splashes of water around the bottles, bright cyan-blue studio background, fresh clean lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
  {
    filename: 'rani-juice',
    prompt: 'Ultra premium commercial product photography of Rani Float fruit juice cans arranged together on a wooden surface. Show multiple Rani Float juice aluminum cans in different colorful flavors — orange, mango, peach, pineapple, mixed fruit — all with the iconic Rani logo and fruit imagery. Real fruit pieces visible through opened cans, fresh whole orange, mango, peach and pineapple around the base, water droplets and condensation on the cans, warm sunny background with tropical fruit theme, bright inviting lighting, sharp focus, hyper-realistic advertising photography, no extra text.'
  },
]

async function main() {
  for (const b of brands) {
    process.stdout.write(`Generating ${b.filename}... `)
    const t0 = Date.now()
    try {
      const res = await fetch(BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: b.prompt, filename: b.filename, size: '1024x1024' })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`)
      console.log(`OK (${Math.round((Date.now() - t0) / 1000)}s) ${data.url}`)
    } catch (err) {
      console.log(`FAIL: ${err.message}`)
    }
  }
}

main().catch(e => { console.error(e); process.exit(1) })
