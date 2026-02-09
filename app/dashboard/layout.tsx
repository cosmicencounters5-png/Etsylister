import { redirect } from "next/navigation"
import { createClient } from "@supabase/supabase-js"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {

  // 🔥 SERVER SIDE SUPABASE CLIENT
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // ⚠️ simple session check
  // siden vi ikke bruker ssr package nå

  // NOTE:
  // dette er basic protection
  // vi oppgraderer senere til cookie auth

  const { data } = await supabase.auth.getSession()

  if(!data?.session){
    redirect("/login")
  }

  return <>{children}</>
}