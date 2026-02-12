import cheerio from "cheerio"

export async function parseEtsyListing(rawUrl:string){

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

  const proxyUrl = `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}&url=${encodeURIComponent(listingUrl)}&render_js=true&premium_proxy=true`

  try{

    const res = await fetch(proxyUrl)

    const html = await res.text()

    if(!html){
      console.log("Missing html")
      return null
    }

    const $ = cheerio.load(html)

    const title =
      $("h1").first().text().trim() ||
      $("meta[property='og:title']").attr("content")

    const description =
      $("meta[name='description']").attr("content") || ""

    const image =
      $("meta[property='og:image']").attr("content") || ""

    if(!title){
      console.log("Could not extract title")
      return null
    }

    return {
      title,
      description,
      image
    }

  }catch(e){

    console.log("Parser failed",e)

    return null
  }
}