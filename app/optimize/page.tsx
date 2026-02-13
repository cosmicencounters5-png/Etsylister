"use client"

import { useState } from "react"
import AuthGuard from "../../components/AuthGuard"

export default function OptimizePage(){

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)
  const [copied,setCopied]=useState("")

  function copy(text:string,label:string){

    navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(()=>setCopied(""),1200)
  }

  async function optimize(){

    if(!title || !description) return

    setLoading(true)
    setResult(null)

    const brainSteps=[
      "Scanning Etsy algorithm...",
      "Reading buyer psychology...",
      "Analyzing competitors...",
      "Injecting ranking signals...",
      "Finalizing AI upgrade..."
    ]

    let i=0

    const interval=setInterval(()=>{
      setStep(brainSteps[i])
      i++
      if(i>=brainSteps.length) clearInterval(interval)
    },600)

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

    background:"#0f0f0f",
    padding:24,
    borderRadius:18,
    marginTop:24,
    border:"1px solid #1a1a1a"
  }

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
          Etsy Lister AI 🚀
        </h1>

        <textarea
          placeholder="Original title..."
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
        />

        <textarea
          placeholder="Description..."
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
        />

        <button onClick={optimize}>
          {loading ? `🤖 ${step}` : "Optimize Listing 🔥"}
        </button>

        {result && (

          <div style={{marginTop:40}}>

            <div style={card}>
              SEO Score: {result.beforeScore} → {result.afterScore}
            </div>

            <div style={card}>
              <strong>Title</strong>
              <button onClick={()=>copy(result.optimized.title,"title")}>Copy</button>
              <p>{result.optimized.title}</p>
            </div>

            <div style={card}>
              <strong>Description</strong>
              <button onClick={()=>copy(result.optimized.description,"desc")}>Copy</button>
              <p>{result.optimized.description}</p>
            </div>

            <div style={card}>
              <strong>Tags</strong>
              <button onClick={()=>copy(result.optimized.tags.join(", "),"tags")}>
                Copy Tags
              </button>
              <p>{result.optimized.tags.join(", ")}</p>
            </div>

          </div>

        )}

      </main>

    </AuthGuard>

  )
}