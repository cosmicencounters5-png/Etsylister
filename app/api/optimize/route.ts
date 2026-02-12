import { NextResponse } from "next/server"

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

    // Extract listing id
    const match = url.match(/listing\/(\d+)/)

    if (!match) {
      return NextResponse.json(
        { error: "Invalid Etsy URL" },
        { status: 400 }
      )
    }

    const listingId = match[1]

    // 🔥 fetch OPEN meta endpoint
    const pageRes = await fetch(
      `https://www.etsy.com/listing/${listingId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      }
    )

    const html = await pageRes.text()

    if (!html) {
      return NextResponse.json(
        { error: "Missing HTML" },
        { status: 500 }
      )
    }

    // extract OG title + description (no cheerio needed)
    const titleMatch = html.match(
      /property="og:title"\s*content="([^"]+)"/
    )

    const descMatch = html.match(
      /name="description"\s*content="([^"]+)"/
    )

    const title = titleMatch?.[1] || ""
    const description = descMatch?.[1] || ""

    if (!title) {
      return NextResponse.json(
        { error: "Could not parse listing" },
        { status: 400 }
      )
    }

    // send REAL data to Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
Optimize this Etsy title:

${title}

Return ONLY JSON:

{
 "optimizedTitle":"..."
}
`
                }
              ]
            }
          ]
        })
      }
    )

    const geminiData = await geminiRes.json()

    let text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    const parsed = JSON.parse(text)

    return NextResponse.json({
      original: {
        title,
        description
      },
      optimized: parsed
    })

  } catch (e) {

    console.log(e)

    return NextResponse.json(
      { error: "Optimizer failed" },
      { status: 500 }
    )
  }
}