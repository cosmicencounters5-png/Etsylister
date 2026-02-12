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
    `&premium_proxy=true`

  const res = await fetch(proxyUrl)

  const html = await res.text()

  if(!html || html.length < 10000){
    console.log("Missing html")
    return null
  }

  function extractMeta(property:string){

    const regex = new RegExp(
      `<meta[^>]+property=["']${property}["'][^>]+content=["']([^"]+)["']`,
      "i"
    )

    const match = html.match(regex)

    return match ? match[1] : ""
  }

  const title = extractMeta("og:title")
  const description = extractMeta("og:description")
  const image = extractMeta("og:image")

  if(!title){
    console.log("Missing og:title")
    return null
  }

  return {
    title,
    description,
    image
  }
}