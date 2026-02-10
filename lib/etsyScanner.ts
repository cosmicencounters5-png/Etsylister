import OpenAI from "openai"
import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

async function generateListing(prompt:string){

  const completion = await openai.chat.completions.create({
    model:"gpt-4o-mini",
    messages:[
      {
        role:"user",
        content:prompt
      }
    ]
  })

  let text = completion.choices?.[0]?.message?.content || "{}"

  text = text.replace(/```json/g,"").replace(/```/g,"").trim()

  try{
    return JSON.parse(text)
  }catch{
    return {}
  }
}

export async function POST(req: Request){

  try{

    const body = await req.json()
    const keyword = body.product || "product"

    // 🔥 LIVE MARKET SCAN
    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")
    const seo = analyzeSEO(titles)

    // 🔥 SMART DATA (prevents AI overload)
    const topCompetitors =
      competitors
        .sort((a:any,b:any)=>b.dominationScore-a.dominationScore)
        .slice(0,5)
        .map((c:any)=>({
          title:c.title,
          inCart:c.inCart,
          reviews:c.reviews,
          dominationScore:c.dominationScore
        }))

    const basePrompt = `

You are an EXTREME Etsy SEO domination AI.

You are NOT allowed to produce generic marketing copy.

OBJECTIVE:
Create listing that outranks competitors.

PRODUCT:
${keyword}

TOP COMPETITOR INSIGHTS:
${JSON.stringify(topCompetitors,null,2)}

SEO DATA:
${JSON.stringify(seo,null,2)}

RULES:

TITLE:
- keyword stacking
- long tail heavy
- use "|" separator

TAGS:
- long tail
- NO hashtags
- comma separated
- minimum 10 tags

OUTPUT MUST FEEL LIKE PREMIUM SAAS STRATEGIST.

Return JSON:

{
"title":"",
"description":"",
"tags":"",
"dominationScore":"",
"strategyInsights":"",
"seoAdvantage":"",
"competitorInsights":"",
"titleFormula":""
}

`

    // FIRST GENERATION
    let data = await generateListing(basePrompt)

    // 🔥 SELF IMPROVEMENT LOOP
    const evaluationPrompt = `

Evaluate brutally.

If weak SEO or too short → rewrite stronger.

LISTING:
${JSON.stringify(data,null,2)}

Return improved version using SAME JSON format.

`

    const improved = await generateListing(evaluationPrompt)

    if(improved.title){
      data = improved
    }

    // 🔥 SAFETY DEFAULTS (prevents frontend breaking)
    data.title ??= ""
    data.description ??= ""
    data.tags ??= ""
    data.dominationScore ??= ""
    data.strategyInsights ??= ""
    data.seoAdvantage ??= ""
    data.competitorInsights ??= ""
    data.titleFormula ??= ""

    // 🔥 TAG ENFORCER (etsy rules)
    let tags = data.tags
      .split(",")
      .map((t:string)=>t.trim().replace("#",""))
      .filter(Boolean)

    tags = tags.slice(0,13)

    data.tags = tags.join(", ")

    // send market insights to frontend
    data.marketInsights = market

    return Response.json(data)

  }catch(error){

    console.log("Generate API error:", error)

    return Response.json({
      title:"",
      description:"",
      tags:"",
      dominationScore:"",
      strategyInsights:"",
      seoAdvantage:"",
      competitorInsights:"",
      titleFormula:"",
      marketInsights:{}
    })

  }

}