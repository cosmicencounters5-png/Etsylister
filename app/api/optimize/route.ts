import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyParser"

export async function POST(req:Request){

  try{

    const body = await req.json()

const listing = await parseEtsyListing(url)

    if(!listing){

      return NextResponse.json(
        { error:"Could not parse listing" },
        { status:400 }
      )
    }

    return NextResponse.json({
      original: listing,
      optimized:{
        title: listing.title + " | AI Optimized",
        description: listing.description,
        tags:"AI generated tags"
      }
    })

  }catch(e){

    return NextResponse.json(
      { error:"Something went wrong"},
      { status:500 }
    )
  }
}