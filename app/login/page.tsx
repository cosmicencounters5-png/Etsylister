"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function Login(){

  const [email,setEmail]=useState("")
  const [loading,setLoading]=useState(false)

  async function signIn(){

    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options:{
        emailRedirectTo: window.location.origin + "/dashboard"
      }
    })

    if(error){
      alert(error.message)
    }else{
      alert("Check email for magic login link 😈")
    }

    setLoading(false)
  }

  return(

    <main style={{display:"flex",justifyContent:"center",paddingTop:120}}>

      <div style={{maxWidth:420,width:"100%"}}>

        <h1 style={{fontSize:42}}>ETSY LISTER</h1>

        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          style={{width:"100%",padding:14,marginTop:20}}
        />

        <button
          onClick={signIn}
          style={{marginTop:20,width:"100%"}}
        >
          {loading ? "Sending..." : "Login / Register"}
        </button>

      </div>

    </main>
  )
}