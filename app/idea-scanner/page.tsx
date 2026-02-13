"use client"

import { useState } from "react"
import AuthGuard from "../../components/AuthGuard"

export default function IdeaScanner(){

  const [idea,setIdea]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)
  const [copied,setCopied]=useState(false)

  async function scan(){

    if(!idea) return

    setLoading(true)

    const res = await fetch("/api/ideaScanner",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body:JSON.stringify({ idea })
    })

    const data = await res.json()

    if(data.error){
      alert(data.error)
    }else{
      setResult(data)
    }

    setLoading(false)
  }

  function copyShare(){

    const text = `🔥 I tested my Etsy idea using EtsyLister AI.

Opportunity score: ${result.score}/100

Try it here:
${window.location.origin}`

    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(()=>setCopied(false),1200)
  }

  const card={
    background:"#0f0f0f",
    padding:24,
    borderRadius:18,
    marginTop:24,
    border:"1px solid #1f1f1f"
  }

  const scoreColor =
    result?.score >= 80 ? "#00ffae" :
    result?.score >= 60 ? "#ffaa00" :
    "#ff4444"

  return(

    <AuthGuard>

      <main style={{
        maxWidth:820,
        margin:"0 auto",
        padding:"80px 20px",
        color:"white"
      }}>

        <h1 style={{
          fontSize:44,
          fontWeight:800
        }}>
          Idea Scanner 🚀
        </h1>

        <p style={{opacity:.6}}>
          Validate Etsy ideas before wasting time building listings.
        </p>

        <input
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
          placeholder="Example: crochet dog sweater pattern"
          style={{
            width:"100%",
            marginTop:20,
            padding:18,
            borderRadius:12,
            background:"#111",
            border:"1px solid #222",
            color:"white"
          }}
        />

        <button
          onClick={scan}
          style={{
            width:"100%",
            marginTop:16,
            padding:18,
            borderRadius:14,
            background: loading
              ? "linear-gradient(90deg,#00ffd5,#00aaff)"
              : "white",
            color:"black",
            fontWeight:800,
            boxShadow: loading
              ? "0 0 20px rgba(0,255,200,0.5)"
              : "none"
          }}
        >
          {loading ? "Scanning Etsy market..." : "Scan Idea 🔥"}
        </button>

        {result &&(

          <>

            {/* SCORE VISUAL */}

            <div style={card}>

              <strong>Opportunity Score</strong>

              <div style={{
                marginTop:16,
                height:20,
                background:"#111",
                borderRadius:999,
                overflow:"hidden"
              }}>

                <div style={{
                  width:`${result.score}%`,
                  height:"100%",
                  background:scoreColor,
                  boxShadow:`0 0 20px ${scoreColor}`,
                  transition:"0.6s"
                }}/>

              </div>

              <h2 style={{
                marginTop:12,
                color:scoreColor
              }}>
                {result.score}/100
              </h2>

              {result.score>=80 &&(
                <p style={{color:"#00ffae"}}>
                  👑 GOD MODE opportunity
                </p>
              )}

            </div>

            {/* MARKET DATA */}

            <div style={card}>
              Competition: {result.competition}
              <br/>
              Demand: {result.demand}
              <br/>
              Trend: {result.trend}
            </div>

            {/* LOGIC */}

            <div style={card}>
              <strong>AI Market Logic</strong>
              <p>{result.logic}</p>
            </div>

            {/* STRATEGY */}

            <div style={card}>
              <strong>Winning Strategy</strong>
              <p>{result.strategy}</p>
            </div>

            {/* SHARE */}

            <button
              onClick={copyShare}
              style={{
                marginTop:24,
                padding:16,
                borderRadius:12,
                background:"#111",
                border:"1px solid #333",
                color:"white",
                width:"100%"
              }}
            >
              {copied ? "Copied ✓" : "Copy Share Text 🚀"}
            </button>

          </>

        )}

      </main>

    </AuthGuard>

  )

}