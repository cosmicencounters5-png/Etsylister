export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">

      <div className="max-w-xl w-full px-6">

        {/* Logo / Title */}
        <h1 className="text-5xl font-bold text-center mb-4">
          ETSYLISTER
        </h1>

        <p className="text-center text-gray-400 mb-10">
          AI-powered Etsy listing generator based on live competitor analysis.
        </p>

        {/* Input box */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">

          <input
            type="text"
            placeholder="What are you selling?"
            className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-white"
          />

          <button className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition">
            Generate Listing
          </button>

        </div>

      </div>

    </main>
  )
}