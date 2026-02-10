import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

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

  const competitionLevel = competitors.length

  let profitability = "LOW"
  if(avgInCart > 40) profitability = "HIGH"
  else if(avgInCart > 20) profitability = "MEDIUM"

  let difficulty = "LOW"
  if(competitionLevel > 8) difficulty = "HIGH"
  else if(competitionLevel > 4) difficulty = "MEDIUM"

  let opportunity = "LOW"

  if(profitability==="HIGH" && difficulty==="MEDIUM"){
    opportunity="GOLD"
  } else if(profitability==="MEDIUM"){
    opportunity="GOOD"
  }

  return Response.json({
    profitability,
    difficulty,
    opportunity
  })

}