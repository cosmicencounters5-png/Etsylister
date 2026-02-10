import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const scan = await scanEtsy(product)

  const competitors = scan.competitors || []

  if(!competitors.length){
    return Response.json(null)
  }

  const titles = competitors.map(c=>c.title.toLowerCase())

  const weaknesses:string[] = []

  // 🔥 TITLE ANALYSIS

  const avgLength =
    titles.reduce((a,t)=>a+t.length,0)/(titles.length||1)

  if(avgLength < 70){
    weaknesses.push("Titles too short — room for stronger keyword stacking")
  }

  const giftCount =
    titles.filter(t=>t.includes("gift")).length

  if(giftCount < 2){
    weaknesses.push("Low buyer intent wording detected")
  }

  const pipeCount =
    titles.filter(t=>t.includes("|")).length

  if(pipeCount < 2){
    weaknesses.push("Few structured titles using separators")
  }

  const longTail =
    titles.filter(t=>t.split(" ").length > 6).length

  if(longTail < 3){
    weaknesses.push("Missing long-tail keyword optimization")
  }

  // 🔥 REAL MARKET GAP ANALYSIS

  const avgDomination =
    competitors.reduce((a,c)=>a+(c.dominationScore||0),0)
    /(competitors.length||1)

  const weakCompetitors =
    competitors.filter((c:any)=>c.dominationScore < avgDomination)

  if(weakCompetitors.length >= competitors.length/2){
    weaknesses.push("Market contains weak listings — domination opportunity")
  }

  const rising =
    competitors.filter((c:any)=>c.trendScore > avgDomination)

  if(rising.length){
    weaknesses.push("Emerging trend listings detected — early entry advantage")
  }

  if(!weaknesses.length){
    weaknesses.push("High competition quality — differentiation strategy needed")
  }

  return Response.json({
    weaknesses,
    dominationAverage: Math.round(avgDomination),
    weakCompetitors: weakCompetitors.length
  })
}