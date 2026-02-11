export async function parseEtsyListing(rawUrl:string){

  console.log("PARSER STARTED:", rawUrl)

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match){
    console.log("NO MATCH FOUND")
    return null
  }

  const id = match[1]

  console.log("FOUND LISTING ID:", id)

  const pageUrl = `https://www.etsy.com/listing/${id}`

  try{

    const res = await fetch(pageUrl)

    console.log("FETCH STATUS:", res.status)

    const html = await res.text()

    console.log("HTML LENGTH:", html.length)

    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    console.log("JSONLD SCRIPTS FOUND:", scripts.length)

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){

          console.log("PRODUCT FOUND:", data.name)

          return {
            title: data.name || "",
            description: data.description || "",
            image: data.image || ""
          }

        }

      }catch(e){}
    }

    console.log("NO PRODUCT JSON FOUND")

    return null

  }catch(e){

    console.log("FETCH FAILED:", e)

    return null
  }
}