"use client"

import { useState,useEffect } from "react"
import Link from "next/link"

export default function Landing(){

  const [typed,setTyped]=useState("")
  const text="AI scans Etsy. Finds profitable niches. Builds domination listings."

  // 🔥 AI typing effect
  useEffect(()=>{

    let i=0

    const interval=setInterval(()=>{

      setTyped(text.slice(0,i))
      i++

      if(i>text.length) clearInterval(interval)

    },25)

    return ()=>clearInterval(interval)

  },[])

  const card={
    background:"#0f0f0f",
    padding:22,
    borderRadius:18,
    border:"1px solid #1f1f1f",
    boxShadow:"0 0 0 1px rgba(255,255,255,0.03)"
  }

  return(

    <main style={{
      minHeight:"100vh",
      display:"flex",
      justifyContent:"center",
      padding:"80px 20px",
      background:"#050505"
    }}>

      <div style={{maxWidth:720,width:"100%"}}>

        {/* HERO */}

        <h1 style={{
          fontSize:42,
          fontWeight:700,
          lineHeight:1.2
        }}>
          Build Etsy listings that actually rank.
        </h1>

        <p style={{
          marginTop:20,
          fontSize:20,
          opacity:0.8,
          minHeight:30
        }}>
          {typed}
        </p>

        {/* CTA */}

        <div style={{
          display:"flex",
          gap:12,
          marginTop:30
        }}>

          <Link href="/login">
            <button style={{
              padding:"16px 22px",
              borderRadius:12,
              background:"white",
              color:"black",
              fontWeight:600,
              border:"none",
              cursor:"pointer"
            }}>
              Start Free
            </button>
          </Link>

          <Link href="/login">
            <button style={{
              padding:"16px 22px",
              borderRadius:12,
              background:"#111",
              color:"white",
              border:"1px solid #222",
              cursor:"pointer"
            }}>
              Login
            </button>
          </Link>

        </div>

        <p style={{opacity:0.5,marginTop:18}}>
          AI-powered Etsy keyword domination.
        </p>

        {/* LIVE AI SECTION */}

        <div style={{...card,marginTop:50}}>

          <strong>🧠 AI THINKING...</strong>

          <ul style={{marginTop:14,opacity:0.7}}>
            <li>Scanning competitors...</li>
            <li>Analyzing SEO patterns...</li>
            <li>Detecting buyer intent...</li>
            <li>Finding profitable keywords...</li>
          </ul>

        </div>

        {/* FEATURE BLOCKS */}

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