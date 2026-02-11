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
      }
    })

    if(!res.ok){
      console.log("fetch failed:", res.status)
      return null
    }

    const html = await res.text()

    // 🔥 extract OG title
    const titleMatch = html.match(
      /property="og:title" content="([^"]+)"/
    )

    // 🔥 extract OG image
    const imageMatch = html.match(
      /property="og:image" content="([^"]+)"/
    )

    return{

      title: titleMatch ? titleMatch[1] : "",
      description: "",
      image: imageMatch ? imageMatch[1] : ""

    }

  }catch(e){

    console.log("Parser failed:", e)
    return null

  }

}