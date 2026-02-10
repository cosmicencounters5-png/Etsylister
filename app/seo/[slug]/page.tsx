import { Metadata } from "next"

type Props = {
  params: {
    slug: string
  }
}

function decodeSlug(slug:string){

  return slug
    .replaceAll("-"," ")
    .replace("how to rank for","How to rank for")
    .replace("best strategy for","Best strategy for")
    .replace("complete guide to","Complete guide to")
    .replace("advanced optimization for","Advanced optimization for")
    .replace("ultimate seo guide","Ultimate SEO guide")

}

export async function generateMetadata(
  { params }:Props
):Promise<Metadata>{

  const keyword = decodeSlug(params.slug)

  return{

    title:`${keyword} | EtsyLister AI SEO Guide`,

    description:
      `${keyword}. Learn how Etsy SEO works, discover ranking strategies, keyword optimization tactics and AI-driven listing domination.`,

    openGraph:{
      title:`${keyword} | EtsyLister`,
      description:`AI-powered Etsy SEO strategy for ${keyword}.`,
      type:"article"
    }

  }

}

export default function Page({ params }:Props){

  const keyword = decodeSlug(params.slug)

  return(

    <main style={{
      maxWidth:760,
      margin:"0 auto",
      padding:"80px 20px",
      lineHeight:1.6
    }}>

      <h1 style={{fontSize:42,fontWeight:700}}>
        {keyword}
      </h1>

      <p style={{marginTop:20,fontSize:18}}>
        Etsy SEO is driven by buyer intent, keyword relevance, and listing optimization.
        This guide explains how to dominate Etsy search results using AI-driven analysis,
        long-tail keyword targeting, and real competitor data.
      </p>

      <h2 style={{marginTop:40}}>
        Why Etsy SEO matters
      </h2>

      <p>
        Etsy listings rank based on engagement signals, keyword placement,
        listing quality score, and market demand. Understanding these factors
        allows sellers to outperform competitors even in saturated niches.
      </p>

      <h2 style={{marginTop:40}}>
        AI-powered listing optimization
      </h2>

      <p>
        EtsyLister analyzes competitors, profitability signals, and search intent
        to generate listings designed for visibility and conversion.
      </p>

      <a href="/login">
        <button style={{
          marginTop:40,
          padding:"18px 24px",
          background:"black",
          color:"white",
          borderRadius:12
        }}>
          Generate Your Listing Free →
        </button>
      </a>

    </main>

  )

}