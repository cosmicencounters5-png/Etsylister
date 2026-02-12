import { NextResponse } from "next/server"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req:Request){

  try{

    const body = await req.json()
    const rawUrl = body.url

    if(!rawUrl){
      return NextResponse.json({ error:"Missing URL" })
    }

    const match =
      rawUrl.match(/listing\/(\d+)/) ||
      rawUrl.match(/(\d{6,})/)

    if(!match){
      return NextResponse.json({ error:"Invalid Etsy URL" })
    }

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    console.log("Fetching:", listingUrl)

    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    })

    const html = await res.text()

    if(!html){
      return NextResponse.json({ error:"Missing HTML" })
    }

    // 🔥 ULTRA JSON-LD extractor
    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    let listing:any = null

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        // CASE 1 — direct Product
        if(data["@type"]==="Product"){
          listing=data
          break
        }

        // CASE 2 — array
        if(Array.isArray(data)){
          const product = data.find(d=>d["@type"]==="Product")
          if(product){
            listing=product
            break
          }
        }

        // CASE 3 — @graph structure
        if(data["@graph"]){
          const product = data["@graph"].find(
            (d:any)=>d["@type"]==="Product"
          )
          if(product){
            listing=product
            break
          }
        }

      }catch(e){}
    }

    if(!listing){
      console.log("NO PRODUCT FOUND")
      return NextResponse.json({ error:"Could not parse listing" })
    }

    const parsed = {
      title: listing.name || "",
      description: listing.description || "",
      image: Array.isArray(listing.image)
        ? listing.image[0]
        : listing.image
    }

    const optimized = await runOptimizerBrain(parsed)

    return NextResponse.json({
      original:parsed,
      optimized
    })

  }catch(e){

    console.log("SERVER ERROR",e)

    return NextResponse.json({ error:"Server error" })

  }

}