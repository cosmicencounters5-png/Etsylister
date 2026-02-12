import * as cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}` +
    `&url=${encodeURIComponent(listingUrl)}` +
    `&render_js=true&stealth_proxy=true`

  try{

    const res = await fetch(proxyUrl)

    if(!res.ok){
      console.log("Proxy failed:",res.status)
      return null
    }

    const html = await res.text()

    const $ = cheerio.load(html)

    const title =
      $("h1").first().text().trim() ||
      $('meta[property="og:title"]').attr("content")

    const description =
      $('meta[name="description"]').attr("content") || ""

    const image =
      $('meta[property="og:image"]').attr("content") || ""

    if(!title) return null

    return { title, description, image }

  }catch(e){

    console.log("Parser error",e)
    return null

  }
}