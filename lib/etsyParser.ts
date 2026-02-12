import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl: string) {

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

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}` +
    `&url=${encodeURIComponent(listingUrl)}` +
    `&render_js=true` +          // ⭐ CRITICAL FIX
    `&premium_proxy=true`

  const res = await fetch(proxyUrl)

  const html = await res.text()

  console.log("HTML LENGTH:", html.length)

  if(!html || html.length < 5000){
    console.log("Got anti-bot HTML")
    return null
  }

  const $ = cheerio.load(html)

  // ---- TITLE ----
  let title =
    $("h1").first().text().trim() ||
    $('meta[property="og:title"]').attr("content") ||
    ""

  // ---- DESCRIPTION ----
  let description =
    $("#description-text").text().trim() ||
    $('meta[name="description"]').attr("content") ||
    ""

  // ---- IMAGE ----
  const image =
    $('meta[property="og:image"]').attr("content") || ""

  if(!title){
    console.log("Parser failed — no title")
    return null
  }

  return {
    title,
    description,
    image
  }
}