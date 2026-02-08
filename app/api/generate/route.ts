import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product || "product";

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
You are an Etsy SEO expert.

Create an Etsy listing for:

${product}

RULES:

- Title max 140 characters
- High converting description
- EXACTLY 13 tags
- Each tag MAX 20 characters
- Tags comma separated

Return ONLY JSON:

{
"title":"",
"description":"",
"tags":""
}
`
      }
    ]
  });

  let text = completion.choices[0].message.content || "{}";

  // Remove potential markdown formatting
  text = text.replace(/```json/g,"").replace(/```/g,"");

  const data = JSON.parse(text);

  return Response.json(data);

}