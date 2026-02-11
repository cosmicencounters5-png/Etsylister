// app/api/optimize/route.ts

import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyListingParser"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req:Request){

  try{

    const body = await req.json()
    const url = body.url

    if(!url){
      return NextResponse.json(
        { error:"Missing URL" },
        { status:400 }
      )
    }

    // 🔥 STEP 1 — parse Etsy listing
    const listing = await parseEtsyListing(url)

    if(!listing){
      return NextResponse.json(
        { error:"Could not parse listing" },
        { status:400 }
      )
    }

    // 🔥 STEP 2 — detect signals (AI brain pre-analysis)

    const text = (listing.title + " " + listing.description).toLowerCase()

    const signals = {

      hasDigitalIntent:
        text.includes("digital") ||
        text.includes("printable") ||
        text.includes("instant download"),

      hasBuyerIntent:
        text.includes("gift") ||
        text.includes("personalized") ||
        text.includes("custom"),

      longTailScore: listing.title.split(" ").length

    }

    // 🔥 STEP 3 — run optimizer brain

    const result = await runOptimizerBrain({
      ...listing,
      signals
    })

    return NextResponse.json({

      original: listing,
      optimized: result

    })

  }catch(e){

    console.error(e)

    return NextResponse.json(
      { error:"Server error" },
      { status:500 }
    )

  }

}