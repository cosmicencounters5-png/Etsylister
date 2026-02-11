import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyListingParser"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const url = body.url

    if (!url) {
      return NextResponse.json(
        { error: "Missing URL" },
        { status: 400 }
      )
    }

    console.log("Parsing URL:", url)

    // ✅ PARSE INSIDE API
    const listing = await parseEtsyListing(url)

    if (!listing) {

      console.log("Parser returned null")

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

    console.error("Optimizer API error:", e)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}