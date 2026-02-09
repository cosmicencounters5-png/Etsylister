"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function Login(){

  const router = useRouter()

  const [email,setEmail]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const [mode,setMode]=useState<"login"|"register">("login")

  async function handleAuth(){

    if(!email || !password) return

    setLoading(true)

    if(mode === "login"){

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if(error){
        alert(error.message)
        setLoading(false)
        return
      }

      router.push("/dashboard")

    }else{

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options:{
          emailRedirectTo: window.location.origin + "/dashboard"
        }
      })

      if(error){
        alert(error.message)
      }else{
        alert("Account created 😈 You can now login.")
        setMode("login")
      }

    }

    setLoading(false)
  }

  return(

    <main style={{
      display:"flex",
      justifyContent:"center",
      paddingTop:120
    }}>

      <div style={{maxWidth:420,width:"100%"}}>

        <h1 style={{
          fontSize:42,
          fontWeight:600
        }}>
          ETSY LISTER
        </h1>

        <input
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="Email"
          style={{
            width:"100%",
            padding:14,
            marginTop:20,
            borderRadius:10
          }}
        />

        <input
          type="password"
          value={password}
          onChange={(e)=>setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width:"100%",
            padding:14,
            marginTop:12,
            borderRadius:10
          }}
        />

        <button
          onClick={handleAuth}
          style={{
            marginTop:20,
            width:"100%",
            padding:14,
            borderRadius:12,
            fontWeight:600
          }}
        >
          {loading ? "Processing..." : mode === "login" ? "Login" : "Create Account"}
        </button>

        <div
          style={{
            marginTop:16,
            cursor:"pointer",
            opacity:.7
          }}
          onClick={()=>setMode(mode==="login"?"register":"login")}
        >
          {mode==="login"
            ? "Create account instead"
            : "Already have account? Login"}
        </div>

      </div>

    </main>
  )
}