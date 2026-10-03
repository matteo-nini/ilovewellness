import type { Metadata } from "next";
import Link from "next/link";
import { SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Chi siamo",
  description: "ILoveWellness nasce dalla rete Confbenessere: operatori del benessere che vogliono renderlo accessibile e affidabile.",
};

// NOTA: i testi definitivi vanno importati dal sito attuale (ilovewellnessworld.wordpress.com),
// che non era raggiungibile dall'ambiente di sviluppo. Vedi docs/12-contenuti-sito.md.
export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-sage-100 to-sand-50">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-sm font-medium uppercase tracking-wider text-terra-600">Chi siamo</p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-sage-900 sm:text-5xl">
            Una rete di persone che credono nel benessere fatto bene.
          </h1>
          <p className="mt-5 text-lg text-muted">
            ILoveWellness nasce da <strong className="text-ink">Confbenessere</strong>, la rete di operatori del benessere che dal
            2024 si incontra sull&apos;Appennino tra Bologna e Firenze. Il primo meeting si è tenuto il 4 agosto 2024 a Montovolo,
            Camugnano: da lì l&apos;idea di uno spazio unico, digitale, dove trovare professionisti e strutture di cui fidarsi.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-14">
        <SectionTitle eyebrow="La missione" title="Rendere il benessere accessibile, affidabile e vicino" />
        <div className="grid gap-6 sm:grid-cols-3">
          {[
            ["Accessibile", "Trovare un operatore o una struttura deve essere semplice come prenotare un tavolo al ristorante."],
            ["Affidabile", "Verifichiamo identità, formazione e assicurazione degli operatori. Le recensioni arrivano solo da chi ha prenotato."],
            ["Vicino", "Partiamo dal territorio che conosciamo — Bologna e l'Appennino — e cresciamo insieme alla rete."],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-sand-200 bg-white p-6">
              <p className="font-serif text-xl text-sage-900">{t}</p>
              <p className="mt-2 text-sm text-muted">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl bg-sage-900 p-8 text-sand-100 sm:p-12">
          <h2 className="font-serif text-3xl text-white">Fai parte della rete</h2>
          <p className="mt-3 max-w-xl">Sei un operatore, un insegnante o gestisci una struttura? Diventa uno dei primi 200 Operatori Fondatori.</p>
          <Link href="/per-operatori" className="mt-6 inline-block rounded-full bg-terra-500 px-6 py-3 font-medium text-white hover:bg-terra-600">
            Scopri il programma
          </Link>
        </div>
      </section>
    </>
  );
}
