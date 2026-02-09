"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function AuthGuard({ children }: any){

  const router = useRouter()

  const [checking,setChecking] = useState(true)
  const [allowed,setAllowed] = useState(false)

  useEffect(()=>{

    let mounted = true

    async function check(){

      const { data } = await supabase.auth.getSession()

      if(!mounted) return

      if(!data.session){
        router.replace("/login")
        return
      }

      setAllowed(true)
      setChecking(false)
    }

    check()

    return () => {
      mounted = false
    }

  },[router])

  if(checking){
    return (
      <div style={{padding:40}}>
        Checking session...
      </div>
    )
  }

  if(!allowed) return null

  return children
}