import cheerio from "cheerio"

export async function parseEtsyListing(rawUrl: string) {

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if (!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  const apiKey = process.env.SCRAPINGBEE_API_KEY

  const proxyUrl =
    `https://app.scrapingbee.com/api/v1/` +
    `?api_key=${apiKey}` +
    `&url=${encodeURIComponent(listingUrl)}` +
    `&render_js=true` +          // ⭐ CRITICAL
    `&stealth_proxy=true` +      // ⭐ bypass anti-bot
    `&wait_browser=networkidle0` // ⭐ wait for page load

  const res = await fetch(proxyUrl)

  if (!res.ok) {

    console.log("STATUS:", res.status)

    return null
  }

  const html = await res.text()

  console.log("HTML LENGTH:", html.length)

  // detect anti-bot
  if (
    html.includes("captcha") ||
    html.includes("Access denied") ||
    html.length < 5000
  ) {
    console.log("Got anti-bot HTML")
    return null
  }

  const $ = cheerio.load(html)

  const title =
    $("h1").first().text().trim() ||
    $('meta[property="og:title"]').attr("content")

  const description =
    $("#description").text().trim() ||
    $('meta[name="description"]').attr("content")

  const image =
    $('meta[property="og:image"]').attr("content")

  if (!title) {
    console.log("No parser matched")
    return null
  }

  return {
    title,
    description,
    image
  }
}