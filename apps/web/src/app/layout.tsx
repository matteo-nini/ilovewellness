import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "ILoveWellness — il benessere di cui ti puoi fidare",
    template: "%s · ILoveWellness",
  },
  description:
    "Trova e prenota operatori olistici verificati, insegnanti di yoga, SPA e centri benessere vicino a te. Recensioni reali, chat e prenotazione immediata.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <a href="#contenuto" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2">
          Vai al contenuto
        </a>
        <div className="bg-sage-900 px-4 py-1.5 text-center text-xs text-sand-100">
          Prototipo dimostrativo — dati e operatori fittizi, nessuna prenotazione reale.
        </div>
        <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
          <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3" aria-label="Principale">
            <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-sage-900">
              I<span className="text-terra-500">♥</span>Wellness
            </Link>
            <div className="flex items-center gap-1 text-sm sm:gap-4">
              <Link href="/cerca" className="rounded-full px-3 py-2 hover:bg-sand-100">Cerca</Link>
              <Link href="/per-operatori" className="rounded-full px-3 py-2 hover:bg-sand-100">Sei un operatore?</Link>
              <span className="hidden rounded-full border border-sage-300 px-4 py-2 text-sage-700 sm:inline" title="Disponibile nella versione completa">
                Accedi
              </span>
            </div>
          </nav>
        </header>
        <main id="contenuto" className="flex-1">{children}</main>
        <footer className="mt-16 border-t border-sand-200 bg-sand-100">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-muted sm:grid-cols-3">
            <div>
              <p className="font-serif text-lg text-sage-900">ILoveWellness</p>
              <p className="mt-2">Il marketplace del benessere: operatori olistici, yoga, SPA e strutture verificati.</p>
            </div>
            <div>
              <p className="font-medium text-ink">Esplora</p>
              <ul className="mt-2 space-y-1">
                <li><Link href="/benessere/yoga-meditazione/bologna" className="hover:underline">Yoga e meditazione a Bologna</Link></li>
                <li><Link href="/benessere/massaggi-trattamenti/bologna" className="hover:underline">Massaggi a Bologna</Link></li>
                <li><Link href="/benessere/spa-terme/porretta-terme" className="hover:underline">SPA e terme in Appennino</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ink">Importante</p>
              <p className="mt-2">
                Le discipline del benessere non sostituiscono diagnosi o cure mediche. In caso di problemi di salute rivolgiti al tuo medico.
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
