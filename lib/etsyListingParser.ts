export async function parseEtsyListing(url:string){

  // convert shop link → canonical listing link
  const match = url.match(/listing\/(\d+)/)

  if(match){
    url = `https://www.etsy.com/listing/${match[1]}`
  }

  const res = await fetch(url,{
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Accept-Language":"en-US,en;q=0.9"
    }
  })

  const html = await res.text()

  const matches = [...html.matchAll(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
  )]

  for(const m of matches){

    try{

      const data = JSON.parse(m[1])

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