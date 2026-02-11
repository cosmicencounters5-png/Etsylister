export async function POST(req:Request){

  const { url } = await req.json()

  try{

    const res = await fetch(url,{
      headers:{
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    })

    const html = await res.text()

    return Response.json({ html })

  }catch(e){

    return Response.json({ error:true })

  }

}