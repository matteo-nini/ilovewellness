"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserClient } from "@/lib/supabase/browser";
import { buttonClass, Notice } from "./ui";

/** Accesso e registrazione con email e password (Supabase Auth). */
export function AuthForm({ next }: { next: string }) {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "error" | "success"; text: string } | null>(null);

  async function onSubmit(form: FormData) {
    const email = String(form.get("email"));
    const password = String(form.get("password"));
    const supabase = getBrowserClient();
    setBusy(true);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setMessage({ tone: "error", text: "Email o password non corretti." });
      router.push(next);
      router.refresh();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: String(form.get("full_name")) },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      setBusy(false);
      if (error) return setMessage({ tone: "error", text: error.message });
      if (data.session) {
        // conferma email disattivata nel progetto: utente già dentro
        router.push(next);
        router.refresh();
      } else {
        setMessage({ tone: "success", text: "Ti abbiamo inviato un'email: clicca il link per confermare l'account." });
      }
    }
  }

  return (
    <div className="rounded-2xl border border-sand-200 bg-white p-6">
      <div className="mb-5 grid grid-cols-2 rounded-xl bg-sand-100 p-1 text-sm" role="tablist">
        {(["login", "signup"] as const).map((m) => (
          <button
            key={m}
            role="tab"
            aria-selected={mode === m}
            onClick={() => { setMode(m); setMessage(null); }}
            className={`rounded-lg py-2 font-medium ${mode === m ? "bg-white shadow-sm" : "text-muted"}`}
          >
            {m === "login" ? "Accedi" : "Registrati"}
          </button>
        ))}
      </div>
      <form action={onSubmit} className="space-y-3">
        {mode === "signup" && (
          <label className="block text-sm font-medium">
            Nome e cognome
            <input name="full_name" required autoComplete="name" className={buttonClass.field} />
          </label>
        )}
        <label className="block text-sm font-medium">
          Email
          <input name="email" type="email" required autoComplete="email" className={buttonClass.field} />
        </label>
        <label className="block text-sm font-medium">
          Password
          <input
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={buttonClass.field}
          />
        </label>
        {mode === "signup" && (
          <label className="flex items-start gap-2 text-xs text-muted">
            <input type="checkbox" required className="mt-0.5" />
            Accetto i Termini e l&apos;Informativa privacy (bozza in preparazione).
          </label>
        )}
        {message && <Notice tone={message.tone}>{message.text}</Notice>}
        <button disabled={busy} className={`${buttonClass.primary} w-full`}>
          {busy ? "Attendi…" : mode === "login" ? "Accedi" : "Crea account"}
        </button>
      </form>
    </div>
  );
}
