export async function parseEtsyListing(url:string){

  const match =
    url.match(/listing\/(\d+)/) ||
    url.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(listingUrl)

    const html = await res.text()

    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){

          return {
            title: data.name,
            description: data.description,
            image: Array.isArray(data.image)
              ? data.image[0]
              : data.image
          }

        }

      }catch{}
    }

    return null

  }catch(e){

    console.log("client parser failed",e)
    return null
  }
}