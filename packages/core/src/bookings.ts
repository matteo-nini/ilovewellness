// Operazioni dell'utente autenticato: prenotazioni, area operatore, profilo operatore.
// Tutte passano dal client Supabase con la sessione dell'utente: i permessi
// li applica il database (RLS + funzioni RPC), non questo codice.
import { slugify, type Client } from "./source";
import type { Booking, BookingStatus } from "./types";

export class BookingError extends Error {}

/** Messaggi comprensibili per gli errori sollevati dai trigger/RPC del database. */
function humanize(message: string): string {
  if (message.includes("bookings_no_overlap") || message.includes("non è disponibile")) {
    return "Questo orario è appena stato prenotato da qualcun altro. Scegline un altro.";
  }
  if (message.includes("JWT") || message.includes("permission")) return "Devi accedere per continuare.";
  return message;
}

export async function createBooking(
  client: Client,
  input: { userId: string; providerId: string; serviceId: string; startsAt: string; note?: string },
): Promise<{ id: string; status: BookingStatus }> {
  // prezzo, durata, stato e commissione vengono calcolati dal trigger `prepare_booking`:
  // i valori segnaposto qui sotto servono solo a soddisfare il tipo di inserimento.
  const { data, error } = await client
    .from("bookings")
    .insert({
      client_id: input.userId,
      provider_id: input.providerId,
      service_id: input.serviceId,
      starts_at: input.startsAt,
      ends_at: input.startsAt,
      payment_mode: "on_site", // il pagamento online arriverà con Stripe Connect
      client_note: input.note || null,
      price_cents: 0,
      service_name: "",
      cancellation_policy: "flexible",
    })
    .select("id, status")
    .single();
  if (error) throw new BookingError(humanize(error.message));
  return data;
}

const BOOKING_SELECT = `
  id, service_name, starts_at, ends_at, status, price_cents, client_note,
  providers ( slug, display_name ),
  profiles ( full_name )
` as const;

type BookingRow = {
  id: string;
  service_name: string;
  starts_at: string;
  ends_at: string;
  status: BookingStatus;
  price_cents: number;
  client_note: string | null;
  providers: { slug: string; display_name: string } | null;
  profiles: { full_name: string } | null;
};

const toBooking = (r: BookingRow): Booking => ({
  id: r.id,
  providerSlug: r.providers?.slug ?? "",
  providerName: r.providers?.display_name ?? "",
  serviceName: r.service_name,
  startsAt: r.starts_at,
  endsAt: r.ends_at,
  status: r.status,
  priceCents: r.price_cents,
  clientName: r.profiles?.full_name,
  clientNote: r.client_note,
});

export async function listMyBookings(client: Client, userId: string): Promise<Booking[]> {
  const { data, error } = await client
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("client_id", userId)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return (data as BookingRow[]).map(toBooking);
}

export async function listProviderBookings(client: Client, providerId: string): Promise<Booking[]> {
  const { data, error } = await client
    .from("bookings")
    .select(BOOKING_SELECT)
    .eq("provider_id", providerId)
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data as BookingRow[]).map(toBooking);
}

export async function transitionBooking(client: Client, bookingId: string, status: BookingStatus, reason?: string) {
  const { error } = await client.rpc("booking_transition", { p_booking_id: bookingId, p_status: status, p_reason: reason });
  if (error) throw new BookingError(humanize(error.message));
}

// ---------------------------------------------------------------- area operatore

export interface MyProvider {
  id: string;
  slug: string;
  displayName: string;
  status: "draft" | "pending" | "verified" | "rejected" | "suspended";
  role: "owner" | "staff";
}

export async function listMyProviders(client: Client, userId: string): Promise<MyProvider[]> {
  const { data, error } = await client
    .from("provider_members")
    .select("role, providers ( id, slug, display_name, verification_status )")
    .eq("user_id", userId);
  if (error) throw error;
  return (data ?? []).flatMap((m) =>
    m.providers
      ? [{ id: m.providers.id, slug: m.providers.slug, displayName: m.providers.display_name, status: m.providers.verification_status, role: m.role }]
      : [],
  );
}

export async function createProviderDraft(
  client: Client,
  input: { kind: "individual" | "venue"; displayName: string; headline: string; bio: string; contactEmail?: string },
): Promise<{ id: string; slug: string }> {
  const slug = `${slugify(input.displayName)}-${Math.random().toString(36).slice(2, 6)}`;
  const { data, error } = await client
    .from("providers")
    .insert({
      kind: input.kind,
      slug,
      display_name: input.displayName,
      headline: input.headline,
      bio: input.bio,
      contact_email: input.contactEmail || null,
    })
    .select("id, slug")
    .single();
  if (error) throw new BookingError(error.message);
  return data;
}

export async function submitProviderForReview(client: Client, providerId: string) {
  const { error } = await client.rpc("submit_provider_for_review", { p_provider_id: providerId });
  if (error) throw new BookingError(error.message);
}
