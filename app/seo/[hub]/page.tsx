import { Metadata } from "next"
import { baseKeywords } from "@/lib/seoKeywords"

type Props = {
  params:{
    hub:string
  }
}

function decodeHub(hub:string){
  return hub.replaceAll("-"," ")
}

// 🔥 hub matching engine
function getHubKeywords(hub:string){

  if(hub.includes("tag")){
    return baseKeywords.filter(k=>k.includes("tag"))
  }

  if(hub.includes("title")){
    return baseKeywords.filter(k=>k.includes("title"))
  }

  if(hub.includes("keyword")){
    return baseKeywords.filter(k=>k.includes("keyword"))
  }

  return baseKeywords.slice(0,12)
}

export async function generateMetadata({params}:Props):Promise<Metadata>{

  const hub = decodeHub(params.hub)

  return{

    title:`${hub} | Etsy SEO Hub (AI Generated)`,

    description:
      `Complete AI Etsy SEO hub for ${hub}. Strategies, keyword research, optimization and ranking guides.`

  }

}

export default function Page({params}:Props){

  const hub = decodeHub(params.hub)
  const pages = getHubKeywords(hub)

  return(

    <main style={{
      maxWidth:900,
      margin:"0 auto",
      padding:"80px 20px"
    }}>

      <h1 style={{fontSize:42,fontWeight:700}}>
        {hub} Hub
      </h1>

      <p style={{marginTop:20,fontSize:18}}>

        This hub contains advanced Etsy SEO guides focused on {hub}.
        Explore related optimization strategies below.

      </p>

      <div style={{
        marginTop:40,
        display:"grid",
        gap:12
      }}>

        {pages.map((k,i)=>(

          <a
            key={i}
            href={`/seo/${k.replaceAll(" ","-")}`}
            style={{
              background:"#0f0f0f",
              padding:14,
              borderRadius:12,
              display:"block",
              textDecoration:"none",
              color:"white"
            }}
          >
            {k}
          </a>

        ))}

      </div>

    </main>

  )

}