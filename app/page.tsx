"use client"

import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function LandingPage(){

  const router = useRouter()

  async function startNow(){

    const { data } = await supabase.auth.getSession()

    if(data.session){
      router.push("/dashboard")
    }else{
      router.push("/login")
    }

  }

  return(

    <main style={{
      minHeight:"100vh",
      background:"#050505",
      color:"white",
      display:"flex",
      justifyContent:"center",
      padding:"80px 20px"
    }}>

      <div style={{maxWidth:900,width:"100%"}}>

        {/* HEADER */}

        <header style={{
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          marginBottom:80
        }}>

          {/* 🔥 LOGO ENGINE */}

          <div style={{
            fontSize:22,
            fontWeight:700,
            letterSpacing:1
          }}>
            ETSY <span style={{opacity:.6}}>LISTER</span>
          </div>

          <div style={{display:"flex",gap:12}}>

            <button
              onClick={()=>router.push("/login")}
              style={{
                background:"transparent",
                border:"1px solid #222",
                padding:"8px 16px",
                borderRadius:10,
                color:"white"
              }}
            >
              Login
            </button>

            <button
              onClick={startNow}
              style={{
                background:"white",
                color:"black",
                padding:"8px 16px",
                borderRadius:10,
                fontWeight:600
              }}
            >
              Get Started
            </button>

          </div>

        </header>

        {/* HERO */}

        <section style={{textAlign:"center"}}>

          <h1 style={{
            fontSize:56,
            fontWeight:700,
            letterSpacing:-1,
            lineHeight:1.1
          }}>
            Outsmart Etsy SEO<br/>with Live AI Strategy
          </h1>

          <p style={{
            marginTop:20,
            opacity:.7,
            fontSize:18
          }}>
            Reverse engineer top listings, detect hidden opportunities,
            and generate domination-level listings instantly.
          </p>

          <button
            onClick={startNow}
            style={{
              marginTop:40,
              background:"white",
              color:"black",
              padding:"18px 28px",
              borderRadius:14,
              fontSize:18,
              fontWeight:600
            }}
          >
            Start Generating Listings →
          </button>

        </section>

        {/* FEATURES */}

        <section style={{
          marginTop:120,
          display:"grid",
          gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
          gap:20
        }}>

          <Feature
            title="Live Market Intelligence"
            text="Scan real Etsy listings and analyze demand signals in real-time."
          />

          <Feature
            title="AI Domination Strategy"
            text="Reverse engineer competitors and find ranking gaps instantly."
          />

          <Feature
            title="Conversion Optimized Titles"
            text="Generate listings engineered for clicks and buyer intent."
          />

        </section>

        {/* FOOTER */}

        <footer style={{
          marginTop:120,
          opacity:.4,
          textAlign:"center",
          fontSize:14
        }}>
          © {new Date().getFullYear()} ETSY LISTER
        </footer>

      </div>

    </main>
  )
}

function Feature({title,text}:{title:string,text:string}){

  return(
    <div style={{
      background:"#0f0f0f",
      padding:24,
      borderRadius:16,
      border:"1px solid #111"
    }}>

      <strong>{title}</strong>

      <p style={{marginTop:10,opacity:.7}}>
        {text}
      </p>

    </div>
  )
}