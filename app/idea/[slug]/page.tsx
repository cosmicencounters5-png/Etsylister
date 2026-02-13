import { Metadata } from "next"

type Props = {
  params:{
    slug:string
  }
}

function decode(slug:string){
  return slug.replaceAll("-"," ")
}

// 🔥 related keyword generator
function relatedIdeas(keyword:string){

  const base = keyword.toLowerCase()

  return [
    `${base} template`,
    `${base} printable`,
    `${base} digital product`,
    `${base} niche ideas`,
    `${base} seo strategy`,
    `${base} keywords`
  ]
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const keyword = decode(params.slug)

  return{
    title:`${keyword} Etsy Market Analysis (AI Scanner)`,
    description:`AI analyzed Etsy market opportunity for ${keyword}. Demand signals, competition insights and listing strategy.`,
    robots:{
      index:true,
      follow:true
    }
  }
}

export default function Page({params}:Props){

  const keyword = decode(params.slug)
  const related = relatedIdeas(keyword)

  return(

    <main style={{
      maxWidth:900,
      margin:"0 auto",
      padding:"80px 20px"
    }}>

      <h1 style={{fontSize:42,fontWeight:700}}>
        Etsy Market Opportunity: {keyword}
      </h1>

      <p style={{marginTop:20,fontSize:18}}>
        AI scanned Etsy competitors and demand patterns to evaluate
        this niche opportunity.
      </p>

      {/* DEMAND */}

      <h2 style={{marginTop:40}}>Market Demand</h2>

      <p>
        Long-tail keyword positioning increases ranking probability.
        Niches combining digital intent and buyer psychology perform best.
      </p>

      {/* COMPETITION */}

      <h2 style={{marginTop:30}}>Competition Analysis</h2>

      <p>
        Medium competition detected. Opportunity exists through
        optimized title structure and keyword clustering.
      </p>

      {/* 🔥 INTERNAL SEO HUB */}

      <div style={{
        marginTop:40,
        background:"#0f0f0f",
        padding:20,
        borderRadius:12
      }}>

        <strong>Related SEO Guides</strong>

        <div style={{marginTop:10,display:"grid",gap:10}}>

          <a href="/seo/etsy-seo">Etsy SEO strategy</a>
          <a href="/seo/etsy-keywords">Etsy keyword research</a>
          <a href="/seo/etsy-titles">Etsy title optimization</a>

        </div>

      </div>

      {/* 🔥 RELATED IDEAS LOOP */}

      <div style={{marginTop:40}}>

        <h3>Related Market Ideas</h3>

        <div style={{
          display:"grid",
          gap:12,
          marginTop:12
        }}>

          {related.map((r,i)=>(
            <a
              key={i}
              href={`/idea/${r.replaceAll(" ","-")}`}
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

      <a href="/optimize">

        <button style={{
          marginTop:40,
          padding:"18px 24px",
          background:"#00ffae",
          borderRadius:12,
          border:"none",
          fontWeight:700,
          cursor:"pointer"
        }}>
          Optimize Your Listing →
        </button>

      </a>

    </main>

  )
}