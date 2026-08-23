import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client, used in client components for auth state
 * (sign in / sign out / session) and any direct client-side reads that are
 * safe under Row Level Security.
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
