"use client";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function AuthWidget() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  async function handleSignIn() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
    });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setSent(true);
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    setUser(null);
  }

  if (user) {
    return (
      <div className="flex items-center gap-3 text-sm">
        <span className="text-slate-500">{user.email}</span>
        <button onClick={handleSignOut} className="text-brand-600 hover:text-brand-700 font-medium">
          Sign out
        </button>
      </div>
    );
  }

  if (sent) {
    return (
      <p className="text-sm text-slate-500">
        Check <span className="font-medium">{email}</span> for a magic sign-in link.
      </p>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field text-sm py-1.5 w-48"
      />
      <button
        onClick={handleSignIn}
        disabled={loading || !email}
        className="btn-secondary text-sm py-1.5"
      >
        {loading ? "Sending…" : "Sign in"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
