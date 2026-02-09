import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()

  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const scan = await scanEtsy(product)

  const competitors = scan.competitors || []
  const market = scan.marketInsights || null

  if(!competitors.length || !market){
    return Response.json(null)
  }

  const radar = {
    demand: market.demand,
    avgInCart: market.avgInCart,
    trend: market.trend,
    competition: market.competition,
    opportunity: market.opportunity,
    leaders: market.leaders
  }

  return Response.json(radar)
}