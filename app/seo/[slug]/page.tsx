import { Metadata } from "next"
import Link from "next/link"

type Props = {
  params:{ slug:string }
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const keyword = params.slug.replaceAll("-"," ")

  return{
    title:`${keyword} | EtsyLister AI`,
    description:`${keyword}. AI powered Etsy SEO optimization and listing generator.`
  }
}

export default function Page({params}:Props){

  const keyword = params.slug.replaceAll("-"," ")

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

        <h1>{keyword}</h1>

        <p style={{marginTop:20}}>
          Generate optimized Etsy listings using AI strategy and real competitor data.
        </p>

        <Link href="/login">
          <button style={{
            marginTop:30,
            padding:"18px 24px",
            background:"white",
            color:"black",
            borderRadius:12,
            fontWeight:700
          }}>
            Try AI Listing Generator
          </button>
        </Link>

      </div>

    </main>
  )
}