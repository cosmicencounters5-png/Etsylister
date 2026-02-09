import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";
import { analyzeSEO } from "../../../lib/seoAnalyzer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req:Request){

  try{

    const body = await req.json()

    const keyword = body.product || "product"

    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")

    const seo = analyzeSEO(titles)

    const completion = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      messages:[
        {
          role:"user",
          content:`

You are an ELITE Etsy SEO strategist.

CRITICAL RULES:

- EXACTLY 13 tags
- tags must be comma separated
- NO hashtags (#)
- MAX 20 characters per tag
- Etsy SEO optimized
- realistic high converting listing

USER PRODUCT:
${keyword}

SEO SIGNALS:
${JSON.stringify(seo)}

Return ONLY JSON:

{
"title":"",
"description":"",
"tags":"",
"dominationScore":""
}
`
        }
      ]
    })

    let text = completion.choices?.[0]?.message?.content || "{}"

    text = text.replace(/```json/g,"").replace(/```/g,"").trim()

    let data:any = {}

    try{
      data = JSON.parse(text)
    }catch{
      data = {}
    }

    // HARD SAFETY
    data.title ??= ""
    data.description ??= ""
    data.tags ??= ""
    data.dominationScore ??= "7.5/10"

    // 🔥 TAG ENFORCER

    let tags = data.tags
      .replace(/#/g,"") // remove hashtags
      .split(",")
      .map((t:string)=>t.trim())
      .filter(Boolean)

    // ensure 13 tags
    if(tags.length < 13){

      const filler = seo.opportunityKeywords || []

      for(let i=0;i<filler.length && tags.length<13;i++){
        tags.push(filler[i])
      }
    }

    tags = tags.slice(0,13).map((t:string)=>t.slice(0,20))

    data.tags = tags.join(", ")

    data.marketInsights = market

    return Response.json(data)

  }catch(error){

    console.log("Generate error:",error)

    return Response.json({
      title:"",
      description:"",
      tags:"",
      dominationScore:""
    })
  }
}