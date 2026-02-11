export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    // ⭐ Etsy oEmbed funker fra browser
    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    if(!res.ok) return null

    const data = await res.json()

    return {
      title: data.title || "",
      description: "",
      image: data.thumbnail_url || ""
    }

  }catch(e){

    console.log("client parse failed", e)
    return null

  }

}