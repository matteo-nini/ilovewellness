// Configurazione Supabase. Senza queste variabili l'app gira in "modalità demo"
// con i dati fittizi di @ilovewellness/core (nessun login, nessuna prenotazione reale).
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const isLive = Boolean(SUPABASE_URL && SUPABASE_KEY);
