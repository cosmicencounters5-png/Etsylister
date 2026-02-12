import { NextResponse } from "next/server"

function extractKeyword(url:string){

  const parts = url.split("/")

  const last = parts[parts.length-1] || ""

  return last.replace(/-/g," ")
}

export async function POST(req:Request){

  try{

    const { url } = await req.json()

    if(!url){

      return NextResponse.json(
        { error:"Missing URL" },
        { status:400 }
      )

    }

    const keyword = extractKeyword(url)

    const prompt = `

You are an Etsy SEO AI strategist.

Analyze Etsy search results ONLY using:

site:etsy.com ${keyword}

DO NOT hallucinate.

Return STRICT JSON:

{
"title":"",
"description":"",
"tags":"",
"strategyInsights":"",
"seoAdvantage":"",
"competitionInsights":""
}

`

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+process.env.GEMINI_API_KEY,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          contents:[{ parts:[{ text:prompt }]}],
          generationConfig:{
            temperature:0.1
          }
        })
      }
    )

    const data = await res.json()

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text

    const parsed = JSON.parse(text)

    return NextResponse.json({

      original:{
        title: keyword
      },

      optimized: parsed

    })

  }catch(e){

    console.log(e)

    return NextResponse.json(
      { error:"Optimizer failed" },
      { status:500 }
    )

  }
}