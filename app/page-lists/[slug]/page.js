"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "../../contexts/AuthContext";
import { getListBySlug } from "../../services/list-service";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";

export default function ListPage({ params }) {
  const { slug } = use(params); //Get slug from URL params (using use() to unwrap promise)

  const router = useRouter();
  const { user, loading } = useUserAuth();

  const [list, setList] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/page-login");
    }
  }, [loading, user, router]);

  // Load list data
  useEffect(() => {
    if (!user || !slug) return; //If user or slug not available yet, do nothing

    //Function to load the list
    const load = async () => {
      try {
        setLoadingList(true);
        const data = await getListBySlug(user.uid, slug);

        if (!data) {
          setError("List not found");
        } else {
          setList(data);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load list");
      } finally {
        setLoadingList(false);
      }
    };

    load();
  }, [user, slug]);

  // If loading, show a loading message
  if (loading || loadingList) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading list...
      </div>
    );
  }

  // If error occurred, show error message
  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-red-400">
        {error}
      </div>
    );
  }

  //Otwise, show the list details
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-10 text-white">
        <h1 className="text-4xl font-maven font-bold mb-2">{list.name}</h1>

        <p className="text-lg text-slate-300 mb-6">{list.description}</p>
      </main>

      <Footer />
    </div>
  );
}
