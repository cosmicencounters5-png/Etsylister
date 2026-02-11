export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    const data = await res.json()

    return {
      title: data.title || "",
      description: "",
      image: data.thumbnail_url || ""
    }

  }catch(e){

    console.log("oembed failed", e)

    return null

  }
}