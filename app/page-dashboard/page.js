"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";

// Components
import Navbar from "../components/navbar";
import Footer from "../components/footer";

// Services
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from "../services/list-service.js";
import { getUserProfile } from "../services/profile-service";
import { getUserStats } from "../services/stats-service.js";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUserAuth();

  ////////////////////////////////////////////////
  //                                            //
  //              STATES                        //
  //                                            //
  ////////////////////////////////////////////////

  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);

  // List helper states
  const [lists, setLists] = useState([]);
  const [listsLoading, setListsLoading] = useState(true);
  const [listsError, setListsError] = useState(null);

  //Stats helper states
  const [stats, setStats] = useState({
    totalSongs: 0,
    topArtists: [],
    topAlbums: [],
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // New list helper states
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [creatingList, setCreatingList] = useState(false);

  // Control showing/hiding create list panel
  const [showCreate, setShowCreate] = useState(false);

  // Edit list modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingList, setEditingList] = useState(null);
  const [editListName, setEditListName] = useState("");
  const [editListDescription, setEditListDescription] = useState("");
  const [updatingList, setUpdatingList] = useState(false);

  ////////////////////////////////////////////////
  //                                            //
  //              USE EFFECTS                   //
  //                                            //
  ////////////////////////////////////////////////

  //If user is not logged in, redirect to login page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/page-login");
    }
  }, [loading, user, router]);

  // Load user's lists
  useEffect(() => {
    const loadLists = async () => {
      if (!user) return; //wait for user to be set

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

  // Load user's stats
  useEffect(() => {
    const loadStats = async () => {
      if (!user) return; //wait for user to be set (Not having this was causing a bug)

      try {
        setStatsLoading(true);
        setStatsError(null);
        const data = await getUserStats(user.uid);
        setStats(data);
      } catch (err) {
        console.error("Error loading stats:", err);
        setStatsError("Failed to load your statistics. Please try again.");
      } finally {
        setStatsLoading(false);
      }
    };

    loadStats();
  }, [user]);

  // Load user avatar preview
  useEffect(() => {
    const loadAvatarPreview = async () => {
      if (!user) return;
      try {
        const profile = await getUserProfile(user.uid);
        setAvatarPreview(profile.avatarUrl || null);
      } catch (err) {
        console.error("Error loading user profile for avatar:", err);
      }
    };
    loadAvatarPreview();
  }, [user]);

  ////////////////////////////////////////////////
  //                                            //
  //             FUNCTIONS                      //
  //                                            //
  ////////////////////////////////////////////////

  const handleCreateList = async (e) => {
    e.preventDefault();
    // Prevent creating list with empty name
    if (!newListName.trim()) return;

    try {
      setCreatingList(true);
      setListsError(null);

      const created = await createList(
        user.uid,
        newListName.trim(),
        newListDescription.trim()
      );

      // Update local lists state to include the new list
      setLists((prev) => [...prev, created]);

      setNewListName("");
      setNewListDescription("");
    } catch (err) {
      console.error("Error creating list:", err);
      setListsError("Failed to create list. Please try again.");
    } finally {
      setCreatingList(false);
    }
  };

  //Function to open edit modal
  const openEditModal = (list) => {
    setEditingList(list);
    setEditListName(list.name);
    setEditListDescription(list.description || "");
    setShowEditModal(true);
  };

  //Function to save edits to a list
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editListName.trim()) return;

    try {
      setUpdatingList(true);
      setListsError(null);

      const { slug } = await updateList(
        //updateList now returns the new slug
        user.uid,
        editingList.id,
        editListName.trim(),
        editListDescription.trim()
      );

      //Update local lists state
      setLists((prev) =>
        prev.map((list) =>
          list.id === editingList.id
            ? {
                ...list,
                name: editListName.trim(),
                description: editListDescription.trim(),
                slug, // Update slug in local state
              }
            : list
        )
      );

      setShowEditModal(false);
      setEditingList(null);
    } catch (err) {
      console.error("Error updating list:", err);
      setListsError("Failed to update list. Please try again.");
    } finally {
      setUpdatingList(false);
    }
  };

  //Function to delete a list (with confirmation)
  const handleDeleteList = async (list) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${list.name}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    try {
      setListsError(null);
      await deleteList(user.uid, list.id);

      //Update local lists state
      setLists((prev) => prev.filter((l) => l.id !== list.id));

      //refresh stats after deletion
      try {
        const data = await getUserStats(user.uid);
        setStats(data);
      } catch (err) {
        console.error("Error loading stats:", err);
      }
    } catch (err) {
      console.error("Error deleting list:", err);
      setListsError("Failed to delete list. Please try again.");
    }
  };

  ////////////////////////////////////////////////
  //                                            //
  //              PAGE RENDER                   //
  //                                            //
  ////////////////////////////////////////////////

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
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="h-40 w-40 rounded-full overflow-hidden border-2 border-[#FA8128]/70 bg-gradient-to-br from-[#FA8128]/40 via-black to-black flex items-center justify-center text-3xl font-bold shadow-lg shadow-[#FA8128]/20">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="uppercase">{username.charAt(0)}</span>
              )}
            </div>

            {/* Text */}
            <div>
              <h1 className="text-3xl md:text-4xl font-maven font-bold text-white mb-1">
                Welcome back, <span className="text-[#FA8128]">{username}</span>
              </h1>
              <p className="text-slate-300">
                Manage your song lists and keep your collection organized.
              </p>
            </div>
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
              <p className="text-xl font-semibold">
                {statsLoading
                  ? "…"
                  : stats.totalSongs.toString().padStart(2, "0")}
              </p>
            </div>
          </div>
        </header>

        {/* Main content */}
        {/* Top stats row */}
        <h2 className="mb-5 text-xl md:text-4xl font-maven font-semibold text-white text-center">
          Check out these sick <span className="text-[#FA8128]">Stats</span>!
        </h2>
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top artists */}
          <div className="bg-black/50 rounded-2xl border border-white/10 p-5 shadow-lg shadow-[#FA8128]/10">
            <h2 className="text-lg md:text-3xl font-maven font-semibold text-white mb-3">
              Top <span className="text-[#FA8128]">Artists</span>
            </h2>

            {statsLoading && (
              <p className="text-sm text-slate-400 animate-pulse">
                Loading your stats...
              </p>
            )}

            {statsError && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-500/30 px-3 py-2 rounded-lg">
                {statsError}
              </p>
            )}

            {!statsLoading && !statsError && stats.topArtists.length === 0 && (
              <p className="text-sm text-slate-500">
                Add a few songs to your lists to see your top artists here.
              </p>
            )}

            {!statsLoading && stats.topArtists.length > 0 && (
              <ul className="space-y-2">
                {stats.topArtists.map((artist, index) => (
                  <li
                    key={artist.name}
                    className="flex items-center justify-between rounded-lg bg-black/60 border border-white/10 px-3 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs w-6 h-6 flex items-center justify-center rounded-full bg-[#FA8128]/20 text-[#FA8128] font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-lg text-white">{artist.name}</span>
                    </div>
                    <span className="text-sm text-slate-300">
                      {artist.count} {artist.count === 1 ? "song" : "songs"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Top albums */}
          <div className="bg-black/50 rounded-2xl border border-white/10 p-5 shadow-lg shadow-[#FA8128]/10">
            <h2 className="text-lg md:text-3xl font-maven font-semibold text-white mb-3">
              Top <span className="text-[#FA8128]">Albums</span>
            </h2>

            {statsLoading && (
              <p className="text-sm text-slate-400 animate-pulse">
                Finding your favorite records...
              </p>
            )}

            {statsError && (
              <p className="text-sm text-red-400 bg-red-950/30 border border-red-500/30 px-3 py-2 rounded-lg">
                {statsError}
              </p>
            )}

            {!statsLoading && !statsError && stats.topAlbums.length === 0 && (
              <p className="text-sm text-slate-500">
                Add songs to your lists to see which albums you spin the most.
              </p>
            )}

            {!statsLoading && stats.topAlbums.length > 0 && (
              <ul className="space-y-2">
                {stats.topAlbums.map((album, index) => (
                  <li
                    key={`${album.album}-${album.artist}`}
                    className="flex items-center justify-between rounded-lg bg-black/60 border border-white/10 px-3 py-2">
                    <div className="flex flex-col">
                      <span className="text-sm text-white line-clamp-1">
                        {index + 1}. {album.album}
                      </span>
                      <span className="text-xs text-slate-400 line-clamp-1">
                        {album.artist}
                      </span>
                    </div>
                    <span className="text-sm text-slate-300">
                      {album.count} {album.count === 1 ? "song" : "songs"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div
          className={
            showCreate
              ? "grid grid-cols-1 lg:grid-cols-[1.6fr,1fr] gap-8"
              : "grid grid-cols-1 gap-8"
          }>
          {/* LEFT COLUMN: Your lists */}
          <section className="bg-black/40 rounded-2xl border border-white/10 p-6 shadow-lg shadow-[#FA8128]/10">
            <div className="flex items-center justify-between mb-4 ">
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
                    <div
                      key={list.id}
                      onClick={() => router.push(`/page-lists/${list.slug}`)}
                      className="relative overflow-hidden group w-full rounded-2xl bg-gradient-to-br from-[#FA8128]/25 via-black to-[#111827] border border-white/10 p-5 text-left shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-[#FA8128]/70 transition cursor-pointer">
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
                          {createdAt && (
                            <p className="mt-1 text-[10px] text-slate-500">
                              Created on{" "}
                              {createdAt.toLocaleDateString(undefined, {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                          )}
                        </div>

                        {/* Right side: View + icon buttons */}
                        <div className="flex flex-col items-end gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-black/60 border border-white/20 text-[10px] font-semibold text-slate-200 group-hover:bg-[#FA8128] group-hover:text-black group-hover:border-transparent transition">
                            View
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Edit icon button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // otherwise triggers navigation
                                openEditModal(list);
                              }}
                              className="flex items-center justify-center h-8 w-8 rounded-full border border-white/30 bg-black/70 text-white hover:border-[#FA8128] hover:bg-[#FA8128]/20 transition">
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none">
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M10.779 17.779 4.36 19.918 6.5 13.5m4.279 4.279 8.364-8.643a3.027 3.027 0 0 0-2.14-5.165 3.03 3.03 0 0 0-2.14.886L6.5 13.5m4.279 4.279L6.499 13.5m2.14 2.14 6.213-6.504M12.75 7.04 17 11.28"
                                />
                              </svg>
                            </button>

                            {/* Delete icon button */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation(); // otherwise triggers navigation
                                handleDeleteList(list);
                              }}
                              className="flex items-center justify-center h-8 w-8 rounded-full border border-red-500/40 bg-black/70 text-red-400 hover:bg-red-600/80 hover:border-red-400 transition">
                              <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none">
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
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
                <span className="text-[#FA8128]">
                  “Sea Chanties to Cure Scurvy”
                </span>
                , <span className="text-[#FA8128]">“Metalcore 2025”</span>, or{" "}
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

        {/* EDIT MODAL */}
        {showEditModal && editingList && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70">
            <div className="w-full max-w-md rounded-2xl bg-[#050509] border border-white/10 p-6 shadow-2xl shadow-black/60">
              <h3 className="text-xl font-maven font-semibold text-white mb-4">
                Edit list
              </h3>

              {listsError && (
                <p className="mb-3 text-sm text-red-400 bg-red-950/40 border border-red-500/20 py-2 px-3 rounded-lg">
                  {listsError}
                </p>
              )}

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-slate-200">
                    List name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128]"
                    value={editListName}
                    onChange={(e) => setEditListName(e.target.value)}
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
                    value={editListDescription}
                    onChange={(e) => setEditListDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingList(null);
                    }}
                    className="px-4 py-2 rounded-lg border border-white/20 text-sm text-slate-200 hover:bg-white/5 transition">
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={updatingList || !editListName.trim()}
                    className="px-5 py-2 rounded-lg bg-[#FA8128] text-black text-sm font-semibold shadow-lg shadow-[#FA8128]/40 hover:bg-[#ff9b47] transition disabled:opacity-60 disabled:cursor-not-allowed">
                    {updatingList ? "Saving..." : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
