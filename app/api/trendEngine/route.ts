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

  // 🔥 WORD WEIGHTING SYSTEM

  const words:Record<string,number> = {}

  const ignore = ["with","for","and","the","etsy","gift","digital","download"]

  competitors.forEach((c:any)=>{

    const title = (c.title || "").toLowerCase()

    const weight =
      (c.dominationScore || 1) * 0.5 +
      (c.trendScore || 1)

    title.split(" ").forEach(word=>{

      const clean = word.replace(/[^\w]/g,"")

      if(clean.length < 4) return
      if(ignore.includes(clean)) return

      words[clean] = (words[clean] || 0) + weight

    })

  })

  const sorted = Object.entries(words)
    .sort((a,b)=>b[1]-a[1])

  const trending = sorted.slice(0,6).map(w=>w[0])

  const emerging = sorted
    .filter(w=>w[1] < 5)
    .slice(0,5)
    .map(w=>w[0])

  return Response.json({
    trending,
    emerging,
    market // 🔥 allows UI expansion later
  })

}