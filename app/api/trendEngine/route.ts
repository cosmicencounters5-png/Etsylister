import { scanEtsy } from "../../../lib/etsyScanner"

export async function POST(req:Request){

  const body = await req.json()
  const product = body.product || ""

  if(product.length < 3){
    return Response.json(null)
  }

  const competitors = await scanEtsy(product)

  const titles = competitors.map(c => c.title.toLowerCase())

  const words:Record<string,number> = {}

  titles.forEach(t=>{
    t.split(" ").forEach(word=>{
      if(word.length < 4) return
      words[word] = (words[word] || 0) + 1
    })
  })

  const trending = Object.entries(words)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,6)
    .map(w=>w[0])

  const emerging = Object.entries(words)
    .filter(w=>w[1] === 1)
    .slice(0,5)
    .map(w=>w[0])

  return Response.json({
    trending,
    emerging
  })

}