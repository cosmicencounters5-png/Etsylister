import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

export async function POST(req: Request){

  try{

    const body = await req.json()
    const product = body.product || ""

    if(product.length < 3){
      return Response.json(null)
    }

    // 🔥 LIVE MARKET SCAN
    const scan = await scanEtsy(product)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || null

    if(!competitors.length || !market){
      return Response.json(null)
    }

    // 🔥 STRUCTURE UI EXPECTS
    const radar = {
      avgInCart: market.avgInCart,
      demand: market.demand,
      competition: market.competition,
      trend: market.trend,
      opportunity: market.opportunity,
      leaders: market.leaders || []
    }

    return Response.json(radar)

  }catch(e){

    console.log("liveMarket error:", e)

    return Response.json(null)

  }

}