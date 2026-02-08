export async function parseEtsyListing(url:string){

  const res = await fetch(url,{
    headers:{
      "User-Agent":"Mozilla/5.0"
    }
  })

  const html = await res.text()

  const titleMatch = html.match(/<title>(.*?)<\/title>/i)
  const title = titleMatch ? titleMatch[1] : ""

  const descMatch = html.match(/"description":"(.*?)"/)
  const description = descMatch ? descMatch[1] : ""

  return {
    title,
    description
  }
}