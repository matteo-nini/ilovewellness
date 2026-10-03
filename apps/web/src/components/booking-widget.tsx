"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createBooking, demoSource, formatDuration, formatPrice, modeLabel, policyLabel, romeToIso, supabaseSource,
  type BookingStatus, type DaySlots, type Provider,
} from "@ilovewellness/core";
import { getBrowserClient } from "@/lib/supabase/browser";

const dayFmt = new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const asUtcNoon = (d: string) => new Date(`${d}T12:00:00Z`);

type Step = "choose" | "review" | "sending" | "done";

export function BookingWidget({ provider, live }: { provider: Provider; live: boolean }) {
  const router = useRouter();
  const [serviceId, setServiceId] = useState(provider.services[0]?.id);
  const [loaded, setLoaded] = useState<{ serviceId: string; days: DaySlots[]; version: number } | null>(null);
  const [version, setVersion] = useState(0); // incrementato per ricaricare gli slot dopo una prenotazione
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [step, setStep] = useState<Step>("choose");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookingStatus | null>(null);

  const service = provider.services.find((s) => s.id === serviceId);

  // Carica gli slot: con Supabase dalla RPC `available_slots` (tiene conto delle
  // prenotazioni esistenti), in demo dagli orari settimanali.
  useEffect(() => {
    if (!service) return;
    let cancelled = false;
    const source = live ? supabaseSource(getBrowserClient()) : demoSource;
    source
      .availableSlots(provider, service)
      .then((days) => !cancelled && setLoaded({ serviceId: service.id, days, version }))
      .catch(() => !cancelled && setLoaded({ serviceId: service.id, days: [], version }));
    return () => {
      cancelled = true;
    };
  }, [live, provider, service, version]);

  if (!service) return null;
  const loading = !loaded || loaded.serviceId !== service.id || loaded.version !== version;
  const days = loading ? [] : loaded.days;
  const selectedDay = days.find((d) => d.date === day && d.slots.length) ?? days.find((d) => d.slots.length);

  async function confirm() {
    if (!selectedDay || !slot || !service) return;
    setError(null);
    if (!live) {
      setResult(provider.instantBooking ? "confirmed" : "pending");
      setStep("done");
      return;
    }
    const supabase = getBrowserClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      router.push(`/accedi?next=${encodeURIComponent(`/operatori/${provider.slug}`)}`);
      return;
    }
    setStep("sending");
    try {
      const booking = await createBooking(supabase, {
        userId: data.user.id,
        providerId: provider.id!,
        serviceId: service.id,
        startsAt: romeToIso(selectedDay.date, slot),
        note,
      });
      setResult(booking.status);
      setStep("done");
      setVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto");
      setStep("review");
      setVersion((v) => v + 1);
    }
  }

  if (step === "done" && selectedDay && slot) {
    const confirmed = result === "confirmed";
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-100 p-6" role="status">
        <p className="font-serif text-xl text-sage-900">{confirmed ? "Prenotazione confermata 🎉" : "Richiesta inviata ✉️"}</p>
        <p className="mt-2 text-sm">
          {service.name} · {longFmt.format(asUtcNoon(selectedDay.date))} alle {slot}
        </p>
        <p className="mt-2 text-sm text-muted">
          {confirmed
            ? "Ti aspettiamo! Il pagamento avviene in struttura."
            : `${provider.displayName} confermerà a breve: riceverai un aggiornamento nelle tue prenotazioni.`}
        </p>
        {live ? (
          <a href="/account" className="mt-4 inline-block text-sm font-medium text-terra-600 hover:underline">Vai alle mie prenotazioni →</a>
        ) : (
          <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs text-muted">Modalità demo: nessuna prenotazione è stata registrata.</p>
        )}
        <button className="mt-4 block text-sm font-medium text-terra-600 hover:underline" onClick={() => { setStep("choose"); setSlot(null); setNote(""); }}>
          Prenota un altro appuntamento
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-0 rounded-2xl border border-sand-200 bg-white p-5 shadow-sm">
      <p className="font-serif text-xl text-sage-900">Prenota</p>

      <label className="mt-4 block text-sm font-medium" htmlFor="service">Servizio</label>
      <select
        id="service"
        className="mt-1 w-full rounded-xl border border-sand-200 bg-sand-50 px-3 py-2"
        value={serviceId}
        onChange={(e) => { setServiceId(e.target.value); setDay(null); setSlot(null); setStep("choose"); setError(null); }}
      >
        {provider.services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name} — {formatPrice(s.priceCents)}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-muted">
        {formatDuration(service.durationMin)} · {modeLabel[service.mode]}
        {service.capacity > 1 && ` · gruppo fino a ${service.capacity} persone`}
      </p>

      {loading ? (
        <p className="mt-4 text-sm text-muted">Caricamento disponibilità…</p>
      ) : (
        <>
          <p className="mt-4 text-sm font-medium">Giorno</p>
          <div className="mt-1 flex gap-2 overflow-x-auto pb-2" role="listbox" aria-label="Giorni disponibili">
            {days.map((d) => {
              const active = selectedDay?.date === d.date;
              return (
                <button
                  key={d.date}
                  role="option"
                  aria-selected={active}
                  disabled={!d.slots.length}
                  onClick={() => { setDay(d.date); setSlot(null); setStep("choose"); }}
                  className={`shrink-0 rounded-xl border px-3 py-2 text-sm capitalize transition disabled:cursor-not-allowed disabled:opacity-35 ${
                    active ? "border-sage-700 bg-sage-700 text-white" : "border-sand-200 hover:border-sage-500"
                  }`}
                >
                  {dayFmt.format(asUtcNoon(d.date))}
                </button>
              );
            })}
          </div>

          {selectedDay ? (
            <>
              <p className="mt-3 text-sm font-medium">Orario</p>
              <div className="mt-1 grid grid-cols-4 gap-2">
                {selectedDay.slots.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setSlot(t); setStep("review"); setError(null); }}
                    aria-pressed={slot === t}
                    className={`rounded-lg border px-2 py-1.5 text-sm transition ${
                      slot === t ? "border-terra-500 bg-terra-500 text-white" : "border-sand-200 hover:border-terra-400"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <p className="mt-3 text-sm text-muted">Nessuna disponibilità nelle prossime due settimane.</p>
          )}
        </>
      )}

      {(step === "review" || step === "sending") && selectedDay && slot && (
        <div className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
          <div className="flex justify-between"><span>{service.name}</span><span>{formatPrice(service.priceCents)}</span></div>
          <div className="flex justify-between font-medium"><span>Totale</span><span>{formatPrice(service.priceCents)}</span></div>
          <p className="text-xs text-muted">{policyLabel[service.cancellationPolicy]}. Pagamento in struttura.</p>
          <label className="block pt-1 text-xs font-medium">
            Nota per l&apos;operatore (facoltativa)
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={500}
              rows={2}
              placeholder="Es. è la prima volta che provo questo trattamento"
              className="mt-1 w-full rounded-lg border border-sand-200 bg-sand-50 px-2 py-1.5 text-sm font-normal"
            />
          </label>
          {error && <p role="alert" className="rounded-lg bg-terra-400/10 p-2 text-terra-600">{error}</p>}
          <button
            onClick={confirm}
            disabled={step === "sending"}
            className="mt-2 w-full rounded-xl bg-terra-500 py-3 font-medium text-white transition hover:bg-terra-600 disabled:opacity-60"
          >
            {step === "sending" ? "Invio…" : provider.instantBooking ? "Prenota" : "Invia richiesta"}
          </button>
          <p className="text-center text-xs text-muted">Non serve pagare ora</p>
        </div>
      )}
    </div>
  );
}
