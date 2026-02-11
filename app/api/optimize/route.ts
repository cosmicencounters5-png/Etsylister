import { NextResponse } from "next/server"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req: Request){

  try{

    const body = await req.json()
    const html = body.html

    if(!html){
      return NextResponse.json(
        { error:"Missing HTML" },
        { status:400 }
      )
    }

    let listing = null

    // 🔥 LEVEL 1 — JSON LD PARSE
    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){

          listing = {
            title: data.name || "",
            description: data.description || "",
            image: Array.isArray(data.image)
              ? data.image[0]
              : data.image || ""
          }

        }

      }catch(e){}
    }

    // 🔥 LEVEL 2 — META FALLBACK
    if(!listing){

      const title = html.match(/<meta property="og:title" content="([^"]+)"/)
      const desc = html.match(/<meta property="og:description" content="([^"]+)"/)
      const img = html.match(/<meta property="og:image" content="([^"]+)"/)

      if(title){
        listing = {
          title: title?.[1] || "",
          description: desc?.[1] || "",
          image: img?.[1] || ""
        }
      }
    }

    if(!listing){
      return NextResponse.json({
        error:"Hybrid parser failed (Etsy layout changed)"
      })
    }

    // 🔥 AI BRAIN
    const result = await runOptimizerBrain(listing)

    return NextResponse.json({
      original: listing,
      optimized: result
    })

  }catch(e){

    console.log(e)

    return NextResponse.json(
      { error:"Server error" },
      { status:500 }
    )

  }

}