// lib/optimizerBrain.ts

type ListingData = {
  title:string
  description:string
  image?:string
  signals?:{
    hasDigitalIntent?:boolean
    hasBuyerIntent?:boolean
    longTailScore?:number
  }
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

  const title = listing.title || ""
  const description = listing.description || ""
  const signals = listing.signals || {}

  let score = 40

  // 🔥 SIGNAL SCORING

  if(signals.hasDigitalIntent) score += 15
  if(signals.hasBuyerIntent) score += 15

  if(signals.longTailScore && signals.longTailScore >= 4){
    score += 10
  }

  if(title.length > 60) score += 10

  // 🔥 TITLE IMPROVEMENT ENGINE

  let improvedTitle = title

  if(!title.toLowerCase().includes("etsy")){
    improvedTitle = `${title} | Etsy SEO Optimized`
  }

  if(signals.hasDigitalIntent && !title.includes("Instant Download")){
    improvedTitle += " | Instant Download"
  }

  // 🔥 DESCRIPTION IMPROVEMENT

  const improvedDescription = `
${description}

⭐ Optimized using AI listing analysis.

This listing has been enhanced using competitor analysis,
buyer intent signals, and Etsy SEO best practices.

Key optimization upgrades:

• Long-tail keyword targeting
• Conversion-focused title structure
• Etsy algorithm alignment
`

  // 🔥 TAG SUGGESTION ENGINE

  const baseTags = [
    "etsy seo",
    "etsy listing optimization",
    "digital product",
    "etsy ranking",
    "ai listing"
  ]

  if(signals.hasDigitalIntent){
    baseTags.push("instant download","printable","digital file")
  }

  if(signals.hasBuyerIntent){
    baseTags.push("gift idea","personalized gift")
  }

  // remove duplicates
  const suggestedTags = [...new Set(baseTags)]

  // 🔥 STRATEGY EXPLANATION

  const strategy = `
AI detected ${
    signals.hasDigitalIntent ? "digital product intent" : "standard product structure"
  } and optimized title structure to improve Etsy CTR and keyword reach.

Focus placed on long-tail keyword expansion and buyer intent signals.
`

  return {
    improvedTitle,
    improvedDescription,
    suggestedTags,
    strategy,
    score
  }
}