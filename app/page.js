import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col bg-black min-h-screen">
      <Navbar />

      {/* Main content*/}
      <main className="flex-1">
        {/* Hero Section div */}
        {/* I divided the hero section int two, the text and button on the left and the image on the right */}
        <div className="bg-gradient-to-br from-black via-slate-900 to-[#1f2933]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12 px-6 py-20">
            {/* Left Column */}
            <div className="flex-1 space-y-6">
              <div>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-maven font-bold text-white mb-4 leading-tight">
                  Tired of losing track of your{" "}
                  <span className="text-[#FA8128]">favorite songs?</span>
                </h1>
                <p className="text-lg md:text-2xl text-slate-200 font-medium max-w-xl">
                  Tune Buddy is here to help you catalog and cherish your music
                  collection, one track at a time.{" "}
                  {/* Copilot added the stuff after "you" lol*/}
                </p>
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/page-login"
                  className="px-6 py-3 bg-[#FA8128] hover:bg-[#ff9b47] text-black font-semibold rounded-lg shadow-lg shadow-[#FA8128]/40 transition duration-300">
                  Start Tracking
                </Link>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="flex-1 flex justify-center">
              <div className="relative">
                {/* Glow behind image */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#FA8128]/30 via-purple-500/20 to-transparent blur-2xl opacity-80" />
                <Image
                  src="/assets/image/collection.jpg"
                  alt="A collection of CDs and vinyl records"
                  width={480}
                  height={480}
                  className="relative rounded-3xl shadow-2xl border border-white/10 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content div */}
        <div className="bg-[#ED820E] bg-gradient-to-b from-[#ED820E] to-[#c06710] text-black py-16 px-6">
          <div className="max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-maven font-bold">
                How does it work?
              </h2>
            </div>

            {/* Three cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="flex items-start gap-4 bg-white/95 rounded-2xl border border-black/10 p-6 shadow-md hover:-translate-y-1 hover:shadow-xl transition duration-200">
                <p className="text-4xl">🔍</p>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Search</h3>
                  <p className="text-base md:text-lg leading-snug text-slate-700">
                    Songs by title or artist using our built-in music search
                    powered by a public API.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex items-start gap-4 bg-white/95 rounded-2xl border border-black/10 p-6 shadow-md hover:-translate-y-1 hover:shadow-xl transition duration-200">
                <p className="text-4xl">➕</p>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Add</h3>
                  <p className="text-base md:text-lg leading-snug text-slate-700">
                    The songs to your custom collections like "Favorites", "Best
                    of Metal" or "90s Hip Hop".
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex items-start gap-4 bg-white/95 rounded-2xl border border-black/10 p-6 shadow-md hover:-translate-y-1 hover:shadow-xl transition duration-200">
                <p className="text-4xl">📊</p>
                <div>
                  <h3 className="text-2xl font-bold mb-1">See your stats</h3>
                  <p className="text-base md:text-lg leading-snug text-slate-700">
                    Discover your top artists and albums, and check out what you
                    listen the most.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="text-center mt-4">
              <h3 className="text-2xl md:text-3xl font-maven font-bold mb-3">
                Ready to start tracking?
              </h3>
              <p className="text-base md:text-lg text-black/80 mb-6">
                Create your free account and start building your music memory.
              </p>
              <Link
                href="/page-login"
                className="inline-flex items-center px-6 py-3 bg-black text-white font-semibold rounded-lg shadow-lg hover:bg-slate-900 transition duration-300">
                Get Started
                <span className="ml-2">🎧</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
