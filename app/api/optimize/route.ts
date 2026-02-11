import { NextResponse } from "next/server"
import { runOptimizerBrain } from "@/lib/optimizerBrain"
import { parseEtsyListing } from "@/lib/etsyListingParser"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    let url = body.url

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL" },
        { status: 400 }
      )
    }

    // 🔥 extract listing id from ANY Etsy link
    const match =
      url.match(/listing\/(\d+)/) ||
      url.match(/(\d{6,})/)

    if (!match) {
      return NextResponse.json(
        { error: "Invalid Etsy URL" },
        { status: 400 }
      )
    }

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    // ✅ PARSE HERE
    const listing = await parseEtsyListing(listingUrl)

    if (!listing) {
      return NextResponse.json(
        { error: "Could not parse listing" },
        { status: 400 }
      )
    }

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

    const result = await runOptimizerBrain({
      ...listing,
      signals
    })

    return NextResponse.json({
      original: listing,
      optimized: result
    })

  } catch (e) {

    console.error(e)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )

  }

}