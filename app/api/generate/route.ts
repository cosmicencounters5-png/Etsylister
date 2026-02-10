import OpenAI from "openai"
import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function generateListing(prompt:string){

  const completion = await openai.chat.completions.create({
    model:"gpt-4o-mini",
    messages:[{ role:"user", content:prompt }]
  })

  let text = completion.choices?.[0]?.message?.content || "{}"

  text = text.replace(/```json/g,"").replace(/```/g,"").trim()

  try{
    return JSON.parse(text)
  }catch{
    console.log("JSON parse failed:", text)
    return {}
  }
}

export async function POST(req: Request){

  try{

    const body = await req.json()
    const keyword = body.product || "product"

    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")

    const seo = analyzeSEO(titles)

    const basePrompt = `

You are an EXTREME Etsy market domination AI.

You MUST act like:

- elite Etsy growth strategist
- conversion expert
- keyword domination analyst

OBJECTIVE:
Create listing that OUTRANKS competitors.

PRODUCT:
${keyword}

COMPETITORS:
${JSON.stringify(competitors,null,2)}

SEO DATA:
${JSON.stringify(seo,null,2)}

RULES:

TITLE:
- keyword stacking
- long tail heavy
- "|" separators

TAGS:
- exactly 13 tags
- long tail phrases
- NO hashtags
- max 20 characters each
- comma separated

RETURN ONLY JSON:

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

    let data = await generateListing(basePrompt)

    // 🔥 SELF IMPROVEMENT LOOP WITH FULL CONTEXT
    const evaluationPrompt = `

You are auditing your own work.

Rewrite ONLY if stronger SEO possible.

PRODUCT:
${keyword}

SEO DATA:
${JSON.stringify(seo,null,2)}

CURRENT LISTING:
${JSON.stringify(data,null,2)}

Return same JSON structure.

`

    const improved = await generateListing(evaluationPrompt)

    if(improved.title){
      data = improved
    }

    // TAG ENFORCER
    let tags = (data.tags || "")
      .split(",")
      .map((t:string)=>t.trim().replace("#",""))
      .filter(Boolean)

    tags = tags.map((t:string)=> t.slice(0,20))
    tags = tags.slice(0,13)

    data.tags = tags.join(", ")

    // SAFE DEFAULTS
    data.title ??= ""
    data.description ??= ""
    data.strategyInsights ??= ""
    data.dominationScore ??= ""
    data.seoAdvantage ??= ""
    data.keywordCoverage ??= ""
    data.competitorInsights ??= ""
    data.titleFormula ??= ""

    data.marketInsights = market

    return Response.json(data)

  }catch(error){

    console.log("Generate error:", error)

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