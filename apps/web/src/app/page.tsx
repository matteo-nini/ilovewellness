import Link from "next/link";
import { SearchForm } from "@/components/search-form";
import { ProviderCard, SectionTitle } from "@/components/ui";
import { rootCategories, searchProviders } from "@/lib/catalog";

export default function Home() {
  const featured = searchProviders({}).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sage-100 to-sand-50">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
          <p className="text-sm font-medium uppercase tracking-wider text-terra-600">Bologna e Appennino · in anteprima</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-sage-900 sm:text-6xl">
            Il benessere di cui ti puoi fidare.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            Operatori olistici, insegnanti di yoga, SPA e strutture <strong className="text-ink">verificati</strong>.
            Leggi recensioni reali, scrivi al professionista e prenota in pochi tocchi.
          </p>
          <div className="mt-8 max-w-4xl">
            <SearchForm />
          </div>
        </div>
      </section>

      {/* Categorie */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle eyebrow="Esplora" title="Di cosa hai bisogno oggi?" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {rootCategories().map((c) => (
            <Link key={c.slug} href={`/cerca?categoria=${c.slug}`} className="rounded-2xl border border-sand-200 bg-white p-5 transition hover:border-sage-300 hover:shadow-md">
              <span aria-hidden className="text-3xl">{c.icon}</span>
              <p className="mt-3 font-medium text-sage-900">{c.name}</p>
              <p className="mt-1 text-sm text-muted">{c.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Come funziona */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Come funziona" title="Tre passi verso il tuo momento di benessere" />
          <ol className="grid gap-6 sm:grid-cols-3">
            {[
              ["Cerca", "Filtra per disciplina, zona, data e prezzo. Vedi tutto su mappa, come quando cerchi una casa per le vacanze."],
              ["Scegli con fiducia", "Ogni operatore è verificato: identità, formazione, assicurazione. Le recensioni arrivano solo da chi ha davvero prenotato."],
              ["Prenota e rilassati", "Scrivi al professionista se hai dubbi, prenota lo slot, paga in sicurezza e ricevi un promemoria."],
            ].map(([title, text], i) => (
              <li key={title} className="rounded-2xl bg-sand-50 p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-terra-500 font-serif text-lg text-white">{i + 1}</span>
                <p className="mt-4 font-serif text-xl text-sage-900">{title}</p>
                <p className="mt-2 text-muted">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* In evidenza */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle eyebrow="In evidenza" title="Scelti per te vicino a Bologna" />
          <Link href="/cerca" className="mb-8 text-sm font-medium text-terra-600 hover:underline">Vedi tutti →</Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((s) => (
            <ProviderCard key={s.provider.slug} summary={s} />
          ))}
        </div>
      </section>

      {/* Fiducia */}
      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-8 rounded-3xl bg-sage-900 p-8 text-sand-100 sm:grid-cols-2 sm:p-12">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-terra-400">La nostra promessa</p>
            <h2 className="mt-2 font-serif text-3xl text-white">Verifichiamo ogni operatore, una persona alla volta.</h2>
          </div>
          <ul className="space-y-3">
            {[
              "Documento d'identità e dati fiscali controllati",
              "Attestati di formazione e iscrizione ad associazioni professionali (L. 4/2013)",
              "Assicurazione di responsabilità civile",
              "Recensioni solo dopo una prenotazione completata",
              "Nessuna promessa di cura: il benessere non sostituisce il medico",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden className="text-terra-400">✓</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA operatori */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-sand-200 bg-sand-100 p-8 sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="font-serif text-3xl text-sage-900">Sei un operatore o una struttura?</h2>
            <p className="mt-2 max-w-xl text-muted">Agenda online, pagamenti sicuri, nuovi clienti. Unisciti ai primi 200 Operatori Fondatori: 6 mesi senza commissioni.</p>
          </div>
          <Link href="/per-operatori" className="rounded-full bg-sage-700 px-6 py-3 font-medium text-white hover:bg-sage-900">
            Scopri come funziona
          </Link>
        </div>
      </section>
    </>
  );
}
