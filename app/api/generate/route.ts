export async function POST(req: Request) {

  const body = await req.json();
  const product = body.product || "product";

  // Etsy rules:
  // - EXACTLY 13 tags
  // - max 20 characters per tag
  // - comma separated output

  function generateTags(base: string) {

    const rawTags = [
      base,
      `handmade ${base}`,
      `gift ${base}`,
      "etsy bestseller",
      "trending item",
      "unique gift",
      "gift idea",
      "handmade shop",
      "popular now",
      "shop small",
      "etsy trending",
      "perfect gift",
      "must have"
    ];

    // enforce max 20 chars
    const cleaned = rawTags.map(tag => tag.slice(0,20));

    // join with commas for copy-paste
    return cleaned.join(", ");
  }

  const result = {
    title: `Premium ${product} | Handmade Gift Idea | Bestseller Style`,
    description: `This is a high-converting Etsy listing for ${product}. Generated using AI competitor analysis.`,
    tags: generateTags(product)
  };

  return Response.json(result);
}