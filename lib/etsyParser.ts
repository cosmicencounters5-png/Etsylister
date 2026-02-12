import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingId = match[1]

  const listingUrl = `https://www.etsy.com/listing/${listingId}`

  // 🔥 LOW COST MODE
  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}` +
    `&url=${encodeURIComponent(listingUrl)}` +
    `&stealth_proxy=true` +
    `&render_js=false`   // 👈 HUGE credit savings

  try{

    const res = await fetch(proxyUrl)

    if(!res.ok){
      console.log("Proxy failed:",res.status)
      return null
    }

    const html = await res.text()

    if(!html){
      console.log("Missing html")
      return null
    }

    const $ = cheerio.load(html)

    // 🔥 PRIMARY METHOD — JSON-LD
    const scripts = $('script[type="application/ld+json"]')

    for(let i=0;i<scripts.length;i++){

      try{

        const json = JSON.parse($(scripts[i]).html() || "")

        if(json["@type"] === "Product"){

          return {
            title: json.name || "",
            description: json.description || "",
            image: Array.isArray(json.image)
              ? json.image[0]
              : json.image || ""
          }

        }

      }catch(e){}
    }

    console.log("JSON-LD not found")
    return null

  }catch(e){

    console.log("Parser error",e)
    return null

  }
}