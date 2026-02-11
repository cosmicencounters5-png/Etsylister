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

// 🔥 SILO ENGINE
function getSilo(keyword:string){

  if(keyword.includes("tag")) return "tags"
  if(keyword.includes("title")) return "titles"
  if(keyword.includes("keyword")) return "keywords"
  if(keyword.includes("printable")) return "printables"
  if(keyword.includes("digital")) return "digital-products"

  return "etsy-seo"
}

// 🔥 INTERNAL LINK ENGINE (stable + silo-aware)
function getRelated(slug:string){

  const baseUrl="/seo"
  const keyword = decodeSlug(slug)
  const silo = getSilo(keyword)

  return baseKeywords
    .filter(k => getSilo(k) === silo && k !== keyword)
    .slice(0,8)
    .map(k=>({

      title:k,
      url:`${baseUrl}/${k.replaceAll(" ","-")}`

    }))
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

      </div>

      {/* 🔥 ULTRA SILO RELATED LINKS */}

      <aside>

        <h3>Related Etsy SEO Guides</h3>

        <div style={{marginTop:20,display:"grid",gap:12}}>

          {related.map((r,i)=>(
            <a key={i} href={r.url} style={{
              background:"#0f0f0f",
              padding:14,
              borderRadius:12,
              display:"block",
              textDecoration:"none",
              color:"white"
            }}>
              {r.title}
            </a>
          ))}

        </div>

      </aside>

    </main>

  )

}