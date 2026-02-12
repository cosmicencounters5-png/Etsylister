import { NextResponse } from "next/server"
import { parseEtsyListing } from "@/lib/etsyParser"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const url = body.url

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 })
    }

    // STEP 1 — parse listing
    const listing = await parseEtsyListing(url)

    if (!listing) {
      return NextResponse.json({ error: "Could not parse listing" }, { status: 400 })
    }

    // STEP 2 — Gemini AI

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    })

    const prompt = `
You are an Etsy SEO expert.

Original title:
${listing.title}

Generate:

1. Optimized Etsy SEO title
2. SEO optimized description
3. Suggested tags

Return JSON:

{
"title":"",
"description":"",
"tags":""
}
`

    const result = await model.generateContent(prompt)

    const text = result.response.text()

    const optimized = JSON.parse(text)

    return NextResponse.json({
      original: listing,
      optimized
    })

  } catch (e) {

    console.log("OPTIMIZER ERROR:", e)

    return NextResponse.json(
      { error: "Optimizer failed" },
      { status: 500 }
    )

  }
}