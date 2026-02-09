"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function Landing(){

  const [loading,setLoading]=useState(false)

  // AUTO REDIRECT IF LOGGED IN
  useEffect(()=>{

    async function check(){

      const { data } = await supabase.auth.getSession()

      if(data.session){
        window.location.href="/dashboard"
      }

    }

    check()

  },[])

  function goLogin(){
    window.location.href="/login"
  }

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      paddingTop:80
    }}>

      <div style={{
        maxWidth:900,
        width:"100%",
        padding:"0 20px"
      }}>

        {/* HERO */}

        <section style={{textAlign:"center"}}>

          <h1 style={{
            fontSize:52,
            fontWeight:700,
            lineHeight:1.1
          }}>
            ETSY LISTER
          </h1>

          <p style={{
            opacity:.8,
            marginTop:20,
            fontSize:20
          }}>
            AI that reverse engineers winning Etsy listings
            and generates domination-ready titles, tags and descriptions.
          </p>

          <button
            onClick={goLogin}
            style={{
              marginTop:30,
              padding:"18px 28px",
              fontSize:18,
              borderRadius:14,
              background:"white",
              color:"black",
              fontWeight:600,
              border:"none",
              cursor:"pointer"
            }}
          >
            Start Free →
          </button>

        </section>

        {/* FEATURE GRID */}

        <section style={{
          marginTop:80,
          display:"grid",
          gap:20
        }}>

          <Feature
            title="Live Market Intelligence"
            desc="Analyzes real competitor data and ranking signals before generating your listing."
          />

          <Feature
            title="AI Domination Engine"
            desc="Detects buyer intent, keyword gaps and hidden opportunity niches."
          />

          <Feature
            title="Instant Listing Generator"
            desc="Create high-converting titles, descriptions and tags in seconds."
          />

        </section>

        {/* SOCIAL PROOF STYLE BLOCK */}

        <section style={{
          marginTop:80,
          background:"#0f0f0f",
          padding:30,
          borderRadius:18
        }}>

          <h2 style={{fontSize:28}}>
            Stop guessing Etsy SEO.
          </h2>

          <p style={{opacity:.8,marginTop:10}}>
            ETSY LISTER scans real listing structures, detects ranking DNA,
            and builds optimized listings designed to outrank competitors.
          </p>

        </section>

        {/* FINAL CTA */}

        <section style={{
          marginTop:80,
          textAlign:"center"
        }}>

          <button
            onClick={goLogin}
            style={{
              padding:"20px 32px",
              fontSize:20,
              borderRadius:14,
              background:"white",
              color:"black",
              fontWeight:700
            }}
          >
            Launch AI Strategist 🚀
          </button>

        </section>

      </div>

    </main>

  )
}

function Feature({title,desc}:any){

  return(

    <div style={{
      background:"#0f0f0f",
      padding:24,
      borderRadius:16
    }}>
      <h3>{title}</h3>
      <p style={{opacity:.8,marginTop:8}}>{desc}</p>
    </div>

  )
}