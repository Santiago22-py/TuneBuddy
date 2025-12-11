"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/AuthContext.js";
import { useRouter } from "next/navigation";
import Image from "next/image";

import Navbar from "../components/navbar.js";
import Footer from "../components/footer";

export default function SignUpPage() {
  const router = useRouter();
  const { user, emailSignUp, loading, googleSignIn, githubSignIn } = useUserAuth();

  ////////////////////////////////////////////////
  //                                            //
  //             STATES                         //
  //                                            //
  ////////////////////////////////////////////////

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);

  ////////////////////////////////////////////////
  //                                            //
  //              USE EFFECTS                   //
  //                                            //
  ////////////////////////////////////////////////

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!loading && user) {
      router.push("/page-dashboard");
    }
  }, [loading, user, router]);

  ////////////////////////////////////////////////
  //                                            //
  //             FUNCTIONS                      //
  //                                            //
  ////////////////////////////////////////////////

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await emailSignUp(email, password, username);
      router.push("/page-dashboard");
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

    setSubmitting(false);
  };

  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setError(null);
    setSignUpLoading(true);

    try {
      await googleSignIn();
      router.push("/page-dashboard");
    } catch (err) {
      setError(err.message);
      console.error("Google sign-in error:", err);
    }

    setSignUpLoading(false);
  };

  // Handle GitHub sign in
  const handleGithubSignIn = async () => {
    setError(null);
    setSignUpLoading(true);

    try {
      await githubSignIn();
      router.push("/page-dashboard");
    } catch (err) {
      setError(err.message);
      console.error("GitHub sign-in error:", err);
    }
    setSignUpLoading(false);
  };

  //If still loading, display loading message
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#0d0d0d]">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md">
          <h1 className="text-4xl font-maven font-bold mb-6 text-center text-[#FA8128]">
            Create an account
          </h1>

          <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-black shadow-[0_0_30px_rgba(250,129,40,0.7)]">
            <Image
              src="/assets/image/dog-headphones.jpg"
              alt="Dog with headphones"
              width={256}
              height={256}
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
              disabled={submitting}
              className="w-full py-3 rounded-lg font-bold bg-[#FA8128] hover:bg-[#ff9b47] text-black shadow-lg shadow-[#FA8128]/40 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Or continue with
              </span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Google button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-black/60 text-sm text-slate-100 hover:border-[#FA8128] hover:bg-black/80 transition disabled:opacity-60 disabled:cursor-not-allowed">
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.037 21.998a10.313 10.313 0 0 1-7.168-3.049 9.888 9.888 0 0 1-2.868-7.118 9.947 9.947 0 0 1 3.064-6.949A10.37 10.37 0 0 1 12.212 2h.176a9.935 9.935 0 0 1 6.614 2.564L16.457 6.88a6.187 6.187 0 0 0-4.131-1.566 6.9 6.9 0 0 0-4.794 1.913 6.618 6.618 0 0 0-2.045 4.657 6.608 6.608 0 0 0 1.882 4.723 6.891 6.891 0 0 0 4.725 2.07h.143c1.41.072 2.8-.354 3.917-1.2a5.77 5.77 0 0 0 2.172-3.41l.043-.117H12.22v-3.41h9.678c.075.617.109 1.238.1 1.859-.099 5.741-4.017 9.6-9.746 9.6l-.215-.002Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Google</span>
              </button>

              {/* GitHub button */}
              <button
                type="button"
                onClick={handleGithubSignIn}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-white/20 bg-black/60 text-sm text-slate-100 hover:border-[#FA8128] hover:bg-black/80 transition disabled:opacity-60 disabled:cursor-not-allowed">
                <svg
                  className="w-5 h-5 text-white"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>GitHub</span>
              </button>
            </div>
          </div>

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
