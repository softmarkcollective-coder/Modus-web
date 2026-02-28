"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.replace("#", ""));

    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");

    if (access_token && refresh_token) {
      supabase.auth
        .setSession({
          access_token,
          refresh_token,
        })
        .then(() => {
          setReady(true);
        });
    } else {
      setError("Invalid or expired reset link.");
    }
  }, []);

  const handleUpdate = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage("Password updated successfully. You can now return to the app.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-950 to-black text-white px-6 pt-16 pb-16">
      <div className="w-full max-w-md mx-auto text-center space-y-10">

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">
            Modus
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold">
            Set new password
          </h1>
        </div>

        {!ready && !error && (
          <div className="p-6 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl text-neutral-400 text-sm">
            Verifying reset link...
          </div>
        )}

        {ready && (
          <div className="space-y-6 p-8 bg-neutral-900/70 backdrop-blur-xl border border-neutral-800 rounded-3xl">

            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800
                         focus:outline-none focus:ring-2 focus:ring-[#d6b25e]
                         text-white text-lg text-center"
            />

            <button
              onClick={handleUpdate}
              disabled={loading || !password}
              className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all
                ${
                  loading || !password
                    ? "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                    : "text-black bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] shadow-[0_10px_30px_rgba(214,178,94,0.35)] hover:scale-[1.02] active:scale-95"
                }`}
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </div>
        )}

        {message && (
          <div className="p-6 bg-neutral-900 rounded-3xl border border-neutral-800 text-sm">
            <p className="bg-gradient-to-r from-[#f0d78c] via-[#d6b25e] to-[#b8932f] bg-clip-text text-transparent font-semibold">
              {message}
            </p>
          </div>
        )}

        {error && (
          <div className="p-6 bg-neutral-900 rounded-3xl border border-red-900 text-red-400 text-sm">
            {error}
          </div>
        )}

      </div>
    </div>
  );
}