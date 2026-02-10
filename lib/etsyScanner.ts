// lib/etsyScanner.ts

const cache:any = {}

export async function scanEtsy(keyword:string){

  const key = keyword.toLowerCase()

  // CACHE (30 min)
  if(cache[key] && Date.now()-cache[key].time < 1000*60*30){
    return cache[key].data
  }

  try{

    const searchUrl =
      `https://www.etsy.com/search?q=${encodeURIComponent(keyword)}`

    const res = await fetch(searchUrl,{
      headers:{ "User-Agent":"Mozilla/5.0" },
      cache:"no-store"
    })

    const html = await res.text()

    // SAFE LINK EXTRACTION
    const linkMatches =
      html.match(/https:\\\/\\\/www\.etsy\.com\\\/listing\\\/[0-9]+/g) || []

    const links = [...new Set(
      linkMatches.map((l:any)=>l.replace(/\\\//g,"/"))
    )].slice(0,12)

    const results = await Promise.all(

      links.map(async(link)=>{

        try{

          const page = await fetch(link,{
            headers:{ "User-Agent":"Mozilla/5.0"},
            cache:"no-store"
          })

          const pageHtml = await page.text()

          const titleMatch =
            pageHtml.match(/<title>(.*?)<\/title>/i)

          const title = titleMatch ? titleMatch[1] : ""

          const cartMatch =
            pageHtml.match(/(\d+)\+?\s+people have this in their cart/i)

          const inCart = cartMatch ? parseInt(cartMatch[1]) : 0

          const reviewMatch =
            pageHtml.match(/"reviewCount":(\d+)/)

          const reviews = reviewMatch ? parseInt(reviewMatch[1]) : 0

          const imageMatch =
            pageHtml.match(/"image":"(https:[^"]+)"/)

          const image = imageMatch ? imageMatch[1] : ""

          // FILTER weak listings
          if(inCart < 20) return null

          const profitability =
            (inCart*3)+Math.log(reviews+1)

          const trendScore =
            (inCart*2)+profitability-Math.log(reviews+1)

          const dominationScore =
            (inCart*2) +
            Math.log(reviews+1) +
            (trendScore*0.5)

          const opportunityScore =
            (inCart*4) - Math.log(reviews+1)*10

          return{
            title,
            inCart,
            reviews,
            profitability,
            trendScore,
            dominationScore,
            opportunityScore,
            image
          }

        }catch{
          return null
        }

      })

    )

    const competitors = results.filter(Boolean)

    // SORT
    const sorted =
      [...competitors]
        .sort((a:any,b:any)=>b.dominationScore-a.dominationScore)

    const leaders = sorted.slice(0,3)

    const risingOpportunities =
      [...competitors]
        .sort((a:any,b:any)=>b.opportunityScore-a.opportunityScore)
        .slice(0,3)

    // MARKET METRICS

    let avgInCart=0
    let avgReviews=0
    let avgProfit=0

    competitors.forEach((c:any)=>{
      avgInCart+=c.inCart
      avgReviews+=c.reviews
      avgProfit+=c.profitability
    })

    avgInCart=Math.round(avgInCart/(competitors.length||1))
    avgReviews=Math.round(avgReviews/(competitors.length||1))
    avgProfit=Math.round(avgProfit/(competitors.length||1))

    const demand =
      avgInCart>=60 ? "HIGH" :
      avgInCart>=30 ? "MEDIUM" : "LOW"

    const competition =
      avgReviews>=2000 ? "HIGH" :
      avgReviews>=500 ? "MEDIUM" : "LOW"

    const trend =
      avgProfit>100 ? "RISING" : "STABLE"

    const opportunity =
      demand==="HIGH" && competition==="LOW" ? "GOLDMINE" :
      demand==="HIGH" && competition==="MEDIUM" ? "STRONG" :
      "NORMAL"

    const data = {

      competitors,

      marketInsights:{
        avgInCart,
        avgReviews,
        avgProfit,
        demand,
        competition,
        trend,
        opportunity,
        leaders,
        risingOpportunities
      }

    }

    cache[key]={ time:Date.now(), data }

    return data

  }catch{

    // TOTAL FAILSAFE (never break frontend)

    return {
      competitors:[],
      marketInsights:{
        avgInCart:0,
        avgReviews:0,
        avgProfit:0,
        demand:"LOW",
        competition:"LOW",
        trend:"STABLE",
        opportunity:"NORMAL",
        leaders:[],
        risingOpportunities:[]
      }
    }

  }

}