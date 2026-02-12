export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":"Mozilla/5.0"
      }
    })

    const html = await res.text()

    if(!html) return null

    // 🔥 parse meta tags (ALWAYS EXISTS)

    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/)
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/)
    const imageMatch = html.match(/<meta property="og:image" content="([^"]+)"/)

    const title = titleMatch?.[1]
    const description = descMatch?.[1] || ""
    const image = imageMatch?.[1] || ""

    if(!title) return null

    return { title, description, image }

  }catch(e){

    console.log("Parser error:",e)
    return null

  }
}