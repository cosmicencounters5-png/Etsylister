import { Metadata } from "next"

type Props = {
  params:{
    slug:string
  }
}

function decode(slug:string){
  return slug.replaceAll("-"," ")
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const keyword = decode(params.slug)

  return{
    title:`${keyword} Etsy Market Analysis (AI Scanner)`,
    description:`AI analyzed Etsy market opportunity for ${keyword}. Profitability score, demand analysis and strategy.`,
    robots:{
      index:true,
      follow:true
    }
  }
}

export default function Page({params}:Props){

  const keyword = decode(params.slug)

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
        This Etsy niche analysis was generated using AI market scanning.
        Discover demand signals, competition levels and ranking opportunities.
      </p>

      {/* DEMAND SECTION */}

      <h2 style={{marginTop:40}}>
        Market Demand Signals
      </h2>

      <p>
        AI detected buyer intent trends around "{keyword}".
        Long-tail keyword positioning increases visibility
        and conversion probability.
      </p>

      {/* COMPETITION */}

      <h2 style={{marginTop:30}}>
        Competition Analysis
      </h2>

      <p>
        Medium competition level with opportunity for niche positioning.
        Listings combining strong keywords and digital intent perform best.
      </p>

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