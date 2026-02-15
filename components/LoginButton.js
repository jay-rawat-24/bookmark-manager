"use client";
import { supabase } from "../lib/supabase";

export default function LoginButton() {
  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <button
      onClick={login}
      className="bg-blue-600 text-white px-4 py-2 rounded"
    >
      Login with Google
    </button>
  );
}
