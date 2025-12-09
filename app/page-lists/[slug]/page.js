"use client";

//React and Next imports
import { use, useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../contexts/AuthContext";

//Custom imports
import { getListBySlug } from "../../services/list-service.js";
import { searchSongs } from "@/app/services/song-search";
import { addSongToList } from "@/app/services/song-service";
import { deleteSongFromList } from "@/app/services/song-service";
import { getAllSongs } from "@/app/services/song-service";

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

  //States for songs in the list
  const [songs, setSongs] = useState([]);
  const [songsLoading, setSongsLoading] = useState(true);

  //States for the audio Preview
  const [currentPreviewId, setCurrentPreviewId] = useState(null);
  const audioRef = useRef(null);

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

  //Load songs in the list
  useEffect(() => {
    if (!user || !list) return; //If user or list not available yet, do nothing

    //Function to load songs
    const loadSongs = async () => {
      try {
        setSongsLoading(true);
        const data = await getAllSongs(user.uid, list.id);
        setSongs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setSongsLoading(false);
      }
    };
    loadSongs();
  }, [user, list]);

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

  // Helper function to refresh songs
  const refreshSongs = async () => {
    if (!user || !list) return;
    try {
      setSongsLoading(true);
      const data = await getAllSongs(user.uid, list.id);
      setSongs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSongsLoading(false);
    }
  };

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

      //Clear search input and results
      setQuery("");
      setSearchResults([]);

      await refreshSongs();
    } catch (err) {
      console.error(err);
      setAddSongFeedback(`Failed to add "${song.title}" to the list.`);
    }
  };

  //Function to handle removing a song from the list
  const handleDeleteSong = async (songId) => {
    try {
      await deleteSongFromList(user.uid, list.id, songId);
      await refreshSongs();
    } catch (err) {
      console.error(err);
    }
  };


  //Function to handle playing preview
  const handlePlayPreview = (song) => {
    const audio = audioRef.current; //Get audio element
    if (!audio) return;

    if (currentPreviewId === song.id) {
      //If the same song is clicked, pause it
      audio.pause();
      setCurrentPreviewId(null);
      return;
    }

    //Othwerwise, play the new song
    audio.src = song.previewUrl;
    audio.play();
    setCurrentPreviewId(song.id);
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
        {/* Search & add div */}
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
                      onPreview={handlePlayPreview}
                      isPlaying={currentPreviewId === song.id}
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
        {/* Display songs in the list */}
        <audio ref={audioRef} className="hidden" />{" "}
        {/* Hidden audio element for previews */}
        <h2 className="text-4xl font-semibold mb-1 mt-10">
          Check out these <span className="text-[#FA8128]">Bangers</span>!
        </h2>
        <div className="bg-black/40 rounded-2xl border border-white/10 p-6 ">
          {/* if soings are still loading, show loading message */}
          {songsLoading && (
            <p className="text-slate-400 animate-pulse">Loading songs...</p>
          )}

          {/* if no songs in the list, show message */}
          {!songsLoading && songs.length === 0 && (
            <p className="text-slate-500">
              This list is empty. Search above to add some songs!
            </p>
          )}

          {/* Otherwise, show the songs */}
          {!songsLoading && songs.length > 0 && (
            <div className="space-y-4">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-black/60 border border-white/10 hover:border-[#FA8128] transition">
                  <img
                    src={song.artwork}
                    alt={song.title}
                    className="w-40 h-40 rounded-md shadow"
                  />
                  <div className="flex-1">
                    <h3 className="text-white font-semibold text-2xl">
                      {song.title}
                    </h3>
                    <p className="text-slate-400 text-md">
                      {song.artist} • {song.album}
                    </p>
                    {/* Preview button */}
                    {song.previewUrl && (
                      <button
                        type="button"
                        onClick={() => handlePlayPreview(song)}
                        className="mt-3 inline-flex items-center px-4 py-2 rounded-full bg-[#FA8128] text-black text-sm font-semibold hover:bg-[#ff9b47] transition">
                        {currentPreviewId === song.id
                          ? "Pause preview"
                          : "Play preview"}
                      </button>
                    )}

                    {!song.previewUrl && (
                      <p className="mt-2 text-xs text-slate-500">
                        No preview available for this track.
                      </p>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteSong(song.id)}
                      className="self-start ml-auto px-4 py-2 rounded-full bg-[#FA8128] hover:bg-[#ff9b47] text-black text-sm font-semibold transition flex items-center gap-2">
                      <img
                        src="/assets/svg/trash.svg"
                        alt="Delete song"
                        width={16}
                        height={16}
                        className="opacity-90"
                      />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
