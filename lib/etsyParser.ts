import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  if(!apiKey){
    console.log("Missing scrapingbee key")
    return null
  }

  try{

    // 🔥 ScrapingBee proxy with anti-block setup
    const proxyUrl =
      `https://app.scrapingbee.com/api/v1/`+
      `?api_key=${apiKey}`+
      `&url=${encodeURIComponent(listingUrl)}`+
      `&render_js=true`+
      `&premium_proxy=true`+
      `&country_code=us`

    const res = await fetch(proxyUrl)

    const html = await res.text()

    console.log("STATUS:", res.status)
    console.log("HTML LENGTH:", html.length)

    if(!html || html.length < 500){
      console.log("Missing HTML")
      return null
    }

    const $ = cheerio.load(html)

    // ======================================
    // 🔥 METHOD 1 — JSON-LD (BEST)
    // ======================================

    const scripts = $("script[type='application/ld+json']")

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

    // ======================================
    // 🔥 METHOD 2 — OG META FALLBACK
    // ======================================

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("title").text().replace(" - Etsy","")

    const description =
      $("meta[property='og:description']").attr("content") || ""

    const image =
      $("meta[property='og:image']").attr("content") || ""

    if(title){

      return {
        title,
        description,
        image
      }

    }

    console.log("No parser matched")

    return null

  }catch(e){

    console.log("Parser failed", e)
    return null

  }

}