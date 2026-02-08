import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const competitors = await scanEtsy(product)

  const titles = competitors.map(c=>c.title.toLowerCase())

  const weaknesses:string[] = []

  const avgLength = titles.reduce((a,t)=>a+t.length,0)/titles.length

  if(avgLength < 70){
    weaknesses.push("Titles too short — room for stronger keyword stacking")
  }

  const giftCount = titles.filter(t=>t.includes("gift")).length

  if(giftCount < 2){
    weaknesses.push("Low buyer intent wording detected")
  }

  const pipeCount = titles.filter(t=>t.includes("|")).length

  if(pipeCount < 2){
    weaknesses.push("Few structured titles using separators")
  }

  const longTail = titles.filter(t=>t.split(" ").length > 6).length

  if(longTail < 3){
    weaknesses.push("Missing long-tail keyword optimization")
  }

  if(!weaknesses.length){
    weaknesses.push("High competition quality — differentiation strategy needed")
  }

  return Response.json({
    weaknesses
  })

}