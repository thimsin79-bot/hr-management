import { createClient } from "@supabase/supabase-js";

// Trim and strip BOMs so a stray "\uFEFF" or whitespace in the env value
// (e.g. from pasting an env var) can't produce an invalid client.
const clean = (v: string | undefined) => (v || "").replace(/^\uFEFF/, "").trim();

const url = clean(process.env.NEXT_PUBLIC_SUPABASE_URL);
const anonKey = clean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = isSupabaseConfigured ? createClient(url, anonKey) : null;
