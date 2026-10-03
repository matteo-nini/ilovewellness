import Link from "next/link";
import { formatPrice, getCategory } from "@/lib/catalog";
import type { Provider, ProviderSummary } from "@/lib/types";

export function Stars({ value, count, size = "sm" }: { value: number; count: number; size?: "sm" | "md" }) {
  if (!count) return <span className="text-sm text-muted">Nuovo</span>;
  return (
    <span className={size === "md" ? "text-base" : "text-sm"}>
      <span aria-hidden className="text-terra-500">★</span>{" "}
      <span className="font-medium">{value.toLocaleString("it-IT", { minimumFractionDigits: 1 })}</span>{" "}
      <span className="text-muted">({count} {count === 1 ? "recensione" : "recensioni"})</span>
    </span>
  );
}

export function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-sage-100 px-2.5 py-0.5 text-xs font-medium text-sage-700" title="Identità, formazione e assicurazione verificate da ILoveWellness">
      <svg aria-hidden viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current"><path d="M10 1l2.4 1.8 3 .1.9 2.9 2.4 1.8-1 2.8 1 2.9-2.4 1.7-.9 2.9-3 .1L10 19l-2.4-1.8-3-.1-.9-2.9L1.3 12.4l1-2.9-1-2.8 2.4-1.8.9-2.9 3-.1z" /><path d="M8.6 12.6L6 10l1-1 1.6 1.6L13 6.2l1 1z" fill="#fff" /></svg>
      Verificato
    </span>
  );
}

export function Cover({ provider, className = "" }: { provider: Provider; className?: string }) {
  const [a, b] = provider.palette;
  const initials = provider.displayName.split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  return (
    <div
      className={`relative flex items-end overflow-hidden ${className}`}
      style={{ background: `radial-gradient(circle at 20% 20%, ${b} 0, transparent 55%), linear-gradient(135deg, ${a}, ${b})` }}
      role="img"
      aria-label={`Immagine di copertina di ${provider.displayName}`}
    >
      <span className="m-4 font-serif text-4xl text-white/90 drop-shadow-sm">{initials}</span>
    </div>
  );
}

export function ProviderCard({ summary }: { summary: ProviderSummary }) {
  const { provider: p, minPriceCents, ratingAvg, ratingCount, distanceKm } = summary;
  const cats = p.categorySlugs.map((c) => getCategory(c)?.name).filter(Boolean).join(" · ");
  return (
    <Link href={`/operatori/${p.slug}`} className="group block overflow-hidden rounded-2xl border border-sand-200 bg-white transition hover:-translate-y-0.5 hover:shadow-lg">
      <Cover provider={p} className="h-36" />
      <div className="space-y-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-serif text-lg leading-tight text-sage-900 group-hover:underline">{p.displayName}</h3>
          {p.verified && <VerifiedBadge />}
        </div>
        <p className="text-sm text-muted">{cats}</p>
        <p className="line-clamp-2 text-sm">{p.headline}</p>
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
          <Stars value={ratingAvg} count={ratingCount} />
          <span>
            da <strong>{formatPrice(minPriceCents)}</strong>
          </span>
        </div>
        <p className="text-xs text-muted">
          📍 {p.location.city}
          {distanceKm !== null && ` · ${distanceKm.toLocaleString("it-IT")} km`}
          {p.services.some((s) => s.mode === "online") && " · anche online"}
          {p.instantBooking ? " · prenotazione immediata" : " · su richiesta"}
        </p>
      </div>
    </Link>
  );
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="mb-8 max-w-2xl">
      {eyebrow && <p className="text-sm font-medium uppercase tracking-wider text-terra-600">{eyebrow}</p>}
      <h2 className="mt-1 font-serif text-3xl text-sage-900">{title}</h2>
      {children && <p className="mt-3 text-muted">{children}</p>}
    </div>
  );
}
