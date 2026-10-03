import Link from "next/link";
import { bookingStatusLabel, formatDateTime, formatPrice, type Booking } from "@ilovewellness/core";

const statusTone: Record<string, string> = {
  confirmed: "bg-sage-100 text-sage-700",
  pending: "bg-sand-200 text-ink",
  completed: "bg-sand-100 text-muted",
};

/** Elenco prenotazioni; `actions` restituisce i pulsanti per ogni riga. */
export function BookingList({
  bookings, empty, perspective, actions,
}: {
  bookings: Booking[];
  empty: string;
  perspective: "client" | "provider";
  actions?: (b: Booking) => React.ReactNode;
}) {
  if (!bookings.length) return <p className="rounded-2xl border border-dashed border-sand-200 p-6 text-sm text-muted">{empty}</p>;
  return (
    <ul className="divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
      {bookings.map((b) => (
        <li key={b.id} className="flex flex-wrap items-start justify-between gap-4 p-5">
          <div className="space-y-1">
            <p className="font-medium capitalize">{formatDateTime(b.startsAt)}</p>
            <p className="text-sm">
              {b.serviceName} ·{" "}
              {perspective === "client" ? (
                <Link href={`/operatori/${b.providerSlug}`} className="text-terra-600 hover:underline">{b.providerName}</Link>
              ) : (
                <span>{b.clientName || "Cliente"}</span>
              )}
            </p>
            {perspective === "provider" && b.clientNote && <p className="text-sm text-muted">“{b.clientNote}”</p>}
            <p className="text-sm text-muted">{formatPrice(b.priceCents)} · pagamento in struttura</p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <span className={`rounded-full px-3 py-0.5 text-xs font-medium ${statusTone[b.status] ?? "bg-terra-400/10 text-terra-600"}`}>
              {bookingStatusLabel[b.status]}
            </span>
            <div className="flex flex-wrap justify-end gap-2">{actions?.(b)}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
