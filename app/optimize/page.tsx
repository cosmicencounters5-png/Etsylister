"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [brain,setBrain]=useState("")
  const [result,setResult]=useState<any>(null)

  async function optimize(){

    if(!url) return

    setLoading(true)
    setResult(null)

    const steps=[
      "Scanning Etsy market...",
      "Analyzing ranking patterns...",
      "Detecting buyer intent...",
      "Reverse engineering top sellers...",
      "Building domination listing..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setBrain(steps[i])
      i++
      if(i>=steps.length) clearInterval(interval)
    },600)

    try{

      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ url })
      })

      const data = await res.json()

      if(data.error){
        alert(data.error)
      }else{
        setResult(data)
      }

    }catch(e){
      console.log(e)
    }

    setLoading(false)
  }

  const card={
    background:"#0f0f0f",
    padding:20,
    borderRadius:16,
    border:"1px solid #1f1f1f"
  }

  return(

    <main style={{
      maxWidth:800,
      margin:"0 auto",
      padding:"80px 20px"
    }}>

      <h1 style={{fontSize:36,fontWeight:700}}>
        Etsy Listing Optimizer
      </h1>

      {/* INPUT */}

      <div style={{...card,marginTop:30}}>

        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="Paste Etsy listing URL..."
          style={{
            width:"100%",
            padding:18,
            borderRadius:12,
            border:"1px solid #222",
            background:"#111",
            color:"white"
          }}
        />

        <button
          onClick={optimize}
          style={{
            width:"100%",
            marginTop:14,
            padding:18,
            borderRadius:12,
            background:"white",
            color:"black",
            fontWeight:600
          }}
        >
          {loading ? brain : "Optimize Listing"}
        </button>

      </div>

      {/* RESULTS */}

      {result && (

        <div style={{marginTop:30}}>

          <div style={card}>
            <strong>Original Keyword</strong>
            <p>{result.original?.title}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>Optimized Title</strong>
            <p>{result.optimized?.title}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>Description</strong>
            <p>{result.optimized?.description}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>Tags</strong>
            <p>{result.optimized?.tags}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>Strategy Insights</strong>
            <p>{result.optimized?.strategyInsights}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>SEO Advantage</strong>
            <p>{result.optimized?.seoAdvantage}</p>
          </div>

          <div style={{...card,marginTop:20}}>
            <strong>Competition Insights</strong>
            <p>{result.optimized?.competitionInsights}</p>
          </div>

        </div>

      )}

    </main>

  )

}