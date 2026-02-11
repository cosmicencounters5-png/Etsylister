export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  let url = rawUrl.trim()

  url = decodeURIComponent(url)

  // extract listing id
  const match = url.match(/(\d{6,})/)

  if(!match) return null

  const listingId = match[1]

  const canonicalUrl = `https://www.etsy.com/listing/${listingId}`

  console.log("Fetching:", canonicalUrl)

  const res = await fetch(canonicalUrl,{
    headers:{
      "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language":"en-US,en;q=0.9"
    },
    cache:"no-store"
  })

  const html = await res.text()

  // DEBUG:
  console.log("HTML length:", html.length)

  // 🔥 METHOD 1 — structured data
  const ldMatches = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )]

  for(const m of ldMatches){

    try{

      const data = JSON.parse(m[1])

      if(data["@type"]==="Product"){

        return {
          title:data.name || "",
          description:data.description || "",
          image:data.image || ""
        }

      }

    }catch{}
  }

  // 🔥 METHOD 2 — fallback title scrape
  const titleMatch = html.match(/<title>(.*?)<\/title>/i)

  if(titleMatch){

    return {
      title:titleMatch[1],
      description:"",
      image:""
    }

  }

  console.log("No product data found")

  return null
}