// Tipi del dominio: rispecchiano lo schema in supabase/migrations.
// Quando il backend sarà collegato verranno sostituiti dai tipi generati
// con `supabase gen types typescript`.

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

export interface ProviderSummary {
  provider: Provider;
  minPriceCents: number;
  ratingAvg: number;
  ratingCount: number;
  distanceKm: number | null;
}

export interface SearchFilters {
  q?: string;
  category?: string;
  city?: string;
  online?: boolean;
  maxPrice?: number; // euro
  verifiedOnly?: boolean;
}
