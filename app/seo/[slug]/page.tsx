import { Metadata } from "next"

type Props = {
  params:{
    slug:string
  }
}

function decodeSlug(slug:string){
  return slug.replaceAll("-"," ")
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

  return(

    <main style={{
      maxWidth:900,
      margin:"0 auto",
      padding:"80px 20px"
    }}>

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

    </main>

  )

}