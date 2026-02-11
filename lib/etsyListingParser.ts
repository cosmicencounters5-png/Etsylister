export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl =
    `https://www.etsy.com/listing/${match[1]}`

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
          image: data.image
        }

      }

    }catch{}
  }

  return null
}