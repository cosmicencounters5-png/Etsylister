import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  // 🔥 NEW STRUCTURE
  const scan = await scanEtsy(product)

  const competitors = scan.competitors || []
  const market = scan.marketInsights || {}

  if(!competitors.length){
    return Response.json(null)
  }

  const avgInCart = market.avgInCart || 0
  const demand = market.demand || "LOW"
  const competition = market.competition || "LOW"
  const trend = market.trend || "STABLE"

  const wordCount = product.split(" ").length

  let score = 30

  // 🔥 REAL MARKET LOGIC

  if(demand === "HIGH") score += 25
  else if(demand === "MEDIUM") score += 15

  if(competition === "LOW") score += 20
  else if(competition === "MEDIUM") score += 10

  if(trend === "RISING") score += 15

  if(avgInCart > 40) score += 10

  if(wordCount >= 3) score += 10

  if(score > 100) score = 100

  let status = "WEAK"

  if(score >= 80) status = "DOMINATION POTENTIAL"
  else if(score >= 60) status = "STRONG ENTRY"
  else if(score >= 45) status = "GOOD POTENTIAL"
  else status = "NEEDS OPTIMIZATION"

  return Response.json({
    score,
    status
  })

}