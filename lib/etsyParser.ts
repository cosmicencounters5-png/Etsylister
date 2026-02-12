import * as cheerio from "cheerio"

export async function parseEtsyListing(url:string){

  const match = url.match(/listing\/(\d+)/) || url.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  if(!apiKey){
    console.log("Missing API key")
    return null
  }

  const proxyUrl =
  `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(listingUrl)}`

  try{

    const res = await fetch(proxyUrl)

    const html = await res.text()

    if(!html){
      console.log("Missing HTML")
      return null
    }

    const $ = cheerio.load(html)

    const title =
      $('h1').first().text().trim() ||
      $('meta[property="og:title"]').attr('content') ||
      ''

    const description =
      $('meta[name="description"]').attr('content') ||
      ''

    const image =
      $('meta[property="og:image"]').attr('content') ||
      ''

    if(!title){
      console.log("No title found")
      return null
    }

    return {
      title,
      description,
      image
    }

  }catch(e){

    console.log("Parser error:", e)
    return null
  }
}