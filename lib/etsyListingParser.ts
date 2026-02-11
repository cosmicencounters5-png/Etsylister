export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  let url = rawUrl.trim()

  // 🔥 STEP 1 — normalize
  url = decodeURIComponent(url)

  // remove tracking params visually
  url = url.replace(/\?.*$/,"")

  // 🔥 STEP 2 — extract listing id from ANY etsy url
  // works for:
  // /listing/123
  // ?listing_id=123
  // /share/123
  // mobile links etc

  let listingId:string | null = null

  const patterns = [
    /listing\/(\d+)/i,
    /listing_id=(\d+)/i,
    /\/(\d{6,})/ // fallback (large numeric id)
  ]

  for(const p of patterns){

    const match = url.match(p)

    if(match){
      listingId = match[1]
      break
    }
  }

  if(!listingId){
    console.log("Could not detect Etsy listing ID")
    return null
  }

  // 🔥 STEP 3 — canonical URL
  const canonicalUrl = `https://www.etsy.com/listing/${listingId}`

  console.log("Fetching canonical:", canonicalUrl)

  // 🔥 STEP 4 — fetch listing HTML
  const res = await fetch(canonicalUrl,{
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Accept-Language":"en-US,en;q=0.9"
    }
  })

  const html = await res.text()

  // 🔥 STEP 5 — extract structured data
  const matches = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )]

  for(const m of matches){

    try{

      const data = JSON.parse(m[1])

      if(data["@type"]==="Product"){

        return {
          title: data.name || "",
          description: data.description || "",
          image: data.image || "",
          listingId
        }

      }

    }catch(e){}
  }

  console.log("Product JSON not found")

  return null
}