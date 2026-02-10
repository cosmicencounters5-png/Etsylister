"use client"

import { useEffect,useState } from "react"
import Link from "next/link"

export default function Landing(){

  const heroText="AI scans Etsy. Finds profitable niches. Builds domination listings."

  const [typed,setTyped]=useState("")
  const [brain,setBrain]=useState("Booting AI engine...")

  // 🔥 typing hero
  useEffect(()=>{

    let i=0

    const interval=setInterval(()=>{
      setTyped(heroText.slice(0,i))
      i++
      if(i>heroText.length) clearInterval(interval)
    },20)

    return ()=>clearInterval(interval)

  },[])

  // 🔥 fake AI brain activity (psychology trick)
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
    border:"1px solid #1f1f1f"
  }

  return(

    <main style={{
      minHeight:"100vh",
      background:"#050505",
      display:"flex",
      justifyContent:"center",
      padding:"80px 20px"
    }}>

      <div style={{maxWidth:720,width:"100%"}}>

        {/* HERO */}

        <h1 style={{
          fontSize:46,
          fontWeight:700,
          lineHeight:1.1
        }}>
          Etsy listings that actually rank.
        </h1>

        <p style={{
          marginTop:20,
          fontSize:22,
          opacity:0.8,
          minHeight:32
        }}>
          {typed}
        </p>

        {/* CTA */}

        <div style={{display:"flex",gap:12,marginTop:30}}>

          <Link href="/login">
            <button style={{
              padding:"18px 24px",
              borderRadius:12,
              background:"white",
              color:"black",
              fontWeight:700,
              border:"none"
            }}>
              Start Free
            </button>
          </Link>

          <Link href="/login">
            <button style={{
              padding:"18px 24px",
              borderRadius:12,
              background:"#111",
              border:"1px solid #222",
              color:"white"
            }}>
              Login
            </button>
          </Link>

        </div>

        <p style={{marginTop:14,opacity:0.5}}>
          AI-powered Etsy domination engine.
        </p>

        {/* LIVE AI PANEL */}

        <div style={{...card,marginTop:50}}>

          <strong>🧠 LIVE AI PROCESS</strong>

          <p style={{marginTop:10,opacity:0.8}}>
            {brain}
          </p>

        </div>

        {/* FEATURES */}

        <div style={{display:"grid",gap:20,marginTop:30}}>

          <div style={card}>
            👑 Profitability scoring from real Etsy data
          </div>

          <div style={card}>
            ⚡ Long-tail keyword domination engine
          </div>

          <div style={card}>
            🔥 AI strategist insights — not generic copy
          </div>

        </div>

      </div>

    </main>
  )
}