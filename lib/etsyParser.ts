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

    const res = await fetch(proxyUrl,{
      method:"GET",
      headers:{
        "Accept":"text/html",
        "User-Agent":"Mozilla/5.0"
      }
    })

    if(!res.ok){
      console.log("ScrapingBee status:", res.status)
      return null
    }

    const html = await res.text()

    console.log("HTML length:", html.length)

    if(!html || html.length < 500){
      console.log("Missing html or blocked")
      return null
    }

    const $ = cheerio.load(html)

    const title =
      $("meta[property='og:title']").attr("content") ||
      $("h1").first().text().trim()

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