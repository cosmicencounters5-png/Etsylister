import { Metadata } from "next"
import Link from "next/link"

type Props = {
  params:{ keyword:string }
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const keyword = params.keyword.replaceAll("-"," ")

  return{
    title:`AI Etsy Listing Generator for ${keyword} | EtsyLister`,
    description:`Generate high-ranking Etsy listings for ${keyword} using AI. Analyze competitors, find profitable niches and optimize SEO automatically.`,
    alternates:{
      canonical:`https://etsylister.com/etsy-listing-generator/${params.keyword}`
    }
  }
}

export default function Page({params}:Props){

  const keyword = params.keyword.replaceAll("-"," ")

  return(

    <main style={{
      minHeight:"100vh",
      background:"#050505",
      color:"white",
      padding:"80px 20px",
      display:"flex",
      justifyContent:"center"
    }}>

      <div style={{maxWidth:700,width:"100%"}}>

        <h1 style={{fontSize:42,fontWeight:700}}>
          AI Etsy Listing Generator for {keyword}
        </h1>

        <p style={{marginTop:20,opacity:0.8}}>
          Create SEO optimized Etsy listings for {keyword}.
          Analyze competitors, detect profitable keywords and generate domination titles and tags automatically.
        </p>

        <div style={{
          marginTop:40,
          background:"#0f0f0f",
          padding:24,
          borderRadius:14,
          border:"1px solid #1f1f1f"
        }}>
          <strong>Why sellers use AI for {keyword}</strong>

          <ul style={{marginTop:10}}>
            <li>Long-tail keyword targeting</li>
            <li>Competitor ranking analysis</li>
            <li>SEO title optimization</li>
            <li>High converting tag strategies</li>
          </ul>

        </div>

        <Link href="/login">
          <button style={{
            marginTop:30,
            padding:"18px 24px",
            background:"white",
            color:"black",
            borderRadius:12,
            fontWeight:700
          }}>
            Generate Listing Now
          </button>
        </Link>

      </div>

    </main>
  )
}