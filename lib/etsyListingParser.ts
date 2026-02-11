export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // extract listing id from ANY Etsy link
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    // ✅ Etsy official oembed endpoint
    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    const data = await res.json()

    if(!data?.title) return null

    return {
      title: data.title,
      description: "",
      image: data.thumbnail_url || ""
    }

  }catch(e){

    console.log("Parser failed:", e)
    return null

  }
}