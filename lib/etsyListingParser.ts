export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":"Mozilla/5.0",
        "Accept-Language":"en-US,en;q=0.9"
      },
      cache:"no-store"
    })

    const html = await res.text()

    // 🔥 Extract JSON-LD (structured data Etsy embeds)

    const jsonMatch = html.match(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
    )

    if(!jsonMatch) return null

    const data = JSON.parse(jsonMatch[1])

    return {
      title: data.name || "",
      description: data.description || "",
      image: data.image || ""
    }

  }catch(e){

    console.log("parser failed",e)
    return null

  }

}