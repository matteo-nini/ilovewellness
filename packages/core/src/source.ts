// Sorgenti dati del catalogo. Web e app parlano sempre con l'interfaccia
// `CatalogSource` e non sanno se dietro ci sono i dati demo o Supabase:
//   - demoSource          → dati fittizi in memoria (prototipo, test, nessuna rete)
//   - supabaseSource(c)   → database reale tramite le RPC e le tabelle protette da RLS
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  addDays, demoSlots, getCategory, getCity, groupSlotsByDay, paletteFor, romeParts,
  searchDemoProviders, DEFAULT_RADIUS_KM,
} from "./catalog";
import type { Database } from "./database.types";
import { providers as demoProviders } from "./demo-data";
import type { DaySlots, Provider, ProviderListItem, SearchFilters, Service } from "./types";

export type Client = SupabaseClient<Database>;

export interface CatalogSource {
  readonly kind: "demo" | "supabase";
  searchProviders(filters: SearchFilters): Promise<ProviderListItem[]>;
  getProvider(slug: string): Promise<Provider | null>;
  listProviderSlugs(): Promise<string[]>;
  /** Slot liberi dei prossimi `days` giorni (ora di Roma). */
  availableSlots(provider: Provider, service: Service, days?: number): Promise<DaySlots[]>;
}

// ---------------------------------------------------------------- demo

export const demoSource: CatalogSource = {
  kind: "demo",
  async searchProviders(filters) {
    return searchDemoProviders(filters);
  },
  async getProvider(slug) {
    return demoProviders.find((p) => p.slug === slug) ?? null;
  },
  async listProviderSlugs() {
    return demoProviders.map((p) => p.slug);
  },
  async availableSlots(provider, service, days = 14) {
    return demoSlots(provider, service, new Date(), days);
  },
};

// ---------------------------------------------------------------- supabase

export const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const hhmm = (t: string) => t.slice(0, 5); // "09:00:00" → "09:00"

const PROVIDER_SELECT = `
  id, slug, kind, display_name, headline, bio, instant_booking, languages, verification_status,
  locations ( label, address, city, province, is_primary, lat, lng ),
  services ( id, name, description, duration_min, slot_step_min, price_cents, mode, capacity,
             cancellation_policy, is_active, categories ( slug ) ),
  provider_categories ( categories ( slug ) ),
  availability_rules ( weekday, start_time, end_time, service_id ),
  reviews ( author_name, rating, body, created_at, provider_reply, status )
` as const;

export function supabaseSource(client: Client): CatalogSource {
  return {
    kind: "supabase",

    async searchProviders(filters) {
      const city = filters.city ? getCity(filters.city) : undefined;
      const { data, error } = await client.rpc("search_providers", {
        p_query: filters.q || undefined,
        p_category: filters.category || undefined,
        p_lat: city?.lat,
        p_lng: city?.lng,
        p_radius_km: DEFAULT_RADIUS_KM,
        p_online: filters.online || undefined,
        p_max_price: filters.maxPrice ? filters.maxPrice * 100 : undefined,
        p_limit: 50,
      });
      if (error) throw error;
      return (data ?? []).map((r) => ({
        slug: r.slug,
        kind: r.kind,
        displayName: r.display_name,
        headline: r.headline ?? "",
        categoryNames: r.category_names ?? [],
        city: r.city ?? "",
        lat: r.lat,
        lng: r.lng,
        verified: true, // la RPC restituisce solo provider verificati
        instantBooking: r.instant_booking,
        hasOnline: r.has_online,
        minPriceCents: r.min_price_cents ?? 0,
        ratingAvg: Number(r.rating_avg),
        ratingCount: r.rating_count,
        distanceKm: r.distance_km,
        palette: paletteFor(r.slug),
      }));
    },

    async getProvider(slug) {
      const { data: p, error } = await client.from("providers").select(PROVIDER_SELECT).eq("slug", slug).maybeSingle();
      if (error) throw error;
      if (!p) return null;
      const loc = [...p.locations].sort((a, b) => Number(b.is_primary) - Number(a.is_primary))[0];
      return {
        id: p.id,
        slug: p.slug,
        kind: p.kind,
        displayName: p.display_name,
        headline: p.headline ?? "",
        bio: p.bio ?? "",
        verified: p.verification_status === "verified",
        instantBooking: p.instant_booking,
        languages: p.languages,
        categorySlugs: p.provider_categories.flatMap((pc) => (pc.categories ? [pc.categories.slug] : [])),
        location: {
          label: loc?.label ?? "",
          address: loc?.address ?? "",
          city: loc?.city ?? "",
          citySlug: slugify(loc?.city ?? ""),
          province: loc?.province ?? "",
          lat: loc?.lat ?? 0,
          lng: loc?.lng ?? 0,
        },
        services: p.services
          .filter((s) => s.is_active)
          .sort((a, b) => a.price_cents - b.price_cents)
          .map((s) => ({
            id: s.id,
            name: s.name,
            description: s.description ?? "",
            categorySlug: s.categories?.slug ?? "",
            durationMin: s.duration_min,
            slotStepMin: s.slot_step_min,
            priceCents: s.price_cents,
            mode: s.mode,
            capacity: s.capacity,
            cancellationPolicy: s.cancellation_policy,
          })),
        availability: p.availability_rules.map((r) => ({
          weekday: r.weekday,
          start: hhmm(r.start_time),
          end: hhmm(r.end_time),
          serviceId: r.service_id ?? undefined,
        })),
        reviews: p.reviews
          .filter((r) => r.status === "published")
          .sort((a, b) => b.created_at.localeCompare(a.created_at))
          .map((r) => ({
            authorName: r.author_name,
            rating: r.rating,
            body: r.body ?? "",
            date: r.created_at.slice(0, 10),
            reply: r.provider_reply ?? undefined,
          })),
        credentials: p.verification_status === "verified" ? ["Identità e documenti verificati da ILoveWellness"] : [],
        palette: paletteFor(p.slug),
      };
    },

    async listProviderSlugs() {
      const { data, error } = await client.from("providers").select("slug").eq("verification_status", "verified");
      if (error) throw error;
      return (data ?? []).map((r) => r.slug);
    },

    async availableSlots(_provider, service, days = 14) {
      const today = romeParts(new Date()).date;
      const { data, error } = await client.rpc("available_slots", {
        p_service_id: service.id,
        p_from: today,
        p_to: addDays(today, days - 1),
      });
      if (error) throw error;
      return groupSlotsByDay((data ?? []).map((s) => s.starts_at), today, days);
    },
  };
}

export { getCategory };
