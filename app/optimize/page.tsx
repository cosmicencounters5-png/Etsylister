"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [loading,setLoading] = useState(false)
  const [result,setResult] = useState<any>(null)

  async function optimize(){

    if(!title || !description) return

    setLoading(true)

    try{

      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          title,
          description
        })
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

  return(

    <main style={{maxWidth:800,margin:"0 auto",padding:"80px 20px"}}>

      <h1>Etsy Lister AI</h1>

      <textarea
        placeholder="Paste original title..."
        value={title}
        onChange={(e)=>setTitle(e.target.value)}
      />

      <textarea
        placeholder="Paste description..."
        value={description}
        onChange={(e)=>setDescription(e.target.value)}
      />

      <button onClick={optimize}>
        {loading ? "Optimizing..." : "Optimize Listing"}
      </button>

      {result && (

        <div>

          <h3>Before Score</h3>
          <p>{result.beforeScore}</p>

          <h3>Optimized Title</h3>
          <p>{result.optimized.title}</p>

          <h3>Optimized Description</h3>
          <p>{result.optimized.description}</p>

          <h3>Tags</h3>
          <p>{result.optimized.tags.join(", ")}</p>

          <h3>After Score</h3>
          <p>{result.afterScore}</p>

        </div>

      )}

    </main>

  )

}