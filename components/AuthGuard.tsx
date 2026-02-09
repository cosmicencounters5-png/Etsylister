"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"

export default function AuthGuard({children}:any){

  const [loading,setLoading]=useState(true)
  const [allowed,setAllowed]=useState(false)

  useEffect(()=>{

    async function check(){

      const { data } = await supabase.auth.getSession()

      if(!data.session){
        window.location.href="/login"
        return
      }

      setAllowed(true)
      setLoading(false)
    }

    check()

  },[])

  if(loading){
    return (
      <div style={{padding:40}}>
        Checking session...
      </div>
    )
  }

  if(!allowed) return null

  return children
}