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

    const scan = await scanEtsy(keyword)

    const competitors = scan?.competitors || []
    const market = scan?.marketInsights || {}

    const titles = competitors.map((c:any)=>c.title || "")

    const seo = analyzeSEO(titles)

    const basePrompt = `

You are an EXTREME Etsy SEO domination AI.

You are NOT allowed to produce generic marketing copy.

OBJECTIVE:
Create listing that outranks competitors.

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
- use "|" separator

TAGS:
- long tail
- NO hashtags
- comma separated

Return JSON:

{
"title":"",
"description":"",
"tags":"",
"dominationScore":""
}

`

    // FIRST GENERATION
    let data = await generateListing(basePrompt)

    // 🔥 SELF EVALUATION LOOP
    const evaluationPrompt = `

Evaluate this listing brutally.

If weak SEO → rewrite aggressively.

LISTING:
${JSON.stringify(data,null,2)}

Return improved version using same JSON format.

`

    const improved = await generateListing(evaluationPrompt)

    if(improved.title){
      data = improved
    }

    // TAG FIX
    let tags = (data.tags || "")
      .split(",")
      .map((t:string)=>t.trim().replace("#",""))
      .filter(Boolean)

    tags = tags.slice(0,13)

    data.tags = tags.join(", ")

    data.marketInsights = market

    return Response.json(data)

  }catch(error){

    console.log(error)

    return Response.json({
      title:"",
      description:"",
      tags:"",
      dominationScore:"",
      marketInsights:{}
    })

  }
}