"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)

  function copy(text:string){

    navigator.clipboard.writeText(text)

  }

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
    },700)

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

  const card={
    background:"#111",
    padding:20,
    borderRadius:12,
    marginTop:20
  }

  return(

    <main style={{maxWidth:800,margin:"0 auto",padding:"80px 20px",color:"white"}}>

      <h1 style={{fontSize:42,fontWeight:700}}>
        Etsy Lister AI 🚀
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
        {loading ? step : "Optimize Listing 🔥"}
      </button>

      {result && (

        <div style={{marginTop:40}}>

          {/* SCORE */}

          <div style={card}>
            <strong>SEO Score</strong>
            <p>Before: {result.beforeScore}</p>
            <p>After: {result.afterScore} 🚀</p>
          </div>

          {/* TITLE */}

          <div style={card}>
            <strong>Optimized Title</strong>
            <button onClick={()=>copy(result.optimized.title)}>Copy</button>
            <p>{result.optimized.title}</p>
          </div>

          {/* DESCRIPTION */}

          <div style={card}>
            <strong>Optimized Description</strong>
            <button onClick={()=>copy(result.optimized.description)}>Copy</button>
            <p>{result.optimized.description}</p>
          </div>

          {/* TAGS */}

          <div style={card}>
            <strong>SEO Tags</strong>

            <button
              onClick={()=>
                copy(result.optimized.tags.join(", "))
              }
            >
              Copy Tags
            </button>

            <p>
              {result.optimized.tags.join(", ")}
            </p>

          </div>

        </div>

      )}

    </main>

  )

}