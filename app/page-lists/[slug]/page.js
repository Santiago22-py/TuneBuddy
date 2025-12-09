"use client";

//React and Next imports
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../contexts/AuthContext";

//Custom imports
import { getListBySlug } from "../../services/list-service.js";
import { searchSongs } from "@/app/services/song-search";
import { addSongToList } from "@/app/services/song-service";

//Compenent imports
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import SongResultCard from "../../components/songResultCard.js";

export default function ListPage({ params }) {
  const { slug } = use(params); //Get slug from URL params

  //Auth and router hooks
  const router = useRouter();
  const { user, loading } = useUserAuth();

  //States for list data
  const [list, setList] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);

  //States for searching
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const [showSearch, setShowSearch] = useState(false);

  //Feedback for adding song
  const [addSongFeedback, setAddSongFeedback] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/page-login");
    }
  }, [loading, user, router]);

  // Load list data
  useEffect(() => {
    if (!user || !slug) return; //If user or slug not available yet, do nothing

    //Function to load the list
    const load = async () => {
      try {
        setLoadingList(true);
        const data = await getListBySlug(user.uid, slug);

        if (!data) {
          setError("List not found");
        } else {
          setList(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load list");
      } finally {
        setLoadingList(false);
      }
    };

    load();
  }, [user, slug]);

  // If loading, show a loading message
  if (loading || loadingList) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading list...
      </div>
    );
  }

  // If error occurred, show error message
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  ///////////////////////
  //                   //
  //HANDLING FUNCTIONS //
  //                   //
  ///////////////////////

  //Function to handle searching
  const handleSearch = async (e) => {
    e.preventDefault();

    setSearchError(null);
    setAddSongFeedback(null);

    //If query is empty, do nothing
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const results = await searchSongs(query.trim());
      setSearchResults(results);
    } catch (err) {
      console.error(err);
      setSearchError("Failed to search songs");
    } finally {
      setSearchLoading(false);
    }
  };

  //Function to handle adding a song to the list
  const handleAddSong = async (song) => {
    try {
      setAddSongFeedback(null);
      await addSongToList(user.uid, list.id, song);
      setAddSongFeedback(`Added "${song.title}" to the list!`);
    } catch (err) {
      console.error(err);
      setAddSongFeedback(`Failed to add "${song.title}" to the list.`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-[#050509] to-black">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10 text-white">
        {/* List header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-1">
              Your list
            </p>
            <h1 className="text-3xl md:text-4xl font-maven font-bold mb-2">
              {list.name}
            </h1>
            {list.description && (
              <p className="text-sm md:text-base text-slate-300 max-w-2xl">
                {list.description}
              </p>
            )}
          </div>
        </header>

        {/* Search & add section */}
        <div className="bg-black/50 rounded-2xl border border-white/10 p-6 shadow-lg shadow-[#FA8128]/10 mb-8">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl md:text-2xl font-maven font-semibold">
              Search and add songs
            </h2>

            {/* Toggle button to show or hide the search form */}
            <button
              type="button"
              onClick={() => setShowSearch((prev) => !prev)}
              className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 bg-black/60 text-white hover:border-[#FA8128] hover:bg-black transition">
              <span className="text-2xl leading-none text-[#FA8128]">
                {showSearch ? "−" : "+"}
              </span>
            </button>
          </div>

          <p className="text-sm text-slate-300 mb-4">
            Search for the songs{" "}
            <span className="text-[#FA8128] font-semibold">YOU</span> want and
            add them to 
            <span className="text-[#FA8128] font-semibold"> {list.name}</span>.
          </p>

          {/* If showSearch is true, display the search form */}
          {showSearch && (
            <div className="mt-4">
              {/* Search form */}
              <form
                onSubmit={handleSearch}
                className="flex flex-col md:flex-row gap-3 mb-4">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128]"
                  placeholder='Search for a song (e.g. "All Eyez On Me")'
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={searchLoading}
                  className="px-6 py-3 rounded-lg bg-[#FA8128] text-black font-semibold hover:bg-[#ff9b47] transition disabled:opacity-60 disabled:cursor-not-allowed">
                  {searchLoading ? "Searching..." : "Search"}
                </button>
              </form>

              {/* Feedback messages */}
              {/* If there's a search error, show it */}
              {searchError && (
                <p className="text-sm text-red-400 bg-red-950/40 border border-red-500/20 py-2 px-3 rounded-lg mb-3">
                  {searchError}
                </p>
              )}

              {/* If there's add song feedback, show it */}
              {addSongFeedback && (
                <p className="text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 py-2 px-3 rounded-lg mb-3">
                  {addSongFeedback}
                </p>
              )}

              {/* Results */}
              {searchResults.length > 0 && (
                <div className="mt-4 space-y-3">
                  {searchResults.map((song) => (
                    <SongResultCard
                      key={song.id}
                      song={song}
                      onAdd={handleAddSong}
                    />
                  ))}
                </div>
              )}

              {searchResults.length === 0 && !searchLoading && !searchError && (
                <p className="text-sm text-slate-400 mt-2">
                  Search for a song above to see results.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Placeholder: later show songs already in this list */}
        <div className="bg-black/40 rounded-2xl border border-white/10 p-6">
          <h2 className="text-lg md:text-xl font-semibold mb-2">
            Songs in this list
          </h2>
          <p className="text-sm text-slate-400">
            Once we wire up list songs, they’ll show up here.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
