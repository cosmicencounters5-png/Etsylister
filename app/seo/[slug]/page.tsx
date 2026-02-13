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

function detectHub(keyword:string){

  const k = keyword.toLowerCase()

  if(k.includes("tag")) return "etsy-tags"
  if(k.includes("title")) return "etsy-titles"
  if(k.includes("keyword")) return "etsy-keywords"
  if(k.includes("printable")) return "etsy-printables"

  return "etsy-seo"
}

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

      {/* 🔥 AUTHORITY BLOCK (SEO BOOST) */}

      <div style={{
        marginTop:40,
        padding:18,
        background:"#0f0f0f",
        borderRadius:12
      }}>
        <strong>AI Etsy SEO Strategy Engine</strong>

        <p style={{marginTop:10,opacity:.8}}>
          EtsyLister AI combines keyword research, competitor analysis,
          and AI ranking signals to build listings designed for visibility
          and conversion.
        </p>
      </div>

      {/* HUB AUTHORITY */}

      <div style={{
        marginTop:30,
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

      {/* RELATED LINKS */}

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

      {/* 🔥 INTERNAL TOOL MATRIX (TRAFFIC FLYWHEEL) */}

      <div style={{
        marginTop:50,
        display:"flex",
        flexWrap:"wrap",
        gap:14
      }}>

        {/* LOGIN / GENERATOR */}

        <a href="/login">

          <button style={{
            padding:"18px 26px",
            borderRadius:12,
            background:"black",
            color:"white",
            fontWeight:600
          }}>
            Generate Listing →
          </button>

        </a>

        {/* OPTIMIZE TOOL */}

        <a href="/optimize">

          <button style={{
            padding:"18px 26px",
            borderRadius:12,
            background:"#111",
            border:"1px solid #222",
            color:"white",
            fontWeight:600
          }}>
            Optimize Existing Listing ⚡
          </button>

        </a>

        {/* IDEA SCANNER */}

        <a href="/idea">

          <button style={{
            padding:"18px 26px",
            borderRadius:12,
            background:"#00ffae",
            color:"black",
            fontWeight:700
          }}>
            Scan Market Opportunity 🔥
          </button>

        </a>

      </div>

    </main>

  )

}