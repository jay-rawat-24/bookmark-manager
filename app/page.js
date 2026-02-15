"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import LoginButton from "../components/LoginButton";
import BookmarkForm from "../components/BookmarkForm";
import BookmarkList from "../components/BookmarkList";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  if (!user)
    return (
      <div className="flex justify-center mt-20">
        <LoginButton />
      </div>
    );

  return (
    <main className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookmarks</h1>
      <BookmarkForm user={user} />
      <BookmarkList user={user} />
    </main>
  );
}
