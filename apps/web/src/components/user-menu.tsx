"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBrowserClient } from "@/lib/supabase/browser";

/**
 * Link "Accedi" / "Il mio account" nell'intestazione. Gira nel browser così le
 * pagine pubbliche restano statiche (leggere i cookie lato server le renderebbe dinamiche).
 */
export function UserMenu({ live }: { live: boolean }) {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!live) return;
    const supabase = getBrowserClient();
    supabase.auth.getUser().then(({ data }) => setEmail(data.user?.email ?? null));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setEmail(session?.user.email ?? null));
    return () => data.subscription.unsubscribe();
  }, [live]);

  if (email) {
    return (
      <>
        <Link href="/area-operatore" className="hidden rounded-full px-3 py-2 hover:bg-sand-100 md:inline">Area operatore</Link>
        <Link href="/account" className="rounded-full border border-sage-300 px-4 py-2 text-sage-700 hover:bg-sage-100">Il mio account</Link>
      </>
    );
  }
  return (
    <Link href="/accedi" className="rounded-full border border-sage-300 px-4 py-2 text-sage-700 hover:bg-sage-100">
      Accedi
    </Link>
  );
}
