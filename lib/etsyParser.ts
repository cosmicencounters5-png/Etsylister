export async function parseEtsyListing(url:string){

  const match =
    url.match(/listing\/(\d+)/) ||
    url.match(/(\d{6,})/)

  if(!match) return null

  const listingUrl = `https://www.etsy.com/listing/${match[1]}`

  try{

    const res = await fetch(
      `https://www.etsy.com/oembed?url=${encodeURIComponent(listingUrl)}`
    )

    if(!res.ok) return null

    const data = await res.json()

    return {
      title: data.title,
      description: "",
      image: data.thumbnail_url
    }

  }catch{
    return null
  }
}