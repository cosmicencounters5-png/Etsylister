import cheerio from "cheerio"

export async function parseEtsyListing(url:string){

  const match =
    url.match(/listing\/(\d+)/) ||
    url.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?api_key=${apiKey}`+
    `&url=${encodeURIComponent(listingUrl)}`+
    `&render_js=true`+
    `&premium_proxy=true`+
    `&wait=2000`

  const res = await fetch(proxyUrl)

  const html = await res.text()

  console.log("HTML LENGTH:", html.length)

  // Detect anti-bot
  if(html.length < 20000){
    console.log("Got anti-bot HTML")
    return null
  }

  const $ = cheerio.load(html)

  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text()

  const description =
    $('meta[name="description"]').attr("content") || ""

  const image =
    $('meta[property="og:image"]').attr("content")

  if(!title) return null

  return { title, description, image }
}