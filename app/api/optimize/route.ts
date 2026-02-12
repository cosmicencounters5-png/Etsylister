import { NextResponse } from "next/server"

export async function POST(req: Request) {

  try {

    const body = await req.json()

    const title = body.title
    const description = body.description

    if (!title || !description) {

      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      )

    }

    const ai = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          temperature: 0.3,
          messages: [
            {
              role: "system",
              content: `
You are an elite Etsy SEO optimizer.

STRICT RULES:

- Generate REAL Etsy buyer search tags.
- NO generic words like "seo", "ai tool".
- Tags must be strong buyer intent phrases.
- Max 20 characters per tag.
- Minimum 13 tags.

Return ONLY valid JSON:

{
 "beforeScore": number,
 "afterScore": number,
 "optimized":{
   "title":"...",
   "description":"...",
   "tags":["","",""]
 }
}
`
            },
            {
              role: "user",
              content: `Title:${title}\nDescription:${description}`
            }
          ]
        })
      }
    )

    const data = await ai.json()

    let text = data?.choices?.[0]?.message?.content || ""

    // 🔥 CLEAN AI RESPONSE
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()

    let parsed

    try {

      parsed = JSON.parse(text)

    } catch {

      console.log("JSON parse failed — fallback triggered")

      return NextResponse.json(
        { error: "AI response parse failed" },
        { status: 500 }
      )

    }

    // 🔥 HARD SAFETY FILTER (GOD MODE)

    let tags = parsed.optimized?.tags || []

    tags = tags
      .map((t: string) => t.trim())
      .filter((t: string) => t.length > 2 && t.length <= 20)

    // ensure minimum 13 tags
    while (tags.length < 13) {

      tags.push("etsy trending item")

    }

    parsed.optimized.tags = tags.slice(0, 13)

    return NextResponse.json(parsed)

  } catch (e) {

    console.log("OPTIMIZER ERROR:", e)

    return NextResponse.json(
      { error: "Optimizer failed" },
      { status: 500 }
    )

  }

}