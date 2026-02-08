import OpenAI from "openai";
import { scanEtsy } from "../../../lib/etsyScanner";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product || "product";

  // REAL SCANNING
  const competitors = await scanEtsy(product);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `
You are an Etsy SEO expert.

USER PRODUCT:
${product}

REAL COMPETITOR TITLES:
${competitors.join("\n")}

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

  text = text.replace(/```json/g,"").replace(/```/g,"");

  const data = JSON.parse(text);

  return Response.json(data);
}