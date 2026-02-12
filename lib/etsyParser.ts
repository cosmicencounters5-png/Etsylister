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
    `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}` +
    `&url=${encodeURIComponent(listingUrl)}` +
    `&render_js=false`

  try{

    const res = await fetch(proxyUrl)

    if(!res.ok){
      console.log("Proxy failed", res.status)
      return null
    }

    const html = await res.text()

    if(!html){
      console.log("Missing HTML")
      return null
    }

    const $ = cheerio.load(html)

    // 🔥 Title
    let title =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr("content") ||
      ""

    // 🔥 Description
    let description =
      $('meta[name="description"]').attr("content") ||
      ""

    // 🔥 Image
    let image =
      $('meta[property="og:image"]').attr("content") ||
      ""

    if(!title) return null

    return {
      title,
      description,
      image
    }

  }catch(e){
    console.log("Parser error", e)
    return null
  }
}