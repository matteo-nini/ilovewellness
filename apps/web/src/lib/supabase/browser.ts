"use client";
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@ilovewellness/core";
import { SUPABASE_KEY, SUPABASE_URL } from "../env";

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

/** Client Supabase nel browser (singleton): usa la sessione salvata nei cookie. */
export function getBrowserClient() {
  return (client ??= createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY));
}
