import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { listMyProviders, listProviderBookings, type Booking } from "@ilovewellness/core";
import { BookingActionButton, SubmitForReviewButton } from "@/components/booking-actions";
import { BookingList } from "@/components/booking-list";
import { ProviderOnboardingForm } from "@/components/provider-onboarding-form";
import { Notice } from "@/components/ui";
import { isLive } from "@/lib/env";
import { getCurrentUser } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Area operatore" };

const statusText = {
  draft: "Bozza: completa il profilo e invialo in verifica.",
  pending: "In verifica: il team ILoveWellness controllerà i tuoi dati.",
  verified: "Verificato: il tuo profilo è pubblico.",
  rejected: "Non approvato: controlla le note e invia di nuovo.",
  suspended: "Sospeso: contatta il supporto.",
};

function providerActions(b: Booking) {
  const started = b.startsAt <= new Date().toISOString();
  if (b.status === "pending") {
    return (
      <>
        <BookingActionButton bookingId={b.id} to="confirmed" label="Conferma" variant="primary" />
        <BookingActionButton bookingId={b.id} to="cancelled_by_provider" label="Rifiuta" confirmText="Rifiutare la richiesta?" />
      </>
    );
  }
  if (b.status === "confirmed" && started) {
    return (
      <>
        <BookingActionButton bookingId={b.id} to="completed" label="Svolta" variant="primary" />
        <BookingActionButton bookingId={b.id} to="no_show" label="Non presentato" />
      </>
    );
  }
  if (b.status === "confirmed") {
    return <BookingActionButton bookingId={b.id} to="cancelled_by_provider" label="Annulla" confirmText="Annullare l'appuntamento? Il cliente verrà avvisato." />;
  }
  return null;
}

export default async function ProviderAreaPage() {
  if (!isLive) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14">
        <Notice>Area disponibile collegando Supabase (vedi docs/10-sviluppo.md).</Notice>
      </div>
    );
  }
  const { supabase, user } = await getCurrentUser();
  if (!user) redirect("/accedi?next=/area-operatore");

  const providers = await listMyProviders(supabase, user.id);
  const withBookings = await Promise.all(providers.map(async (p) => ({ p, bookings: await listProviderBookings(supabase, p.id) })));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-serif text-4xl text-sage-900">Area operatore</h1>

      {!providers.length && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl text-sage-900">Crea il tuo profilo</h2>
            <p className="mt-2 text-muted">
              Inizia con le informazioni di base. Dopo l&apos;invio in verifica il team controllerà documenti e
              formazione; sedi, servizi e orari si completano insieme durante l&apos;onboarding.
            </p>
          </div>
          <ProviderOnboardingForm />
        </div>
      )}

      {withBookings.map(({ p, bookings }) => (
        <section key={p.id} className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-sand-200 bg-white p-5">
            <div>
              <p className="font-serif text-2xl text-sage-900">{p.displayName}</p>
              <p className="text-sm text-muted">{statusText[p.status]}</p>
            </div>
            <div className="flex gap-2">
              {p.status === "verified" && <Link href={`/operatori/${p.slug}`} className="text-sm text-terra-600 hover:underline">Vedi profilo pubblico →</Link>}
              {(p.status === "draft" || p.status === "rejected") && p.role === "owner" && <SubmitForReviewButton providerId={p.id} />}
            </div>
          </div>
          <h3 className="mt-6 font-medium">Prenotazioni</h3>
          <div className="mt-3">
            <BookingList bookings={bookings} perspective="provider" empty="Nessuna prenotazione per ora." actions={providerActions} />
          </div>
        </section>
      ))}
    </div>
  );
}
