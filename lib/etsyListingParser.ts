export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const id = match[1]

  const apiUrl =
    `https://openapi.etsy.com/v3/application/listings/${id}`

  // 🔥 fallback scraping endpoint Etsy still exposes
  const fallback =
    `https://www.etsy.com/api/v3/ajax/bespoke/public/boe/listings/${id}`

  try{

    const res = await fetch(fallback,{
      headers:{
        "User-Agent":"Mozilla/5.0",
        "x-requested-with":"XMLHttpRequest",
        "accept":"application/json"
      }
    })

    const data = await res.json()

    const listing = data?.listing

    if(!listing) return null

    return {
      title: listing.title,
      description: listing.description,
      image: listing.images?.[0]?.url_fullxfull
    }

  }catch(e){
    console.log("parser failed", e)
    return null
  }

}