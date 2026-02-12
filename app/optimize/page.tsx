"use client"

import { useState } from "react"

export default function OptimizePage(){

  const [url,setUrl]=useState("")
  const [result,setResult]=useState<any>(null)
  const [loading,setLoading]=useState(false)

  async function optimize(){

    if(!url) return

    setLoading(true)

    try{

      const proxy = await fetch("/api/proxy",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({ url })
      })

      const proxyData = await proxy.json()

      const html = proxyData.html

      if(!html){
        alert("Missing HTML")
        setLoading(false)
        return
      }

      const scripts = [...html.matchAll(
        /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g
      )]

      let listing:any=null

      for(const s of scripts){

        try{
          const data = JSON.parse(s[1])

          if(data["@type"]==="Product"){
            listing=data
            break
          }

          if(data["@graph"]){
            listing=data["@graph"].find((d:any)=>d["@type"]==="Product")
          }

        }catch{}
      }

      if(!listing){
        alert("Could not parse listing")
        setLoading(false)
        return
      }

      const api = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          listing:{
            title: listing.name,
            description: listing.description,
            image: listing.image
          }
        })
      })

      const data = await api.json()

      setResult(data)

    }catch(e){
      console.log(e)
    }

    setLoading(false)
  }

  return(

    <main>

      <h1>Etsy Listing Optimizer</h1>

      <input
        value={url}
        onChange={(e)=>setUrl(e.target.value)}
      />

      <button onClick={optimize}>
        {loading?"Loading":"Optimize"}
      </button>

      {result && (
        <>
          <h3>{result.original.title}</h3>
          <h3>{result.optimized.title}</h3>
        </>
      )}

    </main>
  )
}