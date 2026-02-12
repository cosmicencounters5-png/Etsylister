import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyParser"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

// 🔥 TEMP CACHE (replace with DB later)
const listingCache = new Map()

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const url = body.url

    if(!url){
      return NextResponse.json(
        { error:"Missing URL" },
        { status:400 }
      )
    }

    // extract listing id
    const match =
      url.match(/listing\/(\d+)/) ||
      url.match(/(\d{6,})/)

    if(!match){
      return NextResponse.json(
        { error:"Invalid Etsy URL" },
        { status:400 }
      )
    }

    const listingId = match[1]

    // 🔥 STEP 1 — CACHE CHECK

    if(listingCache.has(listingId)){

      console.log("CACHE HIT")

      const cached = listingCache.get(listingId)

      return NextResponse.json(cached)
    }

    console.log("CACHE MISS → scraping")

    // 🔥 STEP 2 — PARSE

    const listing = await parseEtsyListing(url)

    if(!listing){

      return NextResponse.json(
        { error:"Could not parse listing" },
        { status:400 }
      )

    }

    // 🔥 STEP 3 — OPTIMIZER

    const result = await runOptimizerBrain(listing)

    const response = {
      original: listing,
      optimized: result
    }

    // 🔥 STEP 4 — SAVE CACHE

    listingCache.set(listingId, response)

    return NextResponse.json(response)

  }catch(e){

    console.log(e)

    return NextResponse.json(
      { error:"Server error" },
      { status:500 }
    )

  }

}