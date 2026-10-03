# @ilovewellness/web

Sito pubblico + web app + area operatore di ILoveWellness (Next.js 16, App Router, React 19, Tailwind CSS 4).

Funziona in **modalità demo** (dati fittizi, nessuna configurazione) o **live** collegata a Supabase
(copia `.env.example` in `.env.local`). Guida: [docs/10-sviluppo.md](../../docs/10-sviluppo.md).

| Percorso | Ruolo |
|---|---|
| `src/app/page.tsx` | Home |
| `src/app/cerca/` | Ricerca con filtri (form GET, funziona senza JS) + mappa schematica |
| `src/app/operatori/[slug]/` | Scheda operatore, JSON-LD, widget di prenotazione con slot reali |
| `src/app/benessere/[categoria]/[citta]/` | Pagine SEO città × disciplina |
| `src/app/accedi/`, `src/app/auth/` | Login/registrazione, conferma email, logout |
| `src/app/account/` | Le mie prenotazioni (annullamento) |
| `src/app/area-operatore/` | Creazione profilo, invio in verifica, gestione prenotazioni ricevute |
| `src/app/chi-siamo/`, `src/app/per-operatori/` | Pagine istituzionali |
| `src/lib/source.ts` | Sorgente del catalogo (demo o Supabase) |
| `src/lib/supabase/` | Client Supabase server (cookie) e browser |
| `src/proxy.ts` | Rinnovo della sessione (ex middleware) |

La logica di dominio è in [`packages/core`](../../packages/core), condivisa con l'app.
