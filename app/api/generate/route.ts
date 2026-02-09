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

  // 🔥 LIVE MARKET SCAN
  const scan = await scanEtsy(keyword)

  const competitors = scan.competitors || []
  const market = scan.marketInsights || {}

  const titles = competitors.map((c:any)=>c.title)

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

You are an ELITE Etsy domination strategist using REAL live market intelligence.

IMPORTANT:

- HIGH inCart = strong demand signal
- LOW reviews + HIGH inCart = growth opportunity
- HIGH dominationScore = market leader pattern

USER PRODUCT:
${keyword}

REAL COMPETITOR DATA:
${JSON.stringify(competitorData,null,2)}

LIVE MARKET SUMMARY:
${JSON.stringify(market,null,2)}

SEO SIGNALS:
${JSON.stringify(seo,null,2)}

TASK:

1) Reverse engineer WHY top listings rank
2) Detect hidden opportunity gaps
3) Prioritize rising opportunities over saturated leaders
4) Create HIGH-CONVERSION listing designed to OUTRANK competitors.

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

  tags = tags.map((t:string)=> t.slice(0,20))
  tags = tags.slice(0,13)

  data.tags = tags.join(", ")

  // 🔥 VERY IMPORTANT: send market data to frontend
  data.marketInsights = market

  return Response.json(data)
}