// app/api/optimize/route.ts

import { NextResponse } from "next/server"
import { runOptimizerBrain } from "@/lib/optimizerBrain"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    // ✅ receive parsed listing from client
    const listing = body.listing

    // 🔥 DEBUG LOG
    console.log("Optimizer received listing:", listing)

    if (!listing || !listing.title) {

      console.log("❌ Missing listing data")

      return NextResponse.json(
        { error: "Missing listing data" },
        { status: 400 }
      )
    }

    // 🔥 STEP 1 — detect signals

    const text = (listing.title + " " + (listing.description || "")).toLowerCase()

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

    // 🔥 STEP 2 — run optimizer brain

    const result = await runOptimizerBrain({
      ...listing,
      signals
    })

    console.log("✅ Optimizer result generated")

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