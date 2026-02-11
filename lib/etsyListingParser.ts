export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // 🔥 extract listing id from ANY Etsy link
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingId = match[1]

  try{

    // ⭐ Etsy internal listing API (LESS BLOCKED)
    const res = await fetch(
      `https://openapi.etsy.com/v3/application/listings/${listingId}`,
      {
        headers:{
          "User-Agent":"Mozilla/5.0"
        }
      }
    )

    // If API blocked → fallback below
    if(!res.ok) throw new Error("API blocked")

    const data = await res.json()

    return {
      title: data.title || "",
      description: data.description || "",
      image: data.images?.[0]?.url_fullxfull || ""
    }

  }catch(e){

    console.log("Primary API failed — fallback")

    try{

      // 🔥 fallback = oembed (always works)
      const embed = await fetch(
        `https://www.etsy.com/oembed?url=${encodeURIComponent(rawUrl)}`
      )

      const data = await embed.json()

      return {
        title:data.title || "",
        description:"",
        image:data.thumbnail_url || ""
      }

    }catch(e2){

      console.log("Fallback failed")
      return null

    }

  }

}