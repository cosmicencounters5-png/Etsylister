"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  function extractListingId(rawUrl:string){

    const match =
      rawUrl.match(/listing\/(\d+)/) ||
      rawUrl.match(/(\d{6,})/)

    if(!match) return null

    return match[1]
  }

  async function optimize(){

    if(!url) return

    setLoading(true)

    const id = extractListingId(url)

    if(!id){
      alert("Invalid Etsy link")
      setLoading(false)
      return
    }

    // 🔥 ZERO COST METHOD
    // We only use oEmbed metadata (NOT scraping HTML)

    const embedUrl =
      `https://www.etsy.com/oembed?url=https://www.etsy.com/listing/${id}`

    try{

      const res = await fetch(embedUrl)

      const data = await res.json()

      if(!data.title){
        alert("Could not parse listing")
        setLoading(false)
        return
      }

      const listing = {
        title: data.title,
        description: "",
        image: data.thumbnail_url
      }

      const aiRes = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ listing })
      })

      const aiData = await aiRes.json()

      setResult(aiData)

    }catch(e){

      alert("Could not parse listing")

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