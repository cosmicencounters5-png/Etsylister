export async function parseEtsyListing(url:string){

  const res = await fetch(url,{
    headers:{
      "User-Agent":"Mozilla/5.0"
    }
  })

  const html = await res.text()

  // find ALL ld+json scripts
  const matches = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )]

  for(const m of matches){

    try{

      const data = JSON.parse(m[1])

      // Etsy product schema
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
}