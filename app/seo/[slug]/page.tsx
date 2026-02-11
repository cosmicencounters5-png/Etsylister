import { Metadata } from "next"
import { baseKeywords } from "@/lib/seoKeywords"

type Props = {
  params:{
    slug:string
  }
}

function decodeSlug(slug:string){
  return slug.replaceAll("-"," ")
}

// 🔥 detect hub automatically
function detectHub(keyword:string){

  const k = keyword.toLowerCase()

  if(k.includes("tag")) return "etsy-tags"
  if(k.includes("title")) return "etsy-titles"
  if(k.includes("keyword")) return "etsy-keywords"
  if(k.includes("printable")) return "etsy-printables"

  return "etsy-seo"
}

// 🔥 related cluster pages (internal linking loop)
function getRelated(keyword:string){

  return baseKeywords
    .filter(k => k !== keyword)
    .slice(0,6)
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const keyword = decodeSlug(params.slug)

  return{

    title:`${keyword} | Etsy Listing Strategy (AI Generated)`,

    description:
      `AI-generated Etsy listing strategy for ${keyword}. SEO titles, tags and optimization insights.`,

    robots:{
      index:true,
      follow:true
    }

  }

}

export default async function Page({params}:Props){

  const keyword = decodeSlug(params.slug)
  const hub = detectHub(keyword)
  const related = getRelated(keyword)

  return(

    <main style={{
      maxWidth:900,
      margin:"0 auto",
      padding:"80px 20px"
    }}>

      {/* MAIN ARTICLE */}

      <h1 style={{fontSize:42,fontWeight:700}}>
        {keyword}
      </h1>

      <p style={{marginTop:20,fontSize:18,lineHeight:1.6}}>

        This Etsy listing strategy was generated using AI market analysis.

        EtsyLister scans competitors, identifies profitable keywords,
        and builds optimized listing structures designed to rank.

      </p>

      <h2 style={{marginTop:30}}>
        Why AI listing optimization works
      </h2>

      <p>
        AI analyzes thousands of ranking patterns faster than manual research,
        helping sellers discover profitable niches instantly.
      </p>

      {/* 🔥 HUB AUTHORITY LINK (VERY IMPORTANT) */}

      <div style={{
        marginTop:40,
        padding:16,
        background:"#0f0f0f",
        borderRadius:12
      }}>
        Related Hub:
        <a
          href={`/seo/${hub}`}
          style={{marginLeft:10,color:"white"}}
        >
          View {hub.replaceAll("-"," ")} hub →
        </a>
      </div>

      {/* 🔥 RELATED INTERNAL LINKS */}

      <div style={{marginTop:40}}>

        <h3>Related Etsy SEO Guides</h3>

        <div style={{
          display:"grid",
          gap:12,
          marginTop:14
        }}>

          {related.map((r,i)=>(

            <a
              key={i}
              href={`/seo/${r.replaceAll(" ","-")}`}
              style={{
                background:"#0f0f0f",
                padding:14,
                borderRadius:12,
                display:"block",
                color:"white",
                textDecoration:"none"
              }}
            >
              {r}
            </a>

          ))}

        </div>

      </div>

      {/* CTA */}

      <a href="/login">

        <button style={{
          marginTop:40,
          padding:"18px 26px",
          borderRadius:12,
          background:"black",
          color:"white"
        }}>
          Generate Your Own Listing →
        </button>

      </a>

    </main>

  )

}