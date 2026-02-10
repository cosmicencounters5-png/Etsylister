import { Metadata } from "next"
import Link from "next/link"
import { baseKeywords, seoTemplates } from "@/lib/seoKeywords"

type Props = {
  params:{
    slug:string
  }
}

function decodeSlug(slug:string){
  return slug.replaceAll("-"," ")
}

// 🔥 RELATED ARTICLES ENGINE (SEO internal linking boost)
function getRelated(slug:string){

  const baseUrl="/seo"

  return baseKeywords
    .slice(0,8)
    .map(keyword=>{

      const template =
        seoTemplates[Math.floor(Math.random()*seoTemplates.length)]

      const newSlug=`${template}-${keyword}`
        .replaceAll(" ","-")

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

    title:`${keyword} | Etsy SEO Guide (AI Strategy + Keywords)`,

    description:
      `Learn how to rank on Etsy for ${keyword}. AI-driven Etsy SEO strategies, keyword research, listing optimization and ranking tactics.`,

    keywords:[
      keyword,
      "etsy seo",
      "etsy ranking",
      "etsy keywords",
      "etsy listing optimization",
      "etsy ai tools"
    ],

    openGraph:{
      title:`${keyword} | EtsyLister SEO Guide`,
      description:`Advanced Etsy SEO strategies for ${keyword}.`,
      type:"article"
    },

    robots:{
      index:true,
      follow:true
    }

  }

}

async function generateContent(keyword:string){

  // 🔥 LONGER CONTENT = topical authority
  return `
${keyword} represents a strong opportunity for Etsy sellers who want to rank higher and increase visibility.

Modern Etsy SEO focuses on understanding buyer intent, identifying profitable keyword patterns, and structuring listings for conversion.

AI tools like EtsyLister analyze marketplace signals including:

• competitor titles and keyword density  
• long-tail ranking opportunities  
• demand vs competition balance  
• conversion psychology signals  

By combining automation with strategy, sellers can generate listings that are optimized for Etsy search visibility while maintaining strong conversion performance.

Key optimization strategies include:

• long-tail keyword stacking  
• semantic keyword variation  
• high-intent buyer targeting  
• clear title structure and hierarchy  
• optimized tag strategy aligned with Etsy algorithm behavior
`
}

export default async function Page({ params }:Props){

  const keyword = decodeSlug(params.slug)

  const content = await generateContent(keyword)

  const related = getRelated(params.slug)

  return(

    <main style={{
      maxWidth:1000,
      margin:"0 auto",
      padding:"80px 20px",
      display:"grid",
      gridTemplateColumns:"2fr 1fr",
      gap:50
    }}>

      {/* MAIN ARTICLE */}

      <article>

        <h1 style={{
          fontSize:44,
          fontWeight:700,
          lineHeight:1.1
        }}>
          {keyword}
        </h1>

        <p style={{
          marginTop:20,
          fontSize:18,
          lineHeight:1.7,
          opacity:0.9
        }}>
          {content}
        </p>

        <h2 style={{marginTop:40}}>
          Why AI improves Etsy rankings
        </h2>

        <p>
          AI analyzes thousands of listing patterns instantly, helping sellers
          discover profitable niches and optimize listings faster than manual research.
        </p>

        <h2 style={{marginTop:30}}>
          Generate optimized Etsy listings instantly
        </h2>

        <p>
          Instead of guessing keywords, AI-based tools analyze real competitor data
          and ranking signals to create optimized titles, descriptions, and tags.
        </p>

        <Link href="/login">

          <button style={{
            marginTop:40,
            padding:"18px 26px",
            background:"white",
            color:"black",
            borderRadius:12,
            fontWeight:700,
            border:"none",
            cursor:"pointer"
          }}>
            Generate Your Listing Free →
          </button>

        </Link>

      </article>

      {/* 🔥 RELATED ARTICLES SIDEBAR */}

      <aside>

        <h3>Related Etsy SEO Guides</h3>

        <div style={{
          marginTop:20,
          display:"grid",
          gap:14
        }}>

          {related.map((r,i)=>(

            <Link key={i} href={r.url} style={{
              background:"#0f0f0f",
              padding:16,
              borderRadius:12,
              display:"block",
              textDecoration:"none"
            }}>
              {r.title}
            </Link>

          ))}

        </div>

      </aside>

    </main>

  )

}