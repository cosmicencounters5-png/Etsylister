"use client"

import { useEffect,useState } from "react"
import Link from "next/link"

export default function LandingClient(){

  const heroText="AI scans Etsy. Finds profitable niches. Builds domination listings."

  const [typed,setTyped]=useState("")
  const [brain,setBrain]=useState("Booting AI engine...")

  useEffect(()=>{

    let i=0

    const interval=setInterval(()=>{
      setTyped(heroText.slice(0,i))
      i++
      if(i>heroText.length) clearInterval(interval)
    },20)

    return ()=>clearInterval(interval)

  },[])

  useEffect(()=>{

    const steps=[
      "Scanning Etsy marketplace...",
      "Analyzing ranking signals...",
      "Detecting buyer intent...",
      "Finding profitable keywords...",
      "Building domination strategy..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setBrain(steps[i])
      i++
      if(i>=steps.length) i=0
    },1200)

    return ()=>clearInterval(interval)

  },[])

  const card={
    background:"#0f0f0f",
    padding:24,
    borderRadius:18,
    border:"1px solid #1f1f1f",
    transition:"0.2s"
  }

  return(

    <main style={{
      minHeight:"100vh",
      background:"#050505",
      display:"flex",
      justifyContent:"center",
      padding:"80px 20px",
      color:"white"
    }}>

      <div style={{maxWidth:820,width:"100%"}}>

        {/* HERO */}

        <h1 style={{
          fontSize:52,
          fontWeight:800,
          lineHeight:1.05,
          letterSpacing:-1
        }}>
          Etsy listings that actually rank.
        </h1>

        <p style={{
          marginTop:20,
          fontSize:24,
          opacity:0.85,
          minHeight:40
        }}>
          {typed}
        </p>

        {/* 🔥 PRIMARY TRAFFIC CTA STACK */}

        <div style={{display:"flex",gap:14,marginTop:34,flexWrap:"wrap"}}>

          <Link href="/idea">
            <button style={{
              padding:"18px 26px",
              borderRadius:14,
              background:"#00ffae",
              color:"black",
              fontWeight:800,
              border:"none",
              fontSize:16
            }}>
              Scan Product Idea 🔥
            </button>
          </Link>

          <Link href="/optimize">
            <button style={{
              padding:"18px 26px",
              borderRadius:14,
              background:"#111",
              border:"1px solid #222",
              color:"white",
              fontWeight:600
            }}>
              Optimize Existing Listing ⚡
            </button>
          </Link>

          <Link href="/login">
            <button style={{
              padding:"18px 26px",
              borderRadius:14,
              background:"white",
              color:"black",
              fontWeight:800,
              border:"none"
            }}>
              Full AI Generator 🚀
            </button>
          </Link>

        </div>

        <p style={{marginTop:14,opacity:0.5}}>
          AI-powered Etsy domination engine.
        </p>

        {/* LIVE AI */}

        <div style={{...card,marginTop:50}}>

          <strong>🧠 LIVE AI PROCESS</strong>

          <p style={{marginTop:10,opacity:0.8}}>
            {brain}
          </p>

        </div>

        {/* FEATURES */}

        <div style={{
          display:"grid",
          gap:20,
          marginTop:40
        }}>

          <div style={card}>
            👑 Profitability scoring from real Etsy signals
          </div>

          <div style={card}>
            ⚡ Long-tail keyword domination engine
          </div>

          <div style={card}>
            🔥 AI strategist insights — not generic copy
          </div>

          <div style={card}>
            🚀 Listing Optimizer — upgrade existing listings instantly
          </div>

        </div>

        {/* 🔥 AUTHORITY SEO BLOCK */}

        <div style={{...card,marginTop:40}}>

          <h3>AI Etsy SEO Engine</h3>

          <p style={{opacity:.7}}>
            EtsyLister analyzes ranking patterns, buyer intent,
            and marketplace competition to build listings designed
            to rank higher and convert faster.
          </p>

        </div>

        {/* SOCIAL PROOF */}

        <a
          href="https://www.facebook.com/share/187nfcCc65/?mibextid=wwXIfr"
          target="_blank"
          rel="noopener noreferrer"
          style={{textDecoration:"none"}}
        >

          <div style={{...card,marginTop:40,cursor:"pointer"}}>

            <h3 style={{fontSize:22,fontWeight:700}}>
              🔥 Real Etsy Seller Results
            </h3>

            <p style={{opacity:.7,marginTop:8}}>
              See how sellers use EtsyLister AI to generate optimized listings
              and dominate Etsy SEO.
            </p>

          </div>

        </a>

        {/* FINAL CTA */}

        <div style={{
          marginTop:60,
          textAlign:"center"
        }}>

          <Link href="/login">
            <button style={{
              padding:"22px 34px",
              borderRadius:18,
              background:"linear-gradient(90deg,#00ffd5,#00aaff)",
              color:"black",
              fontWeight:800,
              fontSize:18,
              boxShadow:"0 0 30px rgba(0,255,200,0.4)"
            }}>
              Activate Etsy Domination 🚀
            </button>
          </Link>

        </div>

      </div>

    </main>
  )
}