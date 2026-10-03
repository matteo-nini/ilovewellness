# @ilovewellness/web

Sito pubblico + web app di ILoveWellness (Next.js 16, App Router, React 19, Tailwind CSS 4).

**Stato: prototipo cliccabile** con dati fittizi in memoria, pensato per le interviste di
validazione con operatori e utenti e per presentare il progetto. Nessun dato viene salvato.

## Comandi

```bash
pnpm dev         # sviluppo su http://localhost:3000
pnpm build       # build di produzione (pagine statiche per schede e pagine SEO)
pnpm lint
pnpm typecheck
```

## Struttura

| Percorso | Ruolo |
|---|---|
| `src/app/page.tsx` | Home: ricerca, categorie, come funziona, in evidenza |
| `src/app/cerca/` | Ricerca con filtri (form GET, funziona anche senza JS) + mappa schematica |
| `src/app/operatori/[slug]/` | Scheda operatore/struttura, servizi, recensioni, JSON-LD schema.org, widget di prenotazione |
| `src/app/benessere/[categoria]/[citta]/` | Pagine SEO città × disciplina, generate staticamente |
| `src/app/per-operatori/` | Proposta di valore, piani, programma Fondatori, pre-registrazione |
| `src/lib/types.ts` | Tipi del dominio (rispecchiano lo schema Supabase) |
| `src/lib/demo-data.ts` | Dati demo (allineati a `supabase/seed.sql`) |
| `src/lib/catalog.ts` | Ricerca, slot disponibili, formattazione — da sostituire con le RPC Supabase |

## Prossimi passi verso l'MVP

1. Creare il progetto Supabase (regione Francoforte), applicare `supabase/migrations`, generare i tipi.
2. Sostituire `src/lib/catalog.ts` con chiamate a `search_providers` / `available_slots` via `@supabase/ssr`.
3. Autenticazione (email, Google, Apple) e area riservata utente/operatore.
4. Prenotazione reale + Stripe Connect (Edge Function di checkout e webhook).
5. Chat con Supabase Realtime, notifiche email.
6. Mappa interattiva (MapLibre + tile OSM).
