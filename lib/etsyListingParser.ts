export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // 🔥 extract listing id from ANY Etsy link
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    // 🔥 USE ETSY OEMBED (stable + not blocked)
    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    const data = await res.json()

    if(!data) return null

    return {
      title: data.title || "",
      description: "", // oembed does not include description
      image: data.thumbnail_url || ""
    }

  }catch(e){

    console.log("Parser failed:", e)
    return null

  }
}