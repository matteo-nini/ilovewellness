// Funzioni pure sul catalogo: categorie, città, distanze, slot, formattazione.
// Non fanno accesso ai dati remoti: valgono sia per i dati demo sia per Supabase.
import { categories, cities, providers } from "./demo-data";
import type { Category, DaySlots, Provider, ProviderListItem, SearchFilters, Service } from "./types";

export { categories, cities };

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

const PALETTES: [string, string][] = [
  ["#9bb59a", "#e9dcc5"],
  ["#c98b6b", "#f1e3d3"],
  ["#7fa7b5", "#e3eef0"],
  ["#8aa36f", "#eef0dc"],
  ["#a99bc4", "#ece6f3"],
  ["#d6a04f", "#f6ead2"],
  ["#c7889b", "#f5e4ea"],
  ["#6f8f7a", "#dfe8d8"],
];

/** Colori stabili per la copertina segnaposto, ricavati dallo slug (quando non c'è una foto). */
export function paletteFor(slug: string): [string, string] {
  let h = 0;
  for (const ch of slug) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

const normalize = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");

export const DEFAULT_RADIUS_KM = 25;

export function toListItem(p: Provider, origin?: { lat: number; lng: number }): ProviderListItem {
  const { avg, count } = ratingOf(p);
  return {
    slug: p.slug,
    kind: p.kind,
    displayName: p.displayName,
    headline: p.headline,
    categoryNames: p.categorySlugs.map((c) => getCategory(c)?.name ?? c),
    city: p.location.city,
    lat: p.location.lat,
    lng: p.location.lng,
    verified: p.verified,
    instantBooking: p.instantBooking,
    hasOnline: p.services.some((s) => s.mode === "online"),
    minPriceCents: Math.min(...p.services.map((s) => s.priceCents)),
    ratingAvg: avg,
    ratingCount: count,
    distanceKm: origin ? Math.round(distanceKm(origin, p.location) * 10) / 10 : null,
    palette: p.palette,
  };
}

/** Ricerca sui dati demo: stessa semantica della RPC `search_providers`. */
export function searchDemoProviders(filters: SearchFilters): ProviderListItem[] {
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
    .map((p) => toListItem(p, origin))
    .filter((s) => !filters.maxPrice || s.minPriceCents <= filters.maxPrice * 100)
    .sort((a, b) =>
      a.distanceKm !== null && b.distanceKm !== null
        ? a.distanceKm - b.distanceKm
        : b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount,
    );
}

// ---------------------------------------------------------------- date e slot

export const TZ = "Europe/Rome";

/** Data e ora nel fuso di Roma, come stringhe "YYYY-MM-DD" e "HH:MM". */
export function romeParts(d: Date): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false,
  }).formatToParts(d);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return { date: `${get("year")}-${get("month")}-${get("day")}`, time: `${get("hour") === "24" ? "00" : get("hour")}:${get("minute")}` };
}

/** Converte data+ora di Roma in un istante ISO (UTC), gestendo l'ora legale. */
export function romeToIso(date: string, time: string): string {
  const guess = new Date(`${date}T${time}:00Z`);
  // differenza tra l'ora "letta a Roma" e quella voluta → offset del fuso in quel momento
  const seen = romeParts(guess);
  const seenMs = Date.parse(`${seen.date}T${seen.time}:00Z`);
  const offset = seenMs - guess.getTime();
  return new Date(guess.getTime() - offset).toISOString();
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};
const toHHMM = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;

export function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function isoWeekday(isoDate: string): number {
  const day = new Date(`${isoDate}T12:00:00Z`).getUTCDay();
  return day === 0 ? 7 : day;
}

/**
 * Slot dai soli orari settimanali (dati demo, senza prenotazioni esistenti).
 * Con Supabase gli slot arrivano dalla RPC `available_slots`, che tiene conto anche
 * di prenotazioni, eccezioni e capienza.
 */
export function demoSlots(provider: Provider, service: Service, now: Date, days = 14, minNoticeHours = 12): DaySlots[] {
  const { date: today, time } = romeParts(now);
  const earliest = toMin(time) + minNoticeHours * 60;
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

/** Raggruppa per giorno (ora di Roma) gli istanti restituiti da `available_slots`. */
export function groupSlotsByDay(startsAt: string[], fromDate: string, days: number): DaySlots[] {
  const byDay = new Map<string, string[]>();
  for (let i = 0; i < days; i++) byDay.set(addDays(fromDate, i), []);
  for (const iso of startsAt) {
    const { date, time } = romeParts(new Date(iso));
    byDay.get(date)?.push(time);
  }
  return [...byDay.entries()].map(([date, slots]) => ({ date, slots: [...new Set(slots)].sort() }));
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

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat("it-IT", {
    timeZone: TZ, weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
  }).format(new Date(iso));
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

export const bookingStatusLabel: Record<string, string> = {
  awaiting_payment: "In attesa di pagamento",
  pending: "In attesa di conferma",
  confirmed: "Confermata",
  cancelled_by_client: "Annullata da te",
  cancelled_by_provider: "Annullata dall'operatore",
  completed: "Completata",
  no_show: "Non presentato",
  disputed: "In contestazione",
};
