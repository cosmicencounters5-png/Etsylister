"use client"

import { useState } from "react"
import AuthGuard from "../../components/AuthGuard"

export default function IdeaScanner(){

  const [idea,setIdea]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

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

  const card={
    background:"#0f0f0f",
    padding:24,
    borderRadius:16,
    marginTop:20,
    border:"1px solid #1f1f1f"
  }

  return(

    <AuthGuard>

      <main style={{
        maxWidth:800,
        margin:"0 auto",
        padding:"80px 20px",
        color:"white"
      }}>

        <h1 style={{fontSize:42,fontWeight:800}}>
          Idea Scanner 🔥
        </h1>

        <p style={{opacity:.6}}>
          Validate your Etsy product idea before building the listing.
        </p>

        <input
          value={idea}
          onChange={(e)=>setIdea(e.target.value)}
          placeholder="Enter product idea..."
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
            borderRadius:12,
            background:"white",
            color:"black",
            fontWeight:700
          }}
        >
          {loading ? "Scanning market..." : "Scan Market 🚀"}
        </button>

        {result &&(

          <div>

            <div style={card}>
              👑 Opportunity Score: {result.score}/100
            </div>

            <div style={card}>
              Competition: {result.competition}
              <br/>
              Demand: {result.demand}
              <br/>
              Trend: {result.trend}
            </div>

            <div style={card}>
              <strong>AI Market Logic</strong>
              <p>{result.logic}</p>
            </div>

            <div style={card}>
              <strong>Winning Strategy</strong>
              <p>{result.strategy}</p>
            </div>

            <div style={card}>
              <strong>Listing Direction</strong>
              <p>{result.listingDirection}</p>
            </div>

          </div>

        )}

      </main>

    </AuthGuard>

  )

}