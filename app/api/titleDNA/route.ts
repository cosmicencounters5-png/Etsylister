import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  // 🔥 NEW STRUCTURE
  const scan = await scanEtsy(product)

  const competitors = scan?.competitors || []

  if(!competitors.length){
    return Response.json(null)
  }

  const titles = competitors
    .map((c:any)=>c.title || "")
    .filter(Boolean)

  const patterns = {
    pipes: titles.filter((t:string)=>t.includes("|")).length,
    commas: titles.filter((t:string)=>t.includes(",")).length,
    longTitles: titles.filter((t:string)=>t.length > 80).length,
    giftWords: titles.filter((t:string)=>t.toLowerCase().includes("gift")).length
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