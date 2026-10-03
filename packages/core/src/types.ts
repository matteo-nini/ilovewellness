// Tipi del dominio usati da web e app. Sono indipendenti dalla sorgente dati:
// le righe del database (database.types.ts) vengono convertite in questi tipi
// da src/source.ts, così l'interfaccia non dipende dai dettagli dello schema.

export type ProviderKind = "individual" | "venue";
export type ServiceMode = "in_person" | "online" | "at_home";
export type CancellationPolicy = "flexible" | "moderate" | "strict";

export interface Category {
  slug: string;
  name: string;
  parentSlug: string | null;
  icon?: string;
  description?: string;
}

export interface Location {
  label: string;
  address: string;
  city: string;
  citySlug: string;
  province: string;
  lat: number;
  lng: number;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  categorySlug: string;
  durationMin: number;
  slotStepMin: number;
  priceCents: number;
  mode: ServiceMode;
  capacity: number;
  cancellationPolicy: CancellationPolicy;
}

/** Disponibilità settimanale: weekday ISO (1 = lunedì … 7 = domenica). */
export interface AvailabilityRule {
  weekday: number;
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  serviceId?: string; // se assente vale per tutti i servizi
}

export interface Review {
  authorName: string;
  rating: number;
  body: string;
  date: string; // ISO
  reply?: string;
}

export interface Provider {
  /** Presente quando i dati arrivano da Supabase. */
  id?: string;
  slug: string;
  kind: ProviderKind;
  displayName: string;
  headline: string;
  bio: string;
  verified: boolean;
  instantBooking: boolean;
  languages: string[];
  categorySlugs: string[];
  location: Location;
  services: Service[];
  availability: AvailabilityRule[];
  reviews: Review[];
  credentials: string[];
  /** Colori della copertina segnaposto (il prototipo non usa foto). */
  palette: [string, string];
}

/** Riga dei risultati di ricerca (card): solo i dati necessari alla lista e alla mappa. */
export interface ProviderListItem {
  slug: string;
  kind: ProviderKind;
  displayName: string;
  headline: string;
  categoryNames: string[];
  city: string;
  lat: number;
  lng: number;
  verified: boolean;
  instantBooking: boolean;
  hasOnline: boolean;
  minPriceCents: number;
  ratingAvg: number;
  ratingCount: number;
  distanceKm: number | null;
  palette: [string, string];
}

export interface DaySlots {
  date: string; // YYYY-MM-DD (ora di Roma)
  slots: string[]; // "HH:MM"
}

export type BookingStatus =
  | "awaiting_payment"
  | "pending"
  | "confirmed"
  | "cancelled_by_client"
  | "cancelled_by_provider"
  | "completed"
  | "no_show"
  | "disputed";

export interface Booking {
  id: string;
  providerSlug: string;
  providerName: string;
  serviceName: string;
  startsAt: string; // ISO
  endsAt: string; // ISO
  status: BookingStatus;
  priceCents: number;
  clientName?: string;
  clientNote?: string | null;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  city?: string;
  online?: boolean;
  maxPrice?: number; // euro
  verifiedOnly?: boolean;
}
