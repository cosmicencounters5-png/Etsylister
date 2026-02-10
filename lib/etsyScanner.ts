import OpenAI from "openai"
import { scanEtsy } from "@/seoAnalyzer/etsyScanner"
import { analyzeSEO } from "@/seoAnalyzer/seoAnalyzer"

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
- long tail
- comma separated
- NO hashtags
- minimum 10 tags

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

    const evaluationPrompt = `

Improve aggressively if weak:

${JSON.stringify(data,null,2)}

Return SAME JSON format.

`

    const improved = await generateListing(evaluationPrompt)

    if(improved.title){
      data = improved
    }

    // SAFETY DEFAULTS
    data.title ??= ""
    data.description ??= ""
    data.tags ??= ""
    data.dominationScore ??= ""
    data.strategyInsights ??= ""
    data.seoAdvantage ??= ""
    data.competitorInsights ??= ""
    data.titleFormula ??= ""

    // ETSY TAG ENFORCER
    let tags = data.tags
      .split(",")
      .map((t:string)=>t.trim().replace("#",""))
      .filter(Boolean)

    tags = tags.slice(0,13)

    data.tags = tags.join(", ")

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