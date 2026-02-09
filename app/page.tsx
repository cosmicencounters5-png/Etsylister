"use client"

import { useRouter } from "next/navigation"

export default function Home(){

  const router = useRouter()

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      alignItems:"center",
      justifyContent:"center"
    }}>

      <div style={{
        width:"100%",
        maxWidth:420,
        textAlign:"center"
      }}>

        <h1 style={{
          fontSize:56,
          fontWeight:700,
          marginBottom:20
        }}>
          ETSY LISTER AI
        </h1>

        <p style={{opacity:.7,marginBottom:40}}>
          Live Market Intelligence for Etsy domination.
        </p>

        <button
          onClick={()=>router.push("/dashboard")}
          style={{
            width:"100%",
            padding:18,
            borderRadius:12,
            background:"white",
            color:"black",
            fontWeight:600
          }}
        >
          Enter Dashboard
        </button>

      </div>

    </main>
  )
}