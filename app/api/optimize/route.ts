import { NextResponse } from "next/server"

export async function POST(req: Request){

  try{

    const body = await req.json()

    const title = body.title
    const description = body.description

    if(!title || !description){

      return NextResponse.json(
        { error:"Missing fields" },
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

You are an ELITE Etsy SEO expert.

STRICT RULES:

- Titles MUST be long Etsy-style titles.
- Include multiple keyword phrases separated by "|".
- Include buyer intent words.
- Include product type + audience + benefit.
- Target max keyword density without spam.

Tag rules:

- Minimum 13 tags.
- Max 20 characters per tag.
- Comma separated.
- High search intent.

Return ONLY JSON:

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
              role:"user",
              content:`Title:${title}\nDescription:${description}`
            }

          ]

        })
      }
    )

    const data = await ai.json()

    let text = data.choices[0].message.content

    text = text.replace(/```json/g,"").replace(/```/g,"").trim()

    const parsed = JSON.parse(text)

    return NextResponse.json(parsed)

  }catch(e){

    console.log(e)

    return NextResponse.json(
      { error:"Optimizer failed" },
      { status:500 }
    )

  }

}