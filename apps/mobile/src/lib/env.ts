// Le variabili EXPO_PUBLIC_* vengono incorporate nell'app al momento della build.
export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_KEY = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "";
export const isLive = Boolean(SUPABASE_URL && SUPABASE_KEY);
