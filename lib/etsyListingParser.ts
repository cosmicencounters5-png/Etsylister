export async function parseEtsyListing(url:string){

  const res = await fetch(url,{
    headers:{
      "User-Agent":"Mozilla/5.0"
    }
  })

  const html = await res.text()

  // FIND JSON-LD structured data
  const jsonMatch = html.match(
    /<script type="application\/ld\+json">([\s\S]*?)<\/script>/
  )

  if(!jsonMatch){
    return null
  }

  try{

    const data = JSON.parse(jsonMatch[1])

    const title = data.name || ""
    const description = data.description || ""

    return {
      title,
      description
    }

  }catch(e){

    return null

  }
}