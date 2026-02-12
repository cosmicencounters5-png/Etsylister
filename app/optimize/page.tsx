"use client"

import { useState } from "react"
import { parseEtsyListing } from "@/lib/etsyParserClient"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [loading,setLoading]=useState(false)
  const [result,setResult]=useState<any>(null)

  async function optimize(){

    setLoading(true)

    const listing = await parseEtsyListing(url)

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
    <main>
      <h1>Etsy Listing Optimizer</h1>

      <input value={url} onChange={(e)=>setUrl(e.target.value)} />

      <button onClick={optimize}>
        {loading ? "Loading..." : "Optimize"}
      </button>

      {result && <p>{result.original.title}</p>}
    </main>
  )
}