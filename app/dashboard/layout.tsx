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
  const [allowed,setAllowed] = useState(false)

  useEffect(()=>{

    // 🔥 check current session
    async function init(){

      const { data } = await supabase.auth.getSession()

      if(data.session){
        setAllowed(true)
      } else {
        router.replace("/login")
      }

      setLoading(false)
    }

    init()

    // 🔥 listen for auth changes (magic link / refresh safe)
    const { data: listener } =
      supabase.auth.onAuthStateChange((event, session)=>{

        if(!session){
          router.replace("/login")
        } else {
          setAllowed(true)
        }

      })

    return () => {
      listener.subscription.unsubscribe()
    }

  },[])

  if(loading){
    return (
      <div style={{padding:40}}>
        🤖 Checking session...
      </div>
    )
  }

  if(!allowed) return null

  return <>{children}</>
}