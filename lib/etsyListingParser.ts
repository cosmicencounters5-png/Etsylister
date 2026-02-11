export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const url = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(url,{
      headers:{
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept":
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language":"en-US,en;q=0.9",
        "Upgrade-Insecure-Requests":"1"
      },
      cache:"no-store"
    })

    if(!res.ok){
      console.log("Fetch failed:", res.status)
      return null
    }

    const html = await res.text()

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

      }catch{}

    }

    return null

  }catch(e){

    console.log("Parser error:", e)
    return null

  }

}