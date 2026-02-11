export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const res = await fetch(listingUrl,{
    headers:{
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      "Accept-Language":"en-US,en;q=0.9"
    }
  })

  const html = await res.text()

  // 🔥 GOD MODE — extract INITIAL_STATE

  const stateMatch = html.match(
    /window\.__INITIAL_STATE__\s*=\s*({.*});/
  )

  if(!stateMatch) return null

  const state = JSON.parse(stateMatch[1])

  const listing =
    state?.listingReducer?.listing

  if(!listing) return null

  return {
    title: listing.title || "",
    description: listing.description || "",
    image: listing.images?.[0]?.url_fullxfull || ""
  }

}