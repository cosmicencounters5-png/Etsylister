import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function POST(req:Request){

  const body = await req.json()

  const { message, context } = body

  const completion = await openai.chat.completions.create({

    model:"gpt-4o-mini",

    messages:[
      {
        role:"system",
        content:`
You are an elite Etsy AI strategist.

You help improve listings using:

- listing scores
- competitor insights
- SEO signals
- trend data

Always give actionable improvements.
`
      },
      {
        role:"user",
        content:`
CONTEXT:
${JSON.stringify(context,null,2)}

USER MESSAGE:
${message}
`
      }
    ]
  })

  return Response.json({
    reply: completion.choices[0].message.content
  })
}