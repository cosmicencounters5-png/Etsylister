import { Metadata } from "next"
import { baseKeywords, seoTemplates } from "@/lib/seoKeywords"

type Props = {
  params:{
    slug:string
  }
}

function decodeSlug(slug:string){

  return slug.replaceAll("-"," ")

}

// 🔥 AUTO RELATED ARTICLES ENGINE
function getRelated(slug:string){

  const baseUrl="/seo"

  return baseKeywords
    .slice(0,6)
    .map(keyword=>{

      const template = seoTemplates[Math.floor(Math.random()*seoTemplates.length)]

      const newSlug=`${template}-${keyword}`.replaceAll(" ","-")

      return{
        title:`${template.replaceAll("-"," ")} ${keyword}`,
        url:`${baseUrl}/${newSlug}`
      }

    })

}

export async function generateMetadata(
  { params }:Props
):Promise<Metadata>{

  const keyword = decodeSlug(params.slug)

  return{

    title:`${keyword} | EtsyLister AI SEO Guide`,

    description:
      `Complete guide for ${keyword}. AI-powered Etsy SEO strategies, keyword research and listing domination.`,

    openGraph:{
      title:`${keyword} | EtsyLister`,
      description:`AI Etsy SEO strategy for ${keyword}.`,
      type:"article"
    }

  }

}

async function generateContent(keyword:string){

  // 🔥 SAFE AUTO CONTENT
  return `
${keyword} is a powerful ranking opportunity for Etsy sellers.

Using AI tools like EtsyLister helps identify profitable niches,
analyze competitors, and generate optimized titles and tags.

Top ranking strategies include:

- Long-tail keyword optimization
- Buyer intent targeting
- Competitive analysis
- Conversion-focused listing design

`
}

export default async function Page({ params }:Props){

  const keyword = decodeSlug(params.slug)

  const content = await generateContent(keyword)

  const related = getRelated(params.slug)

  return(

    <main style={{
      maxWidth:900,
      margin:"0 auto",
      padding:"80px 20px",
      display:"grid",
      gridTemplateColumns:"2fr 1fr",
      gap:40
    }}>

      {/* MAIN ARTICLE */}

      <div>

        <h1 style={{fontSize:42,fontWeight:700}}>
          {keyword}
        </h1>

        <p style={{marginTop:20,fontSize:18,lineHeight:1.6}}>
          {content}
        </p>

        <h2 style={{marginTop:40}}>
          Why AI improves Etsy rankings
        </h2>

        <p>
          AI analyzes thousands of listing patterns instantly,
          allowing sellers to optimize faster than manual research.
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

      </div>

      {/* 🔥 RELATED ARTICLES SIDEBAR */}

      <aside>

        <h3>Related Etsy SEO Guides</h3>

        <div style={{marginTop:20,display:"grid",gap:12}}>

          {related.map((r,i)=>(
            <a key={i} href={r.url} style={{
              background:"#0f0f0f",
              padding:14,
              borderRadius:12,
              display:"block"
            }}>
              {r.title}
            </a>
          ))}

        </div>

      </aside>

    </main>

  )

}