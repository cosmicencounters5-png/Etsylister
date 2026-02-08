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
    competitors.reduce((a,c)=>a+c.inCart,0) / competitors.length

  const avgTrend =
    competitors.reduce((a,c)=>a+c.trendScore,0) / competitors.length

  const radar = {
    demand: avgInCart > 40 ? "STRONG" : "MEDIUM",
    avgInCart: Math.round(avgInCart),
    trend: avgTrend > 50 ? "RISING" : "STABLE",
    competition: competitors.length > 5 ? "HIGH" : "LOW"
  }

  return Response.json(radar)
}