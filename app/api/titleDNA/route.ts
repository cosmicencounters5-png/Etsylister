import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  // 🔥 SAFE SCAN STRUCTURE
  const scan = await scanEtsy(product)

  const competitors = scan?.competitors || []

  if(!competitors.length){
    return Response.json(null)
  }

  // 🔥 SAFE TITLE EXTRACTION
  const titles:string[] = competitors
    .map((c:any)=> (c?.title || "").toLowerCase())
    .filter(Boolean)

  if(!titles.length){
    return Response.json(null)
  }

  // 🔥 TITLE PATTERN ANALYSIS

  const patterns = {

    pipes: titles.filter(t=>t.includes("|")).length,

    commas: titles.filter(t=>t.includes(",")).length,

    longTitles: titles.filter(t=>t.length > 80).length,

    giftWords: titles.filter(t=>t.includes("gift")).length

  }

  // 🔥 STRUCTURE LOGIC (SMARTER)

  let structure = "[Primary Keyword] + [Niche/Style] + [Use Case]"

  if(patterns.longTitles >= 3){
    structure += " + [Keyword Stacking]"
  }

  if(patterns.giftWords >= 2){
    structure += " + [Gift Intent]"
  }

  if(patterns.pipes >= 2){
    structure += " | [Separator Strategy]"
  }

  return Response.json({
    structure,
    patterns
  })

}