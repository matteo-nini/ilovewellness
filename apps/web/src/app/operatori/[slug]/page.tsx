import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDuration, formatPrice, getCategory, modeLabel, policyLabel, ratingOf } from "@ilovewellness/core";
import { BookingWidget } from "@/components/booking-widget";
import { Cover, Stars, VerifiedBadge } from "@/components/ui";
import { isLive } from "@/lib/env";
import { getCatalog } from "@/lib/source";

// le schede vengono generate in anticipo e aggiornate al massimo ogni 5 minuti
export const revalidate = 300;

export async function generateStaticParams() {
  return (await getCatalog().listProviderSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata(props: PageProps<"/operatori/[slug]">): Promise<Metadata> {
  const p = await getCatalog().getProvider((await props.params).slug);
  return p ? { title: `${p.displayName} — ${p.location.city}`, description: p.headline } : {};
}

const languageNames: Record<string, string> = { it: "Italiano", en: "Inglese", fr: "Francese", de: "Tedesco", es: "Spagnolo" };

export default async function ProviderPage(props: PageProps<"/operatori/[slug]">) {
  const p = await getCatalog().getProvider((await props.params).slug);
  if (!p || !p.verified) notFound();
  const { avg, count } = ratingOf(p);
  const cats = p.categorySlugs.map((c) => getCategory(c)?.name).filter(Boolean);

  // Dati strutturati schema.org per la SEO (requisito NF-07)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": p.kind === "venue" ? "HealthAndBeautyBusiness" : "LocalBusiness",
    name: p.displayName,
    description: p.headline,
    address: { "@type": "PostalAddress", streetAddress: p.location.address, addressLocality: p.location.city, addressRegion: p.location.province, addressCountry: "IT" },
    geo: { "@type": "GeoCoordinates", latitude: p.location.lat, longitude: p.location.lng },
    ...(count ? { aggregateRating: { "@type": "AggregateRating", ratingValue: avg, reviewCount: count } } : {}),
    makesOffer: p.services.map((s) => ({ "@type": "Offer", name: s.name, price: s.priceCents / 100, priceCurrency: "EUR" })),
  };

  return (
    <article className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav className="mb-4 text-sm text-muted" aria-label="Percorso">
        <Link href="/cerca" className="hover:underline">Cerca</Link> ›{" "}
        <Link href={`/cerca?citta=${p.location.citySlug}`} className="hover:underline">{p.location.city}</Link> ›{" "}
        <span className="text-ink">{p.displayName}</span>
      </nav>

      <Cover name={p.displayName} palette={p.palette} className="h-56 rounded-3xl sm:h-72" />

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-serif text-4xl text-sage-900">{p.displayName}</h1>
            {p.verified && <VerifiedBadge />}
          </div>
          <p className="mt-2 text-lg">{p.headline}</p>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
            <Stars value={avg} count={count} />
            <span>📍 {p.location.address}, {p.location.city}</span>
            <span>{p.kind === "venue" ? "Struttura" : "Professionista"}</span>
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {cats.map((c) => (
              <span key={c} className="rounded-full bg-sand-100 px-3 py-1 text-sm">{c}</span>
            ))}
          </div>

          <section className="mt-10">
            <h2 className="font-serif text-2xl text-sage-900">Chi sono</h2>
            <p className="mt-3 leading-relaxed">{p.bio}</p>
            <p className="mt-3 text-sm text-muted">Lingue: {p.languages.map((l) => languageNames[l] ?? l).join(", ")}</p>
          </section>

          {p.credentials.length > 0 && (
            <section className="mt-10">
              <h2 className="font-serif text-2xl text-sage-900">Formazione e verifiche</h2>
              <ul className="mt-3 space-y-2">
                {p.credentials.map((c) => (
                  <li key={c} className="flex gap-2"><span aria-hidden className="text-sage-500">✓</span>{c}</li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-serif text-2xl text-sage-900">Servizi</h2>
            <ul className="mt-4 divide-y divide-sand-200 rounded-2xl border border-sand-200 bg-white">
              {p.services.map((s) => (
                <li key={s.id} className="flex flex-wrap items-start justify-between gap-3 p-5">
                  <div className="max-w-md">
                    <p className="font-medium">{s.name}</p>
                    <p className="mt-1 text-sm text-muted">{s.description}</p>
                    <p className="mt-2 text-xs text-muted">
                      {formatDuration(s.durationMin)} · {modeLabel[s.mode]}
                      {s.capacity > 1 && ` · max ${s.capacity} persone`} · {policyLabel[s.cancellationPolicy]}
                    </p>
                  </div>
                  <p className="font-serif text-xl">{formatPrice(s.priceCents)}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="font-serif text-2xl text-sage-900">Recensioni</h2>
            <p className="mt-1 text-sm text-muted">Solo da clienti che hanno completato una prenotazione su ILoveWellness.</p>
            {p.reviews.length ? (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {p.reviews.map((r) => (
                  <li key={r.authorName + r.date} className="rounded-2xl border border-sand-200 bg-white p-5">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{r.authorName}</p>
                      <p className="text-sm text-terra-500" aria-label={`${r.rating} stelle su 5`}>{"★".repeat(r.rating)}<span className="text-sand-200">{"★".repeat(5 - r.rating)}</span></p>
                    </div>
                    <p className="text-xs text-muted">{new Date(r.date).toLocaleDateString("it-IT", { month: "long", year: "numeric" })}</p>
                    <p className="mt-2 text-sm">{r.body}</p>
                    {r.reply && <p className="mt-3 rounded-lg bg-sand-50 p-3 text-sm"><span className="font-medium">Risposta di {p.displayName}:</span> {r.reply}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 rounded-2xl border border-dashed border-sand-200 p-6 text-sm text-muted">Ancora nessuna recensione: prenota per primo!</p>
            )}
          </section>

          <p className="mt-10 rounded-xl bg-sand-100 p-4 text-xs text-muted">
            Le discipline del benessere non sostituiscono diagnosi o cure mediche. Gli operatori su ILoveWellness non possono fare diagnosi né promettere guarigioni.
          </p>
        </div>

        <aside className="min-w-0 space-y-4 lg:sticky lg:top-24 lg:self-start">
          <BookingWidget provider={p} live={isLive} />
          <div className="rounded-2xl border border-sand-200 bg-white p-5 text-sm">
            <p className="font-medium">Hai una domanda?</p>
            <p className="mt-1 text-muted">Scrivi a {p.displayName} prima di prenotare: di solito risponde entro poche ore.</p>
            <button disabled className="mt-3 w-full cursor-not-allowed rounded-xl border border-sage-300 py-2 text-sage-700 opacity-70" title="Prossimo passo dello sviluppo">
              💬 Chat in arrivo
            </button>
          </div>
        </aside>
      </div>
    </article>
  );
}
