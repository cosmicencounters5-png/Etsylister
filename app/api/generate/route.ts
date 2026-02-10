import OpenAI from "openai"
import { scanEtsy } from "../../../lib/etsyScanner"
import { analyzeSEO } from "../../../lib/seoAnalyzer"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// 🔥 ULTRA SAFE GENERATOR (removes non-JSON text like "seo page created")
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

  let text = completion.choices?.[0]?.message?.content || ""

  // remove markdown codeblocks
  text = text
    .replace(/```json/g,"")
    .replace(/```/g,"")
    .trim()

  // 🔥 extract ONLY JSON object (prevents UI break + hides AI messages)
  const jsonMatch = text.match(/\{[\s\S]*\}/)

  if(!jsonMatch) return {}

  try{
    return JSON.parse(jsonMatch[0])
  }catch{
    return {}
  }
}

export async function POST(req: Request){

  try{

    const body = await req.json()
    const keyword = body.product || "product"

    // 🔥 LIVE SCAN
    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")
    const seo = analyzeSEO(titles)

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

Create listing that outranks competitors.

PRODUCT:
${keyword}

TOP COMPETITORS:
${JSON.stringify(topCompetitors,null,2)}

SEO DATA:
${JSON.stringify(seo,null,2)}

RULES:

TITLE:
- keyword stacking
- long tail heavy
- use "|"

TAGS:
- EXACTLY 13 tags
- each tag UNDER 20 characters
- NO hashtags
- comma separated
- Etsy optimized keywords
- NEVER exceed 20 characters

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

    let data = await generateListing(basePrompt)

    // 🔥 SELF IMPROVE PASS
    const improved = await generateListing(`
Improve brutally if weak:

${JSON.stringify(data,null,2)}

Return SAME JSON format.
`)

    if(improved.title){
      data = improved
    }

    // SAFE DEFAULTS
    data.title ??= ""
    data.description ??= ""
    data.tags ??= ""
    data.dominationScore ??= ""
    data.strategyInsights ??= ""
    data.seoAdvantage ??= ""
    data.competitorInsights ??= ""
    data.titleFormula ??= ""

    // 🔥 REAL ETSY TAG ENFORCER (no half cuts)
    let tags = (data.tags || "")
      .split(",")
      .map((t:string)=>t.trim().replace("#",""))
      .filter((t:string)=> t.length > 0 && t.length <= 20)

    // ensure max 13
    tags = tags.slice(0,13)

    data.tags = tags.join(", ")

    // send market data to UI
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