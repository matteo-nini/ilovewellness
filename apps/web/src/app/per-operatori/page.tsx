import type { Metadata } from "next";
import { SectionTitle } from "@/components/ui";
import { PreRegistrationForm } from "@/components/pre-registration-form";

export const metadata: Metadata = {
  title: "Per operatori e strutture",
  description: "Fatti trovare da nuovi clienti, gestisci agenda e pagamenti. Programma Operatori Fondatori: 6 mesi senza commissioni.",
};

const plans = [
  {
    name: "Base",
    price: "Gratis",
    note: "per iniziare",
    features: ["Profilo verificato e pagina pubblica", "Ricerca e mappa", "Chat con i clienti", "Prenotazioni su richiesta"],
    commission: "Commissione 12% solo sui clienti nuovi",
  },
  {
    name: "Pro",
    price: "29 €",
    note: "al mese",
    highlight: true,
    features: ["Tutto di Base", "Agenda con prenotazione immediata", "Pagamenti online e payout automatici", "Clienti abituali senza commissione", "Statistiche del profilo", "Sincronizzazione calendario"],
    commission: "Commissione 12% solo sui clienti nuovi",
  },
  {
    name: "Business",
    price: "79 €",
    note: "al mese",
    features: ["Tutto di Pro", "Più operatori e sale", "Classi di gruppo e pacchetti", "Gift card", "Eventi e ritiri"],
    commission: "Per SPA, centri e strutture",
  },
];

export default function ForProvidersPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-sand-100 to-sand-50">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-medium uppercase tracking-wider text-terra-600">Per operatori e strutture</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl leading-tight text-sage-900 sm:text-5xl">
            Più tempo per i tuoi clienti, meno tempo al telefono.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted">
            ILoveWellness ti porta clienti nuovi della tua zona, gestisce agenda, promemoria e pagamenti, e valorizza la tua professionalità con il badge di operatore verificato.
          </p>
          <a href="#fondatori" className="mt-8 inline-block rounded-full bg-terra-500 px-6 py-3 font-medium text-white hover:bg-terra-600">
            Diventa Operatore Fondatore
          </a>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle eyebrow="Vantaggi" title="Tutto quello che ti serve, in un'app" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["🔎", "Visibilità", "Compari nelle ricerche per disciplina e zona, su web e app, con pagine ottimizzate per Google."],
            ["📅", "Agenda online", "Imposti una volta gli orari: i clienti prenotano gli slot liberi, tu ricevi conferme e promemoria."],
            ["💳", "Pagamenti sicuri", "Incassi online con payout sul tuo conto. Meno disdette dell'ultimo minuto grazie alle policy di cancellazione."],
            ["🏅", "Fiducia", "Il badge Verificato e le recensioni reali ti distinguono da chi improvvisa."],
          ].map(([icon, title, text]) => (
            <div key={title} className="rounded-2xl border border-sand-200 bg-white p-6">
              <span aria-hidden className="text-3xl">{icon}</span>
              <p className="mt-3 font-serif text-xl text-sage-900">{title}</p>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="Piani" title="Prezzi semplici e trasparenti">
            Ipotesi di listino in fase di validazione con gli operatori della rete Confbenessere.
          </SectionTitle>
          <div className="grid gap-5 lg:grid-cols-3">
            {plans.map((p) => (
              <div key={p.name} className={`flex flex-col rounded-3xl border p-7 ${p.highlight ? "border-terra-500 shadow-lg" : "border-sand-200"}`}>
                {p.highlight && <span className="mb-3 self-start rounded-full bg-terra-500 px-3 py-0.5 text-xs font-medium text-white">Il più scelto</span>}
                <p className="font-serif text-2xl text-sage-900">{p.name}</p>
                <p className="mt-2"><span className="font-serif text-4xl">{p.price}</span> <span className="text-muted">{p.note}</span></p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><span aria-hidden className="text-sage-500">✓</span>{f}</li>
                  ))}
                </ul>
                <p className="mt-5 text-xs text-muted">{p.commission}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="fondatori" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-14">
        <div className="grid gap-10 rounded-3xl bg-sage-900 p-8 text-sand-100 sm:p-12 lg:grid-cols-2">
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-terra-400">Programma Operatori Fondatori</p>
            <h2 className="mt-2 font-serif text-3xl text-white">I primi 200 operatori di Bologna e Appennino</h2>
            <ul className="mt-6 space-y-3">
              <li>✓ 0% di commissioni per 6 mesi</li>
              <li>✓ Piano Pro gratuito per 12 mesi</li>
              <li>✓ Badge &quot;Fondatore&quot; per sempre sul profilo</li>
              <li>✓ Onboarding assistito e servizio fotografico</li>
              <li>✓ Voce in capitolo sulle funzionalità dell&apos;app</li>
            </ul>
          </div>
          <PreRegistrationForm />
        </div>
      </section>
    </>
  );
}
