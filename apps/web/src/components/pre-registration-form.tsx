"use client";

import { useState } from "react";
import { rootCategories } from "@/lib/catalog";

/** Pre-registrazione operatori (prototipo: i dati non vengono inviati). */
export function PreRegistrationForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="rounded-2xl bg-white p-6 text-ink" role="status">
        <p className="font-serif text-2xl text-sage-900">Grazie! 🌿</p>
        <p className="mt-2 text-muted">Ti contatteremo per l&apos;onboarding. (Prototipo: nessun dato è stato inviato.)</p>
      </div>
    );
  }

  const field = "mt-1 w-full rounded-xl border border-sand-200 bg-sand-50 px-3 py-2 text-ink";
  return (
    <form
      className="space-y-3 rounded-2xl bg-white p-6 text-ink"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      <label className="block text-sm font-medium">
        Nome e cognome o struttura
        <input required name="name" className={field} autoComplete="name" />
      </label>
      <label className="block text-sm font-medium">
        Email
        <input required type="email" name="email" className={field} autoComplete="email" />
      </label>
      <label className="block text-sm font-medium">
        Città
        <input required name="city" className={field} autoComplete="address-level2" />
      </label>
      <label className="block text-sm font-medium">
        Disciplina principale
        <select name="category" className={field}>
          {rootCategories().map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="flex items-start gap-2 text-xs text-muted">
        <input required type="checkbox" className="mt-0.5" />
        Ho letto l&apos;informativa privacy e acconsento a essere ricontattato per il programma Fondatori.
      </label>
      <button className="w-full rounded-xl bg-terra-500 py-3 font-medium text-white hover:bg-terra-600">Mi candido</button>
    </form>
  );
}
