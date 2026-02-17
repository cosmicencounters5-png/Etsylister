export function buildShareText(type:string,data:any){

  if(type==="idea"){

    return `🔥 I tested my Etsy idea using EtsyLister AI.

Opportunity score: ${data.score}/100

Competition: ${data.competition}
Demand: ${data.demand}

This might actually sell.

https://etsylister.com`
  }

  if(type==="listing"){

    return `🔥 Generated an Etsy listing using AI.

Profitability score: ${data.dominationScore}

Honestly surprised by the strategy insights.

https://etsylister.com`
  }

  if(type==="optimize"){

    return `🔥 Upgraded my Etsy listing with AI.

SEO score improved:
${data.beforeScore} → ${data.afterScore}

https://etsylister.com`
  }

  return "https://etsylister.com"
}