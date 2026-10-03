import "server-only";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@ilovewellness/core";
import { cookies } from "next/headers";
import { SUPABASE_KEY, SUPABASE_URL } from "../env";

/** Client con la sessione dell'utente (cookie): per pagine e azioni riservate. */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // chiamato da un Server Component: i cookie li aggiorna il proxy (src/proxy.ts)
        }
      },
    },
  });
}

/** Client anonimo per i dati pubblici del catalogo: non legge cookie, quindi le pagine restano cacheabili. */
export function createPublicClient() {
  return createClient<Database>(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false } });
}

/** Utente corrente, o null. `getUser()` verifica il token con Supabase (non si fida del cookie). */
export async function getCurrentUser() {
  const supabase = await createSessionClient();
  const { data } = await supabase.auth.getUser();
  return { supabase, user: data.user };
}
