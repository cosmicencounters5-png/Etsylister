import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  if(!apiKey){
    console.log("Missing ScrapingBee API key")
    return null
  }

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/`+
    `?api_key=${apiKey}`+
    `&url=${encodeURIComponent(listingUrl)}`+
    `&premium_proxy=true`+
    `&render_js=false`

  try{

    const res = await fetch(proxyUrl)

    if(!res.ok){
      console.log("Proxy fetch failed:", res.status)
      return null
    }

    const html = await res.text()

    if(!html){
      console.log("Missing HTML")
      return null
    }

    console.log("HTML received length:", html.length)

    const $ = cheerio.load(html)

    // ✅ GOD MODE parsing order

    // 1️⃣ JSON-LD (BEST)
    const scripts = $('script[type="application/ld+json"]')

    for(let i=0;i<scripts.length;i++){

      try{

        const data = JSON.parse($(scripts[i]).html() || "")

        if(data["@type"]==="Product"){

          return {
            title: data.name || "",
            description: data.description || "",
            image: Array.isArray(data.image)
              ? data.image[0]
              : data.image || ""
          }

        }

      }catch(e){}
    }

    // 2️⃣ OG meta fallback

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $('title').text().replace(" - Etsy","")

    const description =
      $('meta[property="og:description"]').attr("content") || ""

    const image =
      $('meta[property="og:image"]').attr("content") || ""

    if(title){

      console.log("Fallback parser used")

      return {
        title,
        description,
        image
      }

    }

    console.log("Parser failed — no title found")
    return null

  }catch(e){

    console.log("Parser error:", e)
    return null

  }
}