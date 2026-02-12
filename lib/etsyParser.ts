import * as cheerio from "cheerio"

async function fetchHtml(url:string){

  // TRY DIRECT FIRST (FREE)
  try{

    const res = await fetch(url,{
      headers:{
        "User-Agent":"Mozilla/5.0"
      }
    })

    if(res.ok){

      const html = await res.text()

      if(html.includes("listing") && html.length > 5000){
        return html
      }

    }

  }catch(e){}

  // FALLBACK → SCRAPINGBEE

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/?api_key=${process.env.SCRAPINGBEE_API_KEY}` +
    `&url=${encodeURIComponent(url)}` +
    `&render_js=true&stealth_proxy=true`

  const proxyRes = await fetch(proxyUrl)

  if(!proxyRes.ok) return null

  return await proxyRes.text()
}

export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const html = await fetchHtml(listingUrl)

  if(!html){
    console.log("Missing html")
    return null
  }

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
}