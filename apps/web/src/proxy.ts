// Proxy (ex middleware): rinnova la sessione Supabase a ogni richiesta, così i
// Server Component trovano sempre un token valido nei cookie.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isLive, SUPABASE_KEY, SUPABASE_URL } from "./lib/env";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  if (!isLive) return response;

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_KEY, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

export const config = {
  // solo le pagine che usano la sessione: il catalogo pubblico resta statico e veloce
  matcher: ["/account/:path*", "/area-operatore/:path*", "/accedi", "/auth/:path*", "/operatori/:path*"],
};
