"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)

  async function optimize(){

    if(!title || !description) return

    setLoading(true)
    setResult(null)

    const brainSteps=[
      "Scanning Etsy SEO signals...",
      "Checking keyword intent...",
      "Analyzing ranking patterns...",
      "Generating optimized listing..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setStep(brainSteps[i])
      i++
      if(i>=brainSteps.length) clearInterval(interval)
    },800)

    try{

      const res=await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({ title,description })
      })

      const data=await res.json()

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

  return(

    <main style={{maxWidth:800,margin:"0 auto",padding:"80px 20px",color:"white"}}>

      <h1 style={{fontSize:40,fontWeight:700}}>
        Etsy Lister AI 🔥
      </h1>

      <textarea
        placeholder="Paste original title..."
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
        style={{width:"100%",marginTop:20,padding:12}}
      />

      <textarea
        placeholder="Paste description..."
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
        style={{width:"100%",marginTop:10,padding:12}}
      />

      <button onClick={optimize} style={{marginTop:20,padding:14}}>
        {loading ? step : "Optimize Listing 🚀"}
      </button>

      {result && (

        <div style={{marginTop:40}}>

          <h2>SEO Score</h2>

          <div style={{
            background:"#222",
            padding:20,
            borderRadius:10
          }}>
            <p>Before: {result.beforeScore}</p>
            <p>After: {result.afterScore} 🔥</p>
          </div>

          <h3 style={{marginTop:20}}>Optimized Title</h3>
          <p>{result.optimized.title}</p>

          <h3>Optimized Description</h3>
          <p>{result.optimized.description}</p>

          <h3>Suggested Tags</h3>
          <p>{result.optimized.tags.join(", ")}</p>

          <button onClick={optimize} style={{marginTop:20}}>
            Improve Again 🔥
          </button>

        </div>

      )}

    </main>
  )
}