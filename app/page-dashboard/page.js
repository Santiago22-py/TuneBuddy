"use client"

import { useUserAuth } from "../contexts/AuthContext";
import Navbar from "../components/navbar";
import Footer from "../components/footer";


export default function DashboardPage() {

    const { user } = useUserAuth();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#0d0d0d]">
      <Navbar />
      {/* Main content*/}
      <main className="flex-1 flex items-center justify-center px-6">
        <h1 className="text-4xl font-maven font-bold text-white">
          Welcome to your Dashboard <span className="text-[#FA8128]">{user.displayName}</span>!
        </h1>
      </main>
      <Footer />
    </div>
  );
}