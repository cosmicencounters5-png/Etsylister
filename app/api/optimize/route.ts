import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const body = await req.json()
    const url = body.url

    if (!url) {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 })
    }

    // extract keyword from URL
    const keyword =
      url.split("/").pop()?.replace(/-/g, " ") || url

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
Search Google for:

site:etsy.com ${keyword}

Find top ranking Etsy listings.

Return ONLY valid JSON:

{
  "originalTitle":"...",
  "description":"...",
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

    const data = await geminiRes.json()

    let text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || ""

    // 🔥 remove markdown json wrapper
    text = text.replace(/```json/g, "").replace(/```/g, "").trim()

    const parsed = JSON.parse(text)

    return NextResponse.json({
      original: {
        title: parsed.originalTitle,
        description: parsed.description
      },
      optimized: {
        title: parsed.optimizedTitle
      }
    })

  } catch (e) {

    console.log("OPTIMIZER ERROR:", e)

    return NextResponse.json(
      { error: "Optimizer failed" },
      { status: 500 }
    )
  }
}