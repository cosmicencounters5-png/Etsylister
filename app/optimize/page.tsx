"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  function extractId(rawUrl:string){

    const match =
      rawUrl.match(/listing\/(\d+)/) ||
      rawUrl.match(/(\d{6,})/)

    return match ? match[1] : null
  }

  async function optimize(){

    if(!url) return

    setLoading(true)

    const id = extractId(url)

    if(!id){
      alert("Invalid Etsy link")
      setLoading(false)
      return
    }

    try{

      // 🔥 DIRECT HTML FETCH (NO PROXY)
      const res = await fetch(`https://www.etsy.com/listing/${id}`)

      const html = await res.text()

      // 🔥 extract JSON-LD
      const matches = [...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      )]

      let listing:any = null

      for(const m of matches){

        try{

          const data = JSON.parse(m[1])

          if(data["@type"]==="Product"){

            listing = {
              title: data.name || "",
              description: data.description || "",
              image: Array.isArray(data.image)
                ? data.image[0]
                : data.image
            }

            break
          }

        }catch(e){}
      }

      if(!listing){

        alert("Could not parse listing")
        setLoading(false)
        return
      }

      // send til AI
      const aiRes = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ listing })
      })

      const data = await aiRes.json()

      setResult(data)

    }catch(e){

      console.log(e)
      alert("Parser failed")

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