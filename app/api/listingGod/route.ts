import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const competitors = await scanEtsy(product)

  if(!competitors.length){
    return Response.json(null)
  }

  const avgInCart =
    competitors.reduce((a,c)=>a+c.inCart,0)/competitors.length

  const avgTrend =
    competitors.reduce((a,c)=>a+c.trendScore,0)/competitors.length

  const wordCount = product.split(" ").length

  let score = 40

  if(avgInCart > 30) score += 20
  if(avgTrend > 50) score += 20
  if(wordCount >= 3) score += 10
  if(competitors.length < 6) score += 10

  if(score > 100) score = 100

  let status = "WEAK"

  if(score > 75) status = "STRONG ENTRY"
  else if(score > 55) status = "GOOD POTENTIAL"
  else if(score > 40) status = "NEEDS OPTIMIZATION"

  return Response.json({
    score,
    status
  })

}