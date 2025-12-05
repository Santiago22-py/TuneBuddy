"use client";

import { useState } from "react";
import { useUserAuth } from "../contexts/AuthContext.js";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Footer from "../components/footer";

export default function SignUpPage() {
  const router = useRouter();
  const { emailSignUp } = useUserAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await emailSignUp(email, password, username);
      router.push("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Email is already in use.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email address.");
      } else {
        setError(err.message);
      }
      console.error("Sign up error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#0d0d0d]">
      {/* Main content*/}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-maven font-bold mb-6 text-center text-[#FA8128]">
            Create an account
          </h1>

          {/* Dog vibing picture */}
          <div className="w-32 h-32 mx-auto mb-6 border-2 border-black rounded-full overflow-hidden border-2 border-black shadow-[0_0_30px_rgba(250,129,40,0.7)]"> {/* Added glowing border */}
            <Image
              src="/assets/image/dog-headphones.jpg"
              alt="Dog with headphones"
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* USERNAME */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 bg-black/50 border border-white/30 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA8128] transition"
                placeholder="MyCoolUsername"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block mb-1 font-medium text-white">Email</label>
              <input
                type="email"
                className="w-full p-3 bg-black/50 border border-white/30 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA8128] transition"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block mb-1 font-medium text-white">
                Password
              </label>
              <input
                type="password"
                className="w-full p-3 bg-black/50 border border-white/30 text-white placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FA8128] transition"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="text-red-400 text-sm text-center bg-red-950/40 border border-red-500/20 py-2 px-3 rounded-lg">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold bg-[#FA8128] hover:bg-[#ff9b47] text-black shadow-lg shadow-[#FA8128]/40 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-white mt-4 text-sm">
            Already have an account?
            <a href="/page-login" className="text-[#FA8128] font-semibold ml-1">
              Log in
            </a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
