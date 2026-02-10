import { Metadata } from "next"

type Props = {
  params:{
    slug:string
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
      `${keyword}. Learn Etsy SEO strategy, keyword optimization and AI listing domination techniques.`,

    openGraph:{
      title:`${keyword} | EtsyLister`,
      description:`AI-powered Etsy SEO strategy for ${keyword}.`,
      type:"article"
    }

  }

}

async function generateContent(keyword:string){

  // 🔥 AUTO CONTENT ENGINE (safe fallback)

  return `
${keyword} is one of the most powerful opportunities for Etsy sellers
who want to rank higher and increase visibility.

Successful Etsy SEO requires understanding buyer intent,
long-tail keywords, and competitive positioning.

Using AI tools like EtsyLister allows sellers to analyze
competitor listings, identify profitable niches, and generate
optimized titles, tags, and descriptions designed to rank.

Key strategies include:

- Keyword stacking for visibility
- Long-tail targeting for conversion
- Data-driven listing optimization
- Continuous testing and iteration

`
}

export default async function Page({ params }:Props){

  const keyword = decodeSlug(params.slug)

  const content = await generateContent(keyword)

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
        {content}
      </p>

      <h2 style={{marginTop:40}}>
        Why AI improves Etsy rankings
      </h2>

      <p>
        AI tools analyze patterns across top performing listings,
        allowing sellers to identify ranking signals faster than manual research.
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