import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import { demoSource, supabaseSource, type CatalogSource, type Database } from "@ilovewellness/core";
import { AppState, Platform } from "react-native";
import { isLive, SUPABASE_KEY, SUPABASE_URL } from "./env";

/**
 * Client Supabase per l'app. Sul telefono la sessione viene salvata in AsyncStorage
 * (l'equivalente mobile di localStorage), così l'utente resta connesso tra un avvio e l'altro.
 */
export const supabase = isLive
  ? createClient<Database>(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  : null;

// Su mobile il rinnovo del token va sospeso quando l'app è in background.
if (supabase && Platform.OS !== "web") {
  AppState.addEventListener("change", (state) => {
    if (state === "active") supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}

/** Stessa interfaccia del sito: dati reali se Supabase è configurato, altrimenti demo. */
export const catalog: CatalogSource = supabase ? supabaseSource(supabase) : demoSource;
