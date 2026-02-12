import { NextResponse } from "next/server"

export async function POST(req:Request){

  try{

    const body = await req.json()
    const url = body.url

    if(!url){

      return NextResponse.json(
        { error:"Missing URL"},
        { status:400}
      )
    }

    const res = await fetch(url,{
      headers:{
        "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    })

    const html = await res.text()

    return NextResponse.json({ html })

  }catch(e){

    console.log(e)

    return NextResponse.json(
      { error:"Proxy failed"},
      { status:500}
    )

  }
}