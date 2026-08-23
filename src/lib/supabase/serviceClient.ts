import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for privileged server-only operations (e.g. writing
 * analyses on behalf of a user, or reading a shared_result for a public link
 * without requiring the viewer to be authenticated). Never import this into
 * client-side code -- the service role key bypasses Row Level Security.
 *
 * Deliberately kept in its own file with no dependency on next/headers, so
 * modules that only need the service client (like persistence.ts) never pull
 * next/headers or the cookies() API into their bundle graph.
 */
export function createSupabaseServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
