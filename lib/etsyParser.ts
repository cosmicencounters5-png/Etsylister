import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  if(!rawUrl) return null

  // extract listing id
  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  if(!apiKey){
    console.log("Missing ScrapingBee key")
    return null
  }

  // 🔥 IMPORTANT — JS RENDERING ON
  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?`+
    `api_key=${apiKey}`+
    `&url=${encodeURIComponent(listingUrl)}`+
    `&render_js=true`

  const res = await fetch(proxyUrl)

  if(!res.ok){
    console.log("ScrapingBee failed:",res.status)
    return null
  }

  const html = await res.text()

  if(!html || html.length < 1000){
    console.log("Missing html")
    return null
  }

  const $ = cheerio.load(html)

  // TITLE
  const title =
    $('h1[data-buy-box-listing-title]').text().trim() ||
    $('h1').first().text().trim()

  // DESCRIPTION
  const description =
    $('#description-text').text().trim() ||
    $('meta[name="description"]').attr("content") ||
    ""

  // IMAGE
  const image =
    $('meta[property="og:image"]').attr("content") || ""

  if(!title){
    console.log("No title found")
    return null
  }

  return {
    title,
    description,
    image
  }
}