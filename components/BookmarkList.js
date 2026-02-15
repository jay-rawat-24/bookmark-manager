"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function BookmarkList({ user }) {
  const [bookmarks, setBookmarks] = useState([]);

  // ✅ delete function
  const deleteBookmark = async (id) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const { data } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setBookmarks(data || []);
    };

    load();

    const channel = supabase
      .channel("bookmarks-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bookmarks" },
        (payload) => {
          const newItem = payload.new;
          if (newItem.user_id !== user.id) return;

          setBookmarks((prev) => [newItem, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "bookmarks" },
        (payload) => {
          const deletedId = payload.old.id;
          setBookmarks((prev) =>
            prev.filter((b) => b.id !== deletedId)
          );
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  return (
    <ul className="space-y-2">
      {bookmarks.map((b) => (
        <li
          key={b.id}
          className="bg-white p-3 rounded shadow flex justify-between"
        >
          <a href={b.url} target="_blank" className="text-blue-600">
            {b.title}
          </a>

          <button
            onClick={() => deleteBookmark(b.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
