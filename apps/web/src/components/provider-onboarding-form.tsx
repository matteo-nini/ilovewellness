"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProviderDraft } from "@ilovewellness/core";
import { getBrowserClient } from "@/lib/supabase/browser";
import { buttonClass, Notice } from "./ui";

/** Primo passo dell'onboarding: crea il profilo operatore in bozza. */
export function ProviderOnboardingForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(form: FormData) {
    setBusy(true);
    setError(null);
    try {
      await createProviderDraft(getBrowserClient(), {
        kind: form.get("kind") === "venue" ? "venue" : "individual",
        displayName: String(form.get("displayName")),
        headline: String(form.get("headline")),
        bio: String(form.get("bio")),
        contactEmail: String(form.get("contactEmail") ?? ""),
      });
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form action={onSubmit} className="space-y-3 rounded-2xl border border-sand-200 bg-white p-6">
      <fieldset className="flex gap-4 text-sm">
        <legend className="mb-1 font-medium">Sei…</legend>
        <label className="flex items-center gap-2"><input type="radio" name="kind" value="individual" defaultChecked /> Professionista</label>
        <label className="flex items-center gap-2"><input type="radio" name="kind" value="venue" /> Struttura / centro</label>
      </fieldset>
      <label className="block text-sm font-medium">
        Nome pubblico
        <input name="displayName" required maxLength={80} className={buttonClass.field} placeholder="Es. Giulia Neri Shiatsu" />
      </label>
      <label className="block text-sm font-medium">
        Frase di presentazione
        <input name="headline" required maxLength={120} className={buttonClass.field} placeholder="Es. Operatrice shiatsu, 10 anni di esperienza" />
      </label>
      <label className="block text-sm font-medium">
        Chi sei e come lavori
        <textarea name="bio" required rows={4} maxLength={2000} className={buttonClass.field} />
      </label>
      <label className="block text-sm font-medium">
        Email di contatto
        <input name="contactEmail" type="email" className={buttonClass.field} />
      </label>
      <p className="text-xs text-muted">Niente promesse di cura o diagnosi: il benessere non sostituisce il medico.</p>
      {error && <Notice tone="error">{error}</Notice>}
      <button disabled={busy} className={`${buttonClass.primary} w-full`}>{busy ? "Salvataggio…" : "Crea profilo"}</button>
    </form>
  );
}
