import { NextResponse } from "next/server"

export async function POST(req:Request){

  try{

    const { url } = await req.json()

    if(!url){
      return NextResponse.json({ error:"Missing URL" },{ status:400 })
    }

    const keyword = url
      .replace(/-/g," ")
      .split("/")
      .pop()

    const prompt = `
Act as Etsy SEO expert.

Search only using:
site:etsy.com ${keyword}

Analyze top ranking listings.

Return JSON:

{
  title:"",
  description:"",
  tags:""
}
`

    const res = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="+process.env.GEMINI_API_KEY,
      {
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          contents:[{ parts:[{ text:prompt }]}],
          generationConfig:{ temperature:0.1 }
        })
      }
    )

    const data = await res.json()

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text

    const parsed = JSON.parse(text)

    return NextResponse.json({
      original:{ title: keyword },
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