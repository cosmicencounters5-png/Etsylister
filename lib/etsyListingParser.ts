export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // 🔥 extract listing id from ANY Etsy link
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

    const html = await res.text()

    // 🔥 extract JSON-LD structured data
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
            image: data.image || ""
          }

        }

      }catch(e){}
    }

    return null

  }catch(e){

    console.log("Parser failed:", e)
    return null

  }
}