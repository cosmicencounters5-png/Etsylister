export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // extract listing ID from ANY Etsy link
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    if(!res.ok){
      console.log("oEmbed failed:", res.status)
      return null
    }

    const data = await res.json()

    return {

      title: data.title || "",
      description: "", // oembed doesn't include description
      image: data.thumbnail_url || ""

    }

  }catch(e){

    console.log("Parser failed:", e)
    return null

  }

}