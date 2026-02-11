"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [brainStep,setBrainStep]=useState("")
  const [result,setResult]=useState<any>(null)

  async function optimize(){

    if(!url) return

    setLoading(true)
    setResult(null)

    const steps=[
      "Scanning Etsy listing...",
      "Extracting structured data...",
      "Analyzing SEO signals...",
      "Detecting ranking gaps...",
      "Generating optimized version..."
    ]

    let i=0
    const interval=setInterval(()=>{
      setBrainStep(steps[i])
      i++
      if(i>=steps.length) clearInterval(interval)
    },600)

    try{

      // 🔥 SEND URL DIRECTLY TO API
      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          url
        })
      })

      const data = await res.json()

      if(data.error){
        alert(data.error)
        setLoading(false)
        return
      }

      setResult(data)

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

      <div style={{...card,marginTop:30}}>

        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="Paste Etsy listing URL..."
          style={{
            width:"100%",
            padding:18,
            borderRadius:12,
            border:"