import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { listMyBookings } from "@ilovewellness/core";
import { BookingActionButton } from "@/components/booking-actions";
import { BookingList } from "@/components/booking-list";
import { Notice } from "@/components/ui";
import { isLive } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Le mie prenotazioni" };

export default async function AccountPage() {
  if (!isLive) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <Notice>Area disponibile collegando Supabase (vedi docs/10-sviluppo.md).</Notice>
      </div>
    );
  }
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect("/accedi?next=/account");

  const bookings = await listMyBookings(supabase, user.id);
  const now = new Date().toISOString();
  const active = ["awaiting_payment", "pending", "confirmed"];
  const upcoming = bookings.filter((b) => b.startsAt >= now && active.includes(b.status)).reverse();
  const past = bookings.filter((b) => !upcoming.includes(b));

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl text-sage-900">Le mie prenotazioni</h1>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
        </div>
        <form action="/auth/esci" method="post">
          <button className="text-sm text-muted hover:underline">Esci</button>
        </form>
      </div>

      <h2 className="mt-10 font-serif text-2xl text-sage-900">In programma</h2>
      <div className="mt-4">
        <BookingList
          bookings={upcoming}
          perspective="client"
          empty="Nessun appuntamento in programma. Trova il tuo prossimo momento di benessere!"
          actions={(b) => (
            <BookingActionButton bookingId={b.id} to="cancelled_by_client" label="Annulla" confirmText="Vuoi davvero annullare questa prenotazione?" />
          )}
        />
      </div>

      <h2 className="mt-10 font-serif text-2xl text-sage-900">Storico</h2>
      <div className="mt-4">
        <BookingList bookings={past} perspective="client" empty="Ancora nessuno storico." />
      </div>
    </div>
  );
}
