"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  async function clientParse(url:string){

    const match =
      url.match(/listing\/(\d+)/) ||
      url.match(/(\d{6,})/)

    if(!match) return null

    const listingUrl = `https://www.etsy.com/listing/${match[1]}`

    // 🔥 fetch via browser (not server)
    const res = await fetch(
      `https://corsproxy.io/?${encodeURIComponent(listingUrl)}`
    )

    const html = await res.text()

    const titleMatch =
      html.match(/<meta property="og:title" content="([^"]+)"/)

    const descMatch =
      html.match(/<meta name="description" content="([^"]+)"/)

    const imageMatch =
      html.match(/<meta property="og:image" content="([^"]+)"/)

    if(!titleMatch) return null

    return{
      title:titleMatch[1],
      description:descMatch?.[1] || "",
      image:imageMatch?.[1] || ""
    }
  }

  async function optimize(){

    if(!url) return

    setLoading(true)

    try{

      // 🔥 STEP 1 — CLIENT PARSE (FREE)
      const listing = await clientParse(url)

      if(!listing){
        alert("Could not parse listing")
        setLoading(false)
        return
      }

      // 🔥 STEP 2 — send to AI API
      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body:JSON.stringify({ listing })
      })

      const data = await res.json()

      setResult(data)

    }catch(e){
      console.log(e)
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