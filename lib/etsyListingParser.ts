export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match){
    console.log("NO MATCH ID")
    return null
  }

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  console.log("FETCHING:", listingUrl)

  const res = await fetch(listingUrl,{
    headers:{
      "User-Agent":"Mozilla/5.0",
      "Accept-Language":"en-US,en;q=0.9"
    }
  })

  console.log("STATUS:", res.status)

  const html = await res.text()

  console.log("HTML LENGTH:", html.length)
  console.log("FIRST 500 CHARS:", html.slice(0,500))

  return null
}