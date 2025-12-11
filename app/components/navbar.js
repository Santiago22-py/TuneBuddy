"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, loading, firebaseSignOut } = useUserAuth();
  const router = useRouter();

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
              href="/page-dashboard"
              className="hover:text-[#FA8128] transition">
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/" className="hover:text-[#FA8128] transition">
              Home
            </Link>
          </li>

          <li>
            <button
              onClick={async () => {
                router.push("/page-profile");
              }}
              className="hover:text-[#FA8128] transition">
              Profile
            </button>
          </li>

          <li>
            <button
              onClick={async () => {
                await firebaseSignOut();
                router.push("/");
              }}
              className="hover:text-[#FA8128] transition">
              Log Out
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
