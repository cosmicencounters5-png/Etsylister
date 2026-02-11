export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    // 🔥 STEP 1 — TRY OEMBED (fast)
    const oembed = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    if(oembed.ok){

      const data = await oembed.json()

      if(data?.title){

        return {
          title: data.title,
          description: "",
          image: data.thumbnail_url || ""
        }

      }
    }

  }catch(e){
    console.log("oembed failed")
  }

  try{

    // 🔥 STEP 2 — FALLBACK HTML PARSE
    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":"Mozilla/5.0",
        "Accept-Language":"en-US,en;q=0.9"
      }
    })

    const html = await res.text()

    const titleMatch = html.match(
      /<meta property="og:title" content="([^"]+)"/
    )

    const imageMatch = html.match(
      /<meta property="og:image" content="([^"]+)"/
    )

    if(titleMatch){

      return{
        title: titleMatch[1],
        description:"",
        image: imageMatch?.[1] || ""
      }

    }

  }catch(e){

    console.log("html fallback failed",e)

  }

  return null
}