"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AuthGuard from "@/components/AuthGuard"

export default function OptimizePage(){

  const router = useRouter()

  const [title,setTitle]=useState("")
  const [description,setDescription]=useState("")
  const [loading,setLoading]=useState(false)
  const [step,setStep]=useState("")
  const [result,setResult]=useState<any>(null)
  const [copied,setCopied]=useState("")

  function copy(text:string,label:string){

    navigator.clipboard.writeText(text)
    setCopied(label)

    setTimeout(()=>setCopied(""),1200)
  }

  async function optimize(){

    if(!title || !description) return

    setLoading(true)
    setResult(null)

    const brainSteps=[
      "Scanning Etsy algorithm...",
      "Reading buyer psychology...",
      "Analyzing competitors...",
      "Injecting ranking signals...",
      "Finalizing AI upgrade