export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  let url = rawUrl.trim()
  url = decodeURIComponent(url)

  // extract listing id
  const match = url.match(/(\d{6,})/)

  if(!match) return null

  const listingId = match[1]
  const canonicalUrl = `https://www.etsy.com/listing/${listingId}`

  const res = await fetch(canonicalUrl,{
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Accept-Language":"en-US,en;q=0.9"
    },
    cache:"no-store"
  })

  const html = await res.text()

  // 🔥 METHOD 1 — JSON-LD structured data
  const ldMatches = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )]

  for(const m of ldMatches){

    try{

      const data = JSON.parse(m[1])

      if(data["@type"]===" profiling කරන්නProduct" || data["@type"]==="Product"){

        return {
          title:data.name || "",
          description:data.description || "",
          image:data.image || ""
        }

      }

    }catch{}
  }

  // 🔥 METHOD 2 — meta og:title (mye mer stabil)
  const ogMatch = html.match(/property="og:title"\s*content="([^"]+)"/i)

  if(ogMatch && ogMatch[1] && !ogMatch[1].toLowerCase().includes("etsy")){

    return {
      title:ogMatch[1],
      description:"",
      image:""
    }

  }

  // ❌ ignore generic titles like "etsy.com"
  console.log("No valid product data found")

  return null
}