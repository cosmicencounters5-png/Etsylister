// lib/optimizerBrain.ts

type ListingData = {
  title:string
  description:string
}

type OptimizerResult = {
  improvedTitle:string
  improvedDescription:string
  suggestedTags:string[]
  strategy:string
  score:number
}

export async function runOptimizerBrain(
  listing:ListingData
):Promise<OptimizerResult>{

  const res = await fetch("https://api.openai.com/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${process.env.OPENAI_API_KEY}`
    },
    body:JSON.stringify({
      model:"gpt-4o-mini",
      temperature:0.3,
      messages:[
        {
          role:"system",
          content:`
You are an elite Etsy SEO expert.

Rules:

Generate HIGH converting Etsy optimization.

Tags must:

- be real Etsy buyer search phrases
- max 20 characters each
- minimum 13 tags
- comma separated
- NO generic words like "seo" or "ai tool"

Return ONLY JSON:

{
 improvedTitle:"",
 improvedDescription:"",
 tags:["","",""],
 strategy:"",
 score: number
}
`
        },
        {
          role:"user",
          content:`
Title:
${listing.title}

Description:
${listing.description}
`
        }
      ]
    })
  })

  const data = await res.json()

  let text =
    data?.choices?.[0]?.message?.content || ""

  text = text.replace(/```json/g,"").replace(/```/g,"").trim()

  const parsed = JSON.parse(text)

  return {
    improvedTitle: parsed.improvedTitle,
    improvedDescription: parsed.improvedDescription,
    suggestedTags: parsed.tags,
    strategy: parsed.strategy,
    score: parsed.score
  }
}