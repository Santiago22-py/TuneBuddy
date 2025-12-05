"use client";

import { useUserAuth } from "../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function DashboardPage() {
  const { user, firebaseSignOut } = useUserAuth();
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await firebaseSignOut();
      router.push("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#0d0d0d]">
      <Navbar />
      {/* Main content*/}
      <main className="flex-1 flex items-center justify-center px-6">
        <h1 className="text-4xl font-maven font-bold text-white">
          Welcome to your Dashboard{" "}
          <span className="text-[#FA8128]">{user?.displayName}</span>!
        </h1>
        <button onClick={handleLogout}>Log Out</button>
      </main>
      <Footer />
    </div>
  );
}
