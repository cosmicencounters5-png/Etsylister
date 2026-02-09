import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";
import { analyzeSEO } from "../../../lib/seoAnalyzer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req:Request){

  const body = await req.json()

  const product = body.product

  const keyword = product || "product"

  const competitors = await scanEtsy(keyword)

  const titles = competitors.map(c=>c.title)

  const seo = analyzeSEO(titles)

  const completion = await openai.chat.completions.create({

    model:"gpt-4o-mini",

    messages:[
      {
        role:"user",
        content:`

You are an elite Etsy reverse-engine strategist.

USER PRODUCT:
${keyword}

TOP COMPETITOR TITLES:
${titles.join("\n")}

SEO SIGNALS:
${JSON.stringify(seo,null,2)}

RULES:

- Title max 140 characters
- EXACTLY 13 tags
- EACH tag MAX 20 characters
- Tags comma separated

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

  let text = completion.choices[0].message.content || "{}"

  // remove markdown if AI adds it
  text = text.replace(/```json/g,"").replace(/```/g,"")

  let data:any = {}

  try{
    data = JSON.parse(text)
  }catch(e){
    return Response.json({ error:"Invalid AI response"})
  }

  // 🔥 ETSY TAG ENFORCER

  let tags = (data.tags || "")
    .split(",")
    .map((t:string)=>t.trim())
    .filter(Boolean)

  // max 20 chars
  tags = tags.map((t:string)=> t.slice(0,20))

  // max 13 tags
  tags = tags.slice(0,13)

  data.tags = tags.join(", ")

  return Response.json(data)

}