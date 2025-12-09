"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { getLists, createList } from "../services/list-service.js";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUserAuth();

  // List helper states
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState(null);

  // New list helper states
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  // Control showing/hiding create list panel
  const [showCreate, setShowCreate] = useState(false);

  //If user is not logged in, redirect to login page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/page-login");
    }
  }, [loading, user, router]);

  // Load user's lists
  useEffect(() => {
    const loadLists = async () => {
      if (!user) return;

      try {
        setListsLoading(true);
        setListsError(null);
        const data = await getLists(user.uid);
        setLists(data);
      } catch (err) {
        console.error("Error loading lists:", err);
        setListsError("Failed to load your lists. Please try again.");
      } finally {
        setListsLoading(false);
      }
    };

    loadLists();
  }, [user]);

  const handleCreateList = async (e) => {
    e.preventDefault();
    // Prevent creating list with empty name
    if (!newListName.trim()) return;

    try {
      setCreatingList(true);
      setListsError(null);

      const listId = await createList(
        user.uid,
        newListName.trim(),
        newListDescription.trim()
      );

      // Update local lists state to include the new list
      setLists((prev) => [
        ...prev,
        {
          id: listId,
          name: newListName.trim(),
          description: newListDescription.trim(),
          createdAt: { seconds: Date.now() / 1000 },
        },
      ]);

      setNewListName("");
      setNewListDescription("");
    } catch (err) {
      console.error("Error creating list:", err);
      setListsError("Failed to create list. Please try again.");
    } finally {
      setCreatingList(false);
    }
  };

  // If page is still loading auth state, show loading message
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // If not logged in, redirect already triggered; render nothing
  if (!user) {
    return null;
  }

  const username = user.displayName || "music fan";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-[#050509] to-black">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Header area with stats vibe */}
        <header className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-maven font-bold text-white mb-2">
              Welcome back, <span className="text-[#FA8128]">{username}</span>{" "}
            </h1>
            <p className="text-slate-300">
              Manage your song lists and keep your collection organized.
            </p>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3">
            <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Lists
              </p>
              <p className="text-xl font-semibold">
                {lists.length.toString().padStart(2, "0")}
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-slate-200">
              <p className="text-xs uppercase tracking-wide text-slate-400">
                Songs
              </p>
              <p className="text-xl font-semibold opacity-60">--</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <div
          className={
            showCreate
              ? "grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-8"
              : "grid grid-cols-1 gap-8"
          }>
          {/* LEFT COLUMN: Your lists */}
          <section className="bg-black/40 rounded-2xl border border-white/10 p-6 shadow-lg shadow-[#FA8128]/10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl md:text-3xl font-maven font-semibold text-white">
                Your Created <span className="text-[#FA8128]">Lists</span>
              </h2>

              <div className="flex items-center gap-3">
                {listsLoading && (
                  <span className="text-xs text-slate-400 animate-pulse">
                    Loading...
                  </span>
                )}

                {/* Button to toggle create panel */}
                <button
                  type="button"
                  onClick={() => setShowCreate((prev) => !prev)}
                  className="flex items-center justify-center h-9 w-9 rounded-full border border-white/20 bg-black/60 text-white hover:border-[#FA8128] hover:bg-black transition">
                  <span className="text-2xl leading-none text-[#FA8128]">
                    {showCreate ? "−" : "+"}
                  </span>
                </button>
              </div>
            </div>

            {listsError && (
              <p className="mb-3 text-sm text-red-400 bg-red-950/40 border border-red-500/20 py-2 px-3 rounded-lg">
                {listsError}
              </p>
            )}

            {/* Empty state */}
            {lists.length > 0 && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lists.map((list, index) => {
                  const createdAt =
                    list.createdAt?.seconds != null
                      ? new Date(list.createdAt.seconds * 1000)
                      : null;

                  return (
                    <button
                      key={list.id}
                      onClick={() => router.push(`/page-lists/${list.slug}`)}
                      className="relative overflow-hidden group w-full rounded-2xl bg-gradient-to-br from-[#FA8128]/25 via-black to-[#111827] border border-white/10 p-5 text-left shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-[#FA8128]/70 transition">
                      {/* Vinyl-ish accent circle */}
                      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full border border-[#FA8128]/40 bg-[#FA8128]/10 opacity-40 group-hover:rotate-12 group-hover:opacity-70 transition" />

                      <div className="relative flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="text-[10px] uppercase tracking-[0.15em] text-slate-400 mb-1">
                            List {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="text-lg font-semibold text-white line-clamp-1">
                            {list.name}
                          </h3>
                          {list.description && (
                            <p className="mt-1 text-sm text-slate-200/90 line-clamp-2">
                              {list.description}
                            </p>
                          )}
                        </div>

                        <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-semibold text-slate-200 group-hover:bg-[#FA8128] group-hover:text-black group-hover:border-transparent transition">
                          View
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* RIGHT COLUMN: Create new list (only when showCreate === true) */}
          {showCreate && (
            <section className="bg-black/60 rounded-2xl border border-[#FA8128]/40 p-6 shadow-xl shadow-[#FA8128]/30">
              <h2 className="text-xl md:text-2xl font-semibold text-white mb-2">
                Create a new list
              </h2>
              <p className="text-sm text-slate-300 mb-4">
                Organize your songs into personalized lists like{" "}
                <span className="text-[#FA8128]">“Sea Chanties to Cure Scurvy”</span>,{" "}
                <span className="text-[#FA8128]">“Metalcore 2025”</span>, or{" "}
                <span className="text-[#FA8128]">“Best of Punk”</span>.
              </p>

              <form onSubmit={handleCreateList} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-200">
                    List name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128]"
                    placeholder="e.g. All-Time Favorites"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-200">
                    Description{" "}
                    <span className="text-slate-500">(optional)</span>
                  </label>
                  <textarea
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128] resize-none"
                    rows={3}
                    placeholder="What is this list for?"
                    value={newListDescription}
                    onChange={(e) => setNewListDescription(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingList || !newListName.trim()}
                  className="w-full py-2.5 rounded-lg font-semibold bg-[#FA8128] hover:bg-[#ff9b47] text-black shadow-lg shadow-[#FA8128]/40 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
                  {creatingList ? "Creating..." : "Create list"}
                </button>
              </form>

              <p className="mt-3 text-xs text-slate-500">
                You can add songs to your lists from the search section later.
              </p>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
