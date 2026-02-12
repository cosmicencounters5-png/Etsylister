"use client"

import { useState } from "react"

export default function OptimizePage() {

  const [url,setUrl] = useState("")
  const [loading,setLoading] = useState(false)
  const [result,setResult] = useState<any>(null)

  async function optimize(){

    if(!url) return

    setLoading(true)
    setResult(null)

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
      alert("Something went wrong")
    }

    setLoading(false)
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

      <div style={{marginTop:30}}>

        <input
          value={url}
          onChange={(e)=>setUrl(e.target.value)}
          placeholder="Paste Etsy listing URL..."
          style={{
            width:"100%",
            padding:16,
            borderRadius:12,
            background:"#111",
            color:"white",
            border:"1px solid #222"
          }}
        />

        <button
          onClick={optimize}
          style={{
            marginTop:12,
            padding:16,
            borderRadius:12,
            width:"100%"
          }}
        >
          {loading ? "Loading..." : "Optimize"}
        </button>

      </div>

      {/* RESULT */}

      {result && (

        <div style={{marginTop:30}}>

          <h3>Original Title</h3>
          <p>{result.original?.title}</p>

          <h3>Optimized Title</h3>
          <p>{result.optimized?.title}</p>

          <h3>Description</h3>
          <p>{result.optimized?.description}</p>

        </div>

      )}

    </main>
  )
}