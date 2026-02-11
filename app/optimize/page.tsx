export default function OptimizePage() {

  ...

  async function optimize(){

    try{

      const listing = await parseEtsyListing(url)

      if(!listing){
        alert("Could not parse listing")
        setLoading(false)
        return
      }

      const res = await fetch("/api/optimize",{
        method:"POST",
        headers:{ "Content-Type":"application/json"},
        body: JSON.stringify({
          listing
        })
      })

      const data = await res.json()

      setResult(data)

    }catch(e){
      console.log(e)
    }

  }

  return(
    <main>