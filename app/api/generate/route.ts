import OpenAI from "openai"
import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req: Request){

  try{

    const body = await req.json()

    const keyword = body?.product || "product"

    // 🔥 LIVE MARKET SCAN
    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")

    const seo = analyzeSEO(titles)

    const competitorData = competitors.map((c:any)=>({
      title:c.title,
      inCart:c.inCart,
      reviews:c.reviews,
      profitability:c.profitability,
      trendScore:c.trendScore,
      dominationScore:c.dominationScore
    }))

    const completion = await openai.chat.completions.create({

      model:"gpt-4o-mini",

      messages:[
        {
          role:"user",
          content:`
You are an ELITE Etsy domination strategist.

USER PRODUCT:
${keyword}

REAL COMPETITOR DATA:
${JSON.stringify(competitorData,null,2)}

LIVE MARKET SUMMARY:
${JSON.stringify(market,null,2)}

SEO SIGNALS:
${JSON.stringify(seo,null,2)}

Return ONLY JSON:

{
"title":"",
"description":"",
"tags":"",
"strategyInsights":"",
"dominationScore":"",
"seoAdvantage":"",
"keywordCoverage":"",
"competitorInsights":"",
"titleFormula":""
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
      console.log("AI JSON parse failed:", text)
    }

    // 🔥 SAFETY DEFAULTS
    data.title ??= ""
    data.description ??= ""
    data.tags ??= ""
    data.strategyInsights ??= ""
    data.dominationScore ??= ""
    data.seoAdvantage ??= ""
    data.keywordCoverage ??= ""
    data.competitorInsights ??= ""
    data.titleFormula ??= ""

    // 🔥 TAG ENFORCER
    let tags = data.tags
      .split(",")
      .map((t:string)=>t.trim())
      .filter(Boolean)

    tags = tags.map((t:string)=> t.slice(0,20)).slice(0,13)

    data.tags = tags.join(", ")

    data.marketInsights = market

    return Response.json(data)

  }catch(error){

    console.log("Generate API error:", error)

    return Response.json({
      title:"",
      description:"",
      tags:"",
      strategyInsights:"",
      dominationScore:"",
      seoAdvantage:"",
      keywordCoverage:"",
      competitorInsights:"",
      titleFormula:"",
      marketInsights:{}
    })

  }

}