"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "firebase/auth";

// Import custom hooks and services
import { useUserAuth } from "../contexts/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import {
  getUserProfile,
  updateUserProfile,
  uploadUserAvatar,
} from "../services/profile-service";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useUserAuth();

  ////////////////////////////////////////////////
  //                                            //
  //             STATES                         //
  //                                            //
  ////////////////////////////////////////////////

  //Profile states
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState(null);

  const [displayName, setDisplayName] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  //Local avatar file state
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [saveFeedback, setSaveFeedback] = useState("");

  ////////////////////////////////////////////////
  //                                            //
  //             EFFECTS                        //
  //                                            //
  ////////////////////////////////////////////////

  //If user is not logged in, redirect to home
  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user, router]);

  //Load user profile when user is available
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user) return; //Wait for user to be available

      try {
        setProfileLoading(true);
        setProfileError(null);

        //Fetch profile from Firestore
        const profile = await getUserProfile(user.uid);

        //if user has no displayName, create a default one (This might happened because of profiles created before I added the profile service)
        setDisplayName(
          profile.username && profile.username.trim().length > 0
            ? user.displayName
            : profile.username || ""
        );

        setAboutMe(profile.aboutMe || "");
        setAvatarUrl(profile.avatarUrl || "");
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfileError("Failed to load profile. Please try again.");
      } finally {
        setProfileLoading(false);
      }
    };

    loadUserProfile();
  }, [user]);

  ////////////////////////////////////////////////
  //                                            //
  //             FUNCTIONS                      //
  //                                            //
  ////////////////////////////////////////////////

  //Handle avatat change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return; //No file selected

    setAvatarFile(file);

    //create a preview URL (local URL)
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
  };

  //Handle submit profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return; //User must be logged in

    try {
      setSaving(true);

      let newAvatarUrl = avatarUrl;

      //If a new avatar file is selected, upload it
      if (avatarFile) {
        newAvatarUrl = await uploadUserAvatar(user.uid, avatarFile);
        setAvatarUrl(newAvatarUrl);
      }

      //Update profile in Firestore
      await updateUserProfile(user.uid, {
        displayName: displayName.trim(),
        aboutMe: aboutMe.trim(),
        avatarUrl: newAvatarUrl,
      });

      // Update firebase auth profile display name
      if (user.displayName !== displayName.trim()) {
        try {
          await updateProfile(user, {
            displayName: displayName.trim(),
          });
        } catch (error) {
          console.error("Error updating Firebase Auth profile:", error);
        }
      }
      setSaveFeedback("Profile saved successfully!");
      setAvatarFile(null); //Clear selected file
      setAvatarPreview(""); //Clear preview
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveFeedback("Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
      //Clear feedback after 3 seconds
      setTimeout(() => setSaveFeedback(""), 3000);
    }
  };

  ////////////////////////////////////////////////
  //                                            //
  //              PAGE RENDER                   //
  //                                            //
  ////////////////////////////////////////////////

  //If loading, show loading message
  // If page is still loading auth state, show loading message
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  // If user is not logged in, show message
  if (!user) {
    return null; //Redirecting, so render nothing
  }

  const userDisplayName = user.displayName || "music fan";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-[#050509] to-black">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 text-white">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-maven font-bold mb-2">
            Your <span className="text-[#FA8128]">Profile</span>
          </h1>
          <p className="text-slate-300">
            Customize how you look and what people know about you on Tune Buddy.
          </p>
        </header>

        {profileLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-300">
            Loading your profile...
          </div>
        ) : (
          <section className="bg-black/50 rounded-2xl border border-white/10 p-6 shadow-lg shadow-[#FA8128]/10">
            {/* AVATAR + BASIC INFO */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div className="flex flex-col items-center sm:items-start gap-3">
                {/* Avatar circle */}
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-[#FA8128]/70 bg-gradient-to-br from-[#FA8128]/40 via-black to-black flex items-center justify-center text-3xl font-bold">
                    {avatarPreview || avatarUrl ? (
                      <img
                        src={avatarPreview || avatarUrl}
                        alt="Avatar preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="uppercase">
                        {userDisplayName.charAt(0)}
                      </span>
                    )}
                  </div>

                  {/* Hidden file input  */}
                  <input 
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-white/20 bg-black/70 text-xs font-semibold text-slate-100 hover:border-[#FA8128] hover:text-[#FA8128] cursor-pointer transition">
                  Change avatar
                </label>

                {avatarFile && (
                  <p className="text-[11px] text-slate-400">
                    New avatar selected:{" "}
                    <span className="text-slate-200">{avatarFile.name}</span>
                  </p>
                )}
              </div>

              {/* Username + Email */}
              <div className="flex-1">
                <div className="mb-3">
                  <label className="block mb-1 text-sm font-medium text-slate-200">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128]"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="block mb-1 text-sm font-medium text-slate-200">
                    Email <span className="text-slate-500">(read-only)</span>
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-3 py-2 rounded-lg bg-black/60 border border-white/10 text-slate-300 text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* ABOUT ME */}
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium text-slate-200">
                About me
              </label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-lg bg-black/70 border border-white/20 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FA8128] resize-none"
                placeholder="Share a little about your taste in music, favorite genres, or current obsessions..."
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>

            {/* Error / success messages */}
            {profileError && (
              <p className="mb-3 text-sm text-red-400 bg-red-950/40 border border-red-500/20 py-2 px-3 rounded-lg">
                {profileError}
              </p>
            )}

            {saveFeedback && (
              <p className="mb-3 text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-500/30 py-2 px-3 rounded-lg">
                {saveFeedback}
              </p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => {
                  // Reset avatar selection (but not profile fields)
                  setAvatarFile(null);
                  setAvatarPreview("");
                }}
                className="px-4 py-2 rounded-lg border border-white/20 text-sm text-slate-200 hover:bg-white/5 transition">
                Reset avatar selection
              </button>

              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-[#FA8128] text-black text-sm font-semibold shadow-lg shadow-[#FA8128]/40 hover:bg-[#ff9b47] transition disabled:opacity-60 disabled:cursor-not-allowed">
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
