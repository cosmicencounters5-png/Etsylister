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

    console.log("STATUS:",res.status)

    const html = await res.text()

    console.log("HTML START:", html.substring(0,500))

    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/)

    if(!titleMatch){
      console.log("NO OG TITLE FOUND")
      return null
    }

    return {
      title:titleMatch[1],
      description:"",
      image:""
    }

  }catch(e){

    console.log("Parser error:",e)
    return null

  }
}