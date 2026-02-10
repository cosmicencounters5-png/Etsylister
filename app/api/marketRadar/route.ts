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
  const market = scan.marketInsights || null

  if(!competitors.length || !market){
    return Response.json(null)
  }

  // 🔥 GAP DETECTION

  const avgDomination =
    competitors.reduce((a,c)=>a+(c.dominationScore||0),0)
    /(competitors.length||1)

  const risingListings =
    competitors
      .filter((c:any)=>c.trendScore > avgDomination)
      .slice(0,3)

  const radar = {
    demand: market.demand,
    avgInCart: market.avgInCart,
    trend: market.trend,
    competition: market.competition,
    opportunity: market.opportunity,
    leaders: market.leaders,

    // 🔥 NEW INTELLIGENCE
    dominationAverage: Math.round(avgDomination),
    risingOpportunities: risingListings
  }

  return Response.json(radar)
}