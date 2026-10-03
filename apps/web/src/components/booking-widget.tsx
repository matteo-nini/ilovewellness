"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { availableSlots, formatDuration, formatPrice, modeLabel, policyLabel } from "@/lib/catalog";
import type { Provider } from "@/lib/types";

// "Adesso" viene letto una sola volta sul client: gli slot dipendono dall'ora
// corrente e non devono essere calcolati durante il rendering statico.
let clientNow: Date | null = null;
const getNow = () => (clientNow ??= new Date());
const noopSubscribe = () => () => {};

const dayFmt = new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const longFmt = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const asUtcNoon = (d: string) => new Date(`${d}T12:00:00Z`);

export function BookingWidget({ provider, initialServiceId }: { provider: Provider; initialServiceId?: string }) {
  const now = useSyncExternalStore(noopSubscribe, getNow, () => null);
  const [serviceId, setServiceId] = useState(initialServiceId ?? provider.services[0].id);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"choose" | "review" | "done">("choose");

  const service = provider.services.find((s) => s.id === serviceId)!;
  const days = useMemo(() => (now ? availableSlots(provider, service, now) : []), [now, provider, service]);
  const selectedDay = days.find((d) => d.date === day && d.slots.length) ?? days.find((d) => d.slots.length);

  if (step === "done" && selectedDay && slot) {
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-100 p-6" role="status">
        <p className="font-serif text-xl text-sage-900">{provider.instantBooking ? "Prenotazione confermata 🎉" : "Richiesta inviata ✉️"}</p>
        <p className="mt-2 text-sm">
          {service.name} · {longFmt.format(asUtcNoon(selectedDay.date))} alle {slot}
        </p>
        <p className="mt-2 text-sm text-muted">
          {provider.instantBooking
            ? "Riceverai un promemoria 24 ore prima."
            : `${provider.displayName} confermerà entro 24 ore. Il pagamento viene addebitato solo alla conferma.`}
        </p>
        <p className="mt-4 rounded-lg bg-white/70 p-3 text-xs text-muted">Prototipo: nessuna prenotazione è stata realmente registrata.</p>
        <button className="mt-4 text-sm font-medium text-terra-600 hover:underline" onClick={() => { setStep("choose"); setSlot(null); }}>
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
        onChange={(e) => { setServiceId(e.target.value); setDay(null); setSlot(null); setStep("choose"); }}
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

      {!now ? (
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
                    onClick={() => { setSlot(t); setStep("review"); }}
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

      {step === "review" && selectedDay && slot && (
        <div className="mt-5 space-y-2 border-t border-sand-200 pt-4 text-sm">
          <div className="flex justify-between"><span>{service.name}</span><span>{formatPrice(service.priceCents)}</span></div>
          <div className="flex justify-between text-muted"><span>Costi di servizio</span><span>inclusi</span></div>
          <div className="flex justify-between font-medium"><span>Totale</span><span>{formatPrice(service.priceCents)}</span></div>
          <p className="text-xs text-muted">{policyLabel[service.cancellationPolicy]}.</p>
          <button
            onClick={() => setStep("done")}
            className="mt-2 w-full rounded-xl bg-terra-500 py-3 font-medium text-white transition hover:bg-terra-600"
          >
            {provider.instantBooking ? "Prenota e paga" : "Invia richiesta"}
          </button>
          <p className="text-center text-xs text-muted">Pagamento sicuro · paghi solo a conferma</p>
        </div>
      )}
    </div>
  );
}
