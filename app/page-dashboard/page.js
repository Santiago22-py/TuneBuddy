"use client";

import { useState, useEffect } from "react";
import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUserAuth(); // make sure AuthContext returns loading

  
  // While auth status is being determined
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  // If user is not logged in, don't render the dashboard
  // Redirect them to login instead
  if (!user) {
    router.push("/page-login");
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-maven font-bold text-white mb-2">
            Welcome back, <span className="text-[#FA8128]">{user.displayName}</span>
          </h1>
        </header>
      </main>

      <Footer />
    </div>
  );
}
