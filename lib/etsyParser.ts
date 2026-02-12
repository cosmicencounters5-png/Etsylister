export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language":"en-US,en;q=0.9"
      },
      cache:"no-store"
    })

    const html = await res.text()

    if(!html || html.length < 1000){
      console.log("Blocked by Etsy")
      return null
    }

    // OG TAGS (most reliable)
    const titleMatch = html.match(
      /<meta property="og:title" content="([^"]+)"/
    )

    const descMatch = html.match(
      /<meta name="description" content="([^"]+)"/
    )

    const imageMatch = html.match(
      /<meta property="og:image" content="([^"]+)"/
    )

    if(!titleMatch) return null

    return {
      title: titleMatch[1],
      description: descMatch?.[1] || "",
      image: imageMatch?.[1] || ""
    }

  }catch(e){

    console.log("Parser error",e)
    return null

  }
}