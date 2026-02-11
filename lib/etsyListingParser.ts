export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(listingUrl)

    const html = await res.text()

    const titleMatch = html.match(
      /property="og:title" content="([^"]+)"/
    )

    const imageMatch = html.match(
      /property="og:image" content="([^"]+)"/
    )

    return{

      title: titleMatch ? titleMatch[1] : "",
      description:"",
      image: imageMatch ? imageMatch[1] : ""

    }

  }catch(e){

    console.log("client parser failed", e)

    return null
  }
}