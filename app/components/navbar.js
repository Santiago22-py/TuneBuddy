"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../contexts/AuthContext";

//custom services
import { getUserProfile } from "../services/profile-service";

export default function Navbar() {
  const { user, loading, firebaseSignOut } = useUserAuth();
  const router = useRouter();

  // State for user profile
  const [avatarPreview, setAvatarPreview] = useState(null);
  //State for showing profile and logout options
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  //Fetch user profile when user logs in
  useEffect(() => {
    async function fetchUserProfile() {
      if (user) {
        const profile = await getUserProfile(user.uid);
        setAvatarPreview(profile.avatarUrl || null);
      }
    }
    fetchUserProfile();
  }, [user]);

  //If user is not logged in
  if (!user) {
    return (
      <nav className="bg-black p-4 mt-2 mb-2 border-b border-white/10">
        <div className="w-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <Image
              src="/assets/svg/logo-text-white.svg"
              alt="Tune Buddy Logo"
              width={150}
              height={40}
            />
          </Link>

          {/* RIGHT SIDE NAV OPTIONS */}
          <ul className="flex space-x-6 text-white font-medium">
            <li>
              <Link
                href="/page-login"
                className="hover:text-[#FA8128] transition">
                Log In
              </Link>
            </li>
            <p>or</p>
            <li>
              <Link
                href="/page-signup"
                className="hover:text-[#FA8128] transition">
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }

  //If profile is still loading, show loading text
  if (loading) {
    return (
      <nav className="bg-black p-4 mt-2 mb-2 border-b border-white/10">
        <div className="w-full flex items-center justify-between px-6">
          {/* Logo */}
          <Link href="/" className="text-xl font-bold">
            <Image
              src="/assets/svg/logo-text-white.svg"
              alt="Tune Buddy Logo"
              width={150}
              height={40}
            />
          </Link>

          {/* RIGHT SIDE LOADING TEXT */}
          <div className="text-white font-medium">Loading...</div>
        </div>
      </nav>
    );
  }

  //If user has no avatar, use first letter of display name or email
  const initial = (user.displayName || user.email || "?")
    .charAt(0)
    .toUpperCase();

  return (
    <nav className="bg-black p-4 mt-2 mb-2 border-b border-white/10">
      <div className="w-full flex items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold">
          <Image
            src="/assets/svg/logo-text-white.svg"
            alt="Tune Buddy Logo"
            width={150}
            height={40}
          />
        </Link>

        {/* RIGHT SIDE NAV OPTIONS */}
        <ul className="flex items-center space-x-6 text-white font-medium">
          <li>
            <Link href="/" className="hover:text-[#FA8128] transition">
              Home
            </Link>
          </li>

          <li>
            <Link
              href="/page-dashboard"
              className="hover:text-[#FA8128] transition">
              Dashboard
            </Link>
          </li>

          {/* Avatar + click menu */}
          <li className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="h-9 w-9 rounded-full overflow-hidden border border-white/30 bg-gradient-to-br from-[#FA8128]/40 via-black to-black flex items-center justify-center text-xs font-semibold shadow-lg shadow-black/40 hover:border-[#FA8128] transition">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="User avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="uppercase">{initial}</span>
              )}
            </button>

            {/* Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-40 rounded-xl bg-black/95 border border-white/10 shadow-xl shadow-black/60 transition origin-top-right ${
                showProfileMenu
                  ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                  : "opacity-0 scale-95 translate-y-1 pointer-events-none"
              }`}>
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  router.push("/page-profile");
                }}
                className="w-full text-left px-4 py-2 text-sm text-slate-100 hover:bg-white/5 rounded-t-xl">
                Profile
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowProfileMenu(false);
                  await firebaseSignOut();
                  router.push("/");
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-600/20 rounded-b-xl">
                Log out
              </button>
            </div>
          </li>
        </ul>
      </div>
    </nav>
  );
}
