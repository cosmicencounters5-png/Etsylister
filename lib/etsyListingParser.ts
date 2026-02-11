export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    // ⭐ CLIENT FETCH (bypasses server block)
    const res = await fetch(listingUrl)

    const html = await res.text()

    // 🔥 METHOD 1 — JSON-LD (primary)
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

      }catch{}
    }

    // 🔥 METHOD 2 — fallback title scrape
    const titleMatch = html.match(/<title>(.*?)<\/title>/)

    if(titleMatch){
      return {
        title: titleMatch[1],
        description:"",
        image:""
      }
    }

    return null

  }catch(e){

    console.log("GOD MODE parser failed", e)

    return null

  }
}