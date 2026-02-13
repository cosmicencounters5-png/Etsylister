import { NextResponse } from "next/server"

export async function POST(req: Request){

  try{

    const body = await req.json()
    const idea = body.idea

    if(!idea){

      return NextResponse.json(
        { error:"Missing idea" },
        { status:400 }
      )

    }

    const ai = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json",
          "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
        },
        body:JSON.stringify({
          model:"gpt-4.1-mini",
          messages:[
            {
              role:"system",
              content:`
You are an elite Etsy market strategist.

Analyze Etsy product idea potential.

Rules:

- Be realistic.
- Think like Etsy algorithm + buyer psychology.
- Return ONLY JSON.

FORMAT:

{
 "score": number,
 "competition":"LOW|MEDIUM|HIGH",
 "demand":"LOW|MEDIUM|HIGH",
 "trend":"FALLING|STABLE|RISING",
 "logic":"...",
 "strategy":"...",
 "listingDirection":"..."
}
`
            },
            {
              role:"user",
              content:idea
            }
          ]
        })
      }
    )

    const data = await ai.json()

    let text = data.choices[0].message.content

    text = text
      .replace(/```json/g,"")
      .replace(/```/g,"")
      .trim()

    const parsed = JSON.parse(text)

    return NextResponse.json(parsed)

  }catch(e){

    console.log("IDEA SCAN ERROR:", e)

    return NextResponse.json(
      { error:"Idea scan failed" },
      { status:500 }
    )

  }

}