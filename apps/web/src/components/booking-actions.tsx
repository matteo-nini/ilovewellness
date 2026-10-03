"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitProviderForReview, transitionBooking, type BookingStatus } from "@ilovewellness/core";
import { getBrowserClient } from "@/lib/supabase/browser";
import { buttonClass } from "./ui";

/**
 * Pulsante che cambia lo stato di una prenotazione tramite la RPC `booking_transition`.
 * È il database a decidere se la transizione è permessa a chi clicca.
 */
export function BookingActionButton({
  bookingId, to, label, confirmText, variant = "secondary",
}: {
  bookingId: string;
  to: BookingStatus;
  label: string;
  confirmText?: string;
  variant?: "primary" | "secondary";
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    if (confirmText && !window.confirm(confirmText)) return;
    setBusy(true);
    setError(null);
    try {
      await transitionBooking(getBrowserClient(), bookingId, to);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button onClick={run} disabled={busy} className={`${buttonClass[variant]} px-3 py-1.5 text-sm`}>
        {busy ? "…" : label}
      </button>
      {error && <span role="alert" className="text-xs text-terra-600">{error}</span>}
    </span>
  );
}

export function SubmitForReviewButton({ providerId }: { providerId: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      className={`${buttonClass.primary} px-3 py-1.5 text-sm`}
      onClick={async () => {
        setBusy(true);
        await submitProviderForReview(getBrowserClient(), providerId).finally(() => setBusy(false));
        router.refresh();
      }}
    >
      Invia in verifica
    </button>
  );
}
