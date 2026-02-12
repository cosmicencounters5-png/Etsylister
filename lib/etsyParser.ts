export async function parseEtsyListing(rawUrl:string){

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
      console.log("Fetch failed:",res.status)
      return null
    }

    const html = await res.text()

    // find JSON-LD blocks
    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){

          return {
            title: data.name || "",
            description: data.description || "",
            image: Array.isArray(data.image)
              ? data.image[0]
              : data.image
          }

        }

      }catch(e){}
    }

    return null

  }catch(e){

    console.log("Parser error",e)
    return null

  }

}