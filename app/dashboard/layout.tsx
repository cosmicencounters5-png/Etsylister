"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../lib/supabaseClient"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const router = useRouter()
  const [loading,setLoading] = useState(true)

  useEffect(()=>{

    async function checkAuth(){

      const { data } = await supabase.auth.getSession()

      if(!data.session){
        router.push("/login")
        return
      }

      setLoading(false)
    }

    checkAuth()

  },[])

  if(loading){
    return <div style={{padding:40}}>Loading...</div>
  }

  return <>{children}</>
}