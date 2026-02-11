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

        const title = data.name || ""
        const description = data.description || ""

        // 🔥 SIMPLE AI SIGNAL EXTRACTION (NO SCRAPING RISK)

        const words = `${title} ${description}`.toLowerCase()

        const signals = {
          hasDigitalIntent:
            words.includes("pattern") ||
            words.includes("printable") ||
            words.includes("download"),

          hasBuyerIntent:
            words.includes("gift") ||
            words.includes("personalized") ||
            words.includes("custom"),

          longTailScore:
            title.split(" ").length
        }

        return {
          title,
          description,
          image: data.image || "",
          signals
        }

      }

    }catch(e){}
  }

  return null
}