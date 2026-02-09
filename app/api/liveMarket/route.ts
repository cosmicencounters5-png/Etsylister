import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  try{

    const body = await req.json()
    const product = body.product || ""

    if(product.length < 3){
      return Response.json(null)
    }

    // 🔥 SCAN MARKET
    const scan = await scanEtsy(product)

    const market = scan?.marketInsights || null

    if(!market){
      return Response.json(null)
    }

    // 🔥 SAFE RETURN STRUCTURE
    return Response.json({
      avgInCart: market.avgInCart || 0,
      demand: market.demand || "UNKNOWN",
      competition: market.competition || "UNKNOWN",
      trend: market.trend || "UNKNOWN",
      opportunity: market.opportunity || "NORMAL",
      leaders: market.leaders || []
    })

  }catch(e){

    return Response.json(null)

  }

}