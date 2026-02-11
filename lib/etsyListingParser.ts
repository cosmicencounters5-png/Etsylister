export async function parseEtsyListing(rawUrl:string){

  const match =
    rawUrl.match(/listing\/(\d+)/) ||
    rawUrl.match(/(\d{6,})/)

  if(!match) return null

  const id = match[1]

  try{

    const res = await fetch(
      `https://www.etsy.com/api/v3/ajax/bespoke/member/neu/specs/listing-page?listing_id=${id}`,
      {
        headers:{
          "User-Agent":"Mozilla/5.0",
          "Accept":"application/json"
        }
      }
    )

    const data = await res.json()

    const listing = data?.listing

    if(!listing) return null

    return {
      title: listing.title,
      description: listing.description,
      image: listing.images?.[0]?.url_fullxfull
    }

  }catch(e){

    console.log("JSON parser failed", e)

    return null
  }

}