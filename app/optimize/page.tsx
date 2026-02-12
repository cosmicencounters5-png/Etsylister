"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  async function clientParser(rawUrl:string){

    const match =
      rawUrl.match(/listing\/(\d+)/) ||
      rawUrl.match(/(\d{6,})/)

    if(!match) return null

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    // 🔥 browser fetch (NOT server)
    const res = await fetch(listingUrl)

    const html = await res.text()

    const scripts = [...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
    )]

    for(const s of scripts){

      try{

        const data = JSON.parse(s[1])

        if(data["@type"]==="Product"){

          return {
            title: data.name || "",
            description: data.description || "",
            image: data.image || ""
          }

        }

      }catch(e){}
    }

    return null
  }

  async function optimize(){

    if(!url) return

    setLoading(true)

    const listing = await clientParser(url)

    if(!listing){
      alert("Could not parse listing")
      setLoading(false)
      return
    }

    const res = await fetch("/api/optimize",{
      method:"POST",
      headers:{ "Content-Type":"application/json"},
      body: JSON.stringify({ listing })
    })

    const data = await res.json()

    setResult(data)

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