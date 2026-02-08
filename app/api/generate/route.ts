import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";
import { analyzeSEO } from "../../../lib/seoAnalyzer";

const openai=new OpenAI({
  apiKey:process.env.OPENAI_API_KEY
})

export async function POST(req:Request){

  const body=await req.json()

  const product=body.product

  const keyword=product || "product"

  const competitors=await scanEtsy(keyword)

  const titles=competitors.map(c=>c.title)

  const seo=analyzeSEO(titles)

  const stream=await openai.chat.completions.create({

    model:"gpt-4o-mini",
    stream:true,

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

TASK:

1) Generate optimized listing
2) Calculate domination metrics
3) Reverse-engine WHY competitors rank higher

Return ONLY JSON:

{
"title":"",
"description":"",
"tags":"",
"strategyInsights":"",
"dominationScore":"",
"seoAdvantage":"",
"keywordCoverage":"",
"competitorInsights":""
}
`
      }
    ]
  })

  const encoder=new TextEncoder()

  const readable=new ReadableStream({

    async start(controller){

      for await(const chunk of stream){

        const content=chunk.choices[0]?.delta?.content

        if(content){
          controller.enqueue(encoder.encode(content))
        }

      }

      controller.close()
    }

  })

  return new Response(readable,{
    headers:{ "Content-Type":"text/plain"}
  })

}