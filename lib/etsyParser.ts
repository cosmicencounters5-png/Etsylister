import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // 🔥 extract listing id from ANY Etsy URL
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingId = match[1]

  const listingUrl = `https://www.etsy.com/listing/${listingId}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  if(!apiKey){
    console.log("Missing ScrapingBee API key")
    return null
  }

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?`+
    `api_key=${apiKey}`+
    `&url=${encodeURIComponent(listingUrl)}`+
    `&premium_proxy=true`+
    `&render_js=false`

  try{

    const res = await fetch(proxyUrl)

    if(!res.ok){
      console.log("Proxy failed:", res.status)
      return null
    }

    const html = await res.text()

    if(!html){
      console.log("Missing html")
      return null
    }

    const $ = cheerio.load(html)

    // 🔥 parse JSON-LD (stable Etsy method)
    const scripts = $('script[type="application/ld+json"]')

    for(let i=0;i<scripts.length;i++){

      try{

        const json = JSON.parse($(scripts[i]).html() || "")

        if(json["@type"] === "Product"){

          return{
            title: json.name || "",
            description: json.description || "",
            image: Array.isArray(json.image)
              ? json.image[0]
              : json.image || ""
          }

        }

      }catch(e){}
    }

    console.log("No product JSON found")

    return null

  }catch(e){

    console.log("Parser error:", e)
    return null

  }

}