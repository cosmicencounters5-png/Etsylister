import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyParser"
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

    console.log("Parsing:", url)

    const listing = await parseEtsyListing(url)

    if(!listing){
      return NextResponse.json(
        { error:"Could not parse listing" },
        { status:400 }
      )
    }

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