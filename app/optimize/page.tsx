"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [result,setResult]=useState<any>(null)
  const [loading,setLoading]=useState(false)

  async function optimize(){

    if(!url) return

    setLoading(true)

    const res = await fetch("/api/optimize",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ url })
    })

    const data = await res.json()

    if(data.error){
      alert(data.error)
    } else {
      setResult(data)
    }

    setLoading(false)
  }

  return(

    <main style={{maxWidth:800,margin:"0 auto",padding:"80px 20px"}}>

      <h1>Etsy Listing Optimizer</h1>

      <input
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
        placeholder="Paste Etsy listing URL..."
      />

      <button onClick={optimize}>
        {loading ? "Loading..." : "Optimize"}
      </button>

      {result && (

        <div>

          <h3>Original Title</h3>
          <p>{result.original?.title}</p>

          <h3>Optimized Title</h3>
          <p>{result.optimized?.title}</p>

        </div>

      )}

    </main>
  )
}