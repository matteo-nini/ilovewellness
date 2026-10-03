// Accesso ai dati del catalogo. Nel prototipo lavora sui dati demo in memoria;
// con il backend attivo queste funzioni chiameranno le RPC Supabase
// `search_providers` e `available_slots` (stessa semantica).
import { categories, cities, providers } from "./demo-data";
import type { Category, Provider, ProviderSummary, SearchFilters, Service } from "./types";

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function rootCategories(): Category[] {
  return categories.filter((c) => c.parentSlug === null);
}

/** La categoria e tutte le sue discendenti. */
export function categoryTree(slug: string): Set<string> {
  const result = new Set<string>([slug]);
  let added = true;
  while (added) {
    added = false;
    for (const c of categories) {
      if (c.parentSlug && result.has(c.parentSlug) && !result.has(c.slug)) {
        result.add(c.slug);
        added = true;
      }
    }
  }
  return result;
}

export function getCity(slug: string) {
  return cities.find((c) => c.slug === slug);
}

export function allCities() {
  return cities;
}

export function getProvider(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function allProviders(): Provider[] {
  return providers;
}

export function ratingOf(p: Provider): { avg: number; count: number } {
  const count = p.reviews.length;
  const avg = count ? p.reviews.reduce((s, r) => s + r.rating, 0) / count : 0;
  return { avg: Math.round(avg * 10) / 10, count };
}

/** Distanza in km (formula dell'emisenoverso). */
export function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

const normalize = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export const DEFAULT_RADIUS_KM = 25;

export function searchProviders(filters: SearchFilters): ProviderSummary[] {
  const origin = filters.city ? getCity(filters.city) : undefined;
  const catSet = filters.category ? categoryTree(filters.category) : null;
  const terms = filters.q ? normalize(filters.q).split(/\s+/).filter(Boolean) : [];

  return providers
    .filter((p) => !filters.verifiedOnly || p.verified)
    .filter((p) => !catSet || p.categorySlugs.some((c) => catSet.has(c)))
    .filter((p) => {
      if (!terms.length) return true;
      const text = normalize(
        [p.displayName, p.headline, p.bio, ...p.services.map((s) => s.name), ...p.categorySlugs.map((c) => getCategory(c)?.name ?? "")].join(" "),
      );
      return terms.every((t) => text.includes(t));
    })
    .filter((p) => !filters.online || p.services.some((s) => s.mode === "online"))
    .filter((p) => {
      if (!origin) return true;
      const near = distanceKm(origin, p.location) <= DEFAULT_RADIUS_KM;
      return near || (filters.online === true && p.services.some((s) => s.mode === "online"));
    })
    .map((p) => {
      const { avg, count } = ratingOf(p);
      return {
        provider: p,
        minPriceCents: Math.min(...p.services.map((s) => s.priceCents)),
        ratingAvg: avg,
        ratingCount: count,
        distanceKm: origin ? Math.round(distanceKm(origin, p.location) * 10) / 10 : null,
      };
    })
    .filter((s) => !filters.maxPrice || s.minPriceCents <= filters.maxPrice * 100)
    .sort((a, b) =>
      a.distanceKm !== null && b.distanceKm !== null
        ? a.distanceKm - b.distanceKm
        : b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
    );
}

// ---------------------------------------------------------------- disponibilità

export interface DaySlots {
  date: string; // YYYY-MM-DD (ora di Roma)
  slots: string[]; // "HH:MM"
}

const TZ = "Europe/Rome";

/** Data e ora correnti nel fuso di Roma, come stringhe. */
export function romeNow(now: Date): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}` };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function isoWeekday(isoDate: string): number {
  const day = new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

/**
 * Slot prenotabili nei prossimi `days` giorni, secondo le regole settimanali.
 * Replica semplificata di `public.available_slots` (senza prenotazioni esistenti).
 */
export function availableSlots(provider: Provider, service: Service, now: Date, days = 14, minNoticeHours = 12): DaySlots[] {
  const { date: today, time } = romeNow(now);
  const earliest = toMin(time) + minNoticeHours * 60; // minuti da mezzanotte di oggi
  const result: DaySlots[] = [];

  for (let i = 0; i < days; i++) {
    const date = addDays(today, i);
    const weekday = isoWeekday(date);
    const slots = new Set<number>();
    for (const r of provider.availability) {
      if (r.weekday !== weekday || (r.serviceId && r.serviceId !== service.id)) continue;
      for (let m = toMin(r.start); m + service.durationMin <= toMin(r.end); m += service.slotStepMin) {
        if (i * 24 * 60 + m >= earliest) slots.add(m);
      }
    }
    result.push({ date, slots: [...slots].sort((a, b) => a - b).map(toHHMM) });
  }
  return result;
}

// ---------------------------------------------------------------- formattazione

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR", minimumFractionDigits: cents % 100 ? 2 : 0 }).format(cents / 100);
}

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}

export const modeLabel: Record<Service["mode"], string> = {
  in_person: "In presenza",
  online: "Online",
  at_home: "A domicilio",
};

export const policyLabel: Record<Service["cancellationPolicy"], string> = {
  flexible: "Cancellazione gratuita fino a 24 h prima",
  moderate: "Cancellazione gratuita fino a 48 h prima",
  strict: "Rimborso del 50% fino a 7 giorni prima",
};
