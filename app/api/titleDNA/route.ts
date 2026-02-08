import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const competitors = await scanEtsy(product)

  const titles = competitors.map(c=>c.title)

  const patterns = {
    pipes: titles.filter(t=>t.includes("|")).length,
    commas: titles.filter(t=>t.includes(",")).length,
    longTitles: titles.filter(t=>t.length > 80).length,
    giftWords: titles.filter(t=>t.toLowerCase().includes("gift")).length
  }

  let structure = "[Primary Keyword] + [Niche/Style] + [Use Case]"

  if(patterns.giftWords > 2){
    structure += " + [Gift Intent]"
  }

  return Response.json({
    structure,
    patterns
  })
}