import { NextResponse } from "next/server"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req:Request){

  try{

    const body = await req.json()
    const url = body.url

    if(!url){
      return NextResponse.json({ error:"Missing URL" },{ status:400 })
    }

    const match =
      url.match(/listing\/(\d+)/) ||
      url.match(/(\d{6,})/)

    if(!match){
      return NextResponse.json({ error:"Invalid Etsy URL" })
    }

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    // 🔥 SERVER SIDE FETCH (NO CORS BLOCK)
    const res = await fetch(listingUrl,{
      headers:{
        "User-Agent":"Mozilla/5.0"
      }
    })

    const html = await res.text()

    // extract JSON-LD
    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    let listing:any = null

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){
          listing = {
            title:data.name,
            description:data.description,
            image:Array.isArray(data.image)
              ? data.image[0]
              : data.image
          }
        }

      }catch(e){}
    }

    if(!listing){
      return NextResponse.json({ error:"Could not parse listing" })
    }

    const optimized = await runOptimizerBrain(listing)

    return NextResponse.json({
      original:listing,
      optimized
    })

  }catch(e){

    console.log(e)

    return NextResponse.json({ error:"Server error" })

  }
}