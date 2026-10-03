# ADR-0002 · Stack: Supabase + Next.js + Expo + Stripe Connect

- **Stato:** proposta
- **Data:** 2026-10-03

## Contesto
Serve arrivare a un MVP in ~6 mesi con un team piccolo, con web (SEO importante, come Airbnb) e app
native (come Unobravo), pagamenti marketplace e chat in tempo reale, dati in UE.

## Alternative considerate
| Opzione | Pro | Contro |
|---|---|---|
| **Supabase + Next.js + Expo** (scelta) | Postgres standard, RLS, Auth/Realtime/Storage inclusi, regione UE, una lingua | Dipendenza da un BaaS (mitigata: è Postgres, migrabile) |
| Firebase + Flutter | Molto rapido per app | Database NoSQL poco adatto a ricerche/report di marketplace; Flutter non aiuta la SEO del web |
| Backend custom (NestJS/Django) + React | Massimo controllo | 2–3 mesi in più per costruire ciò che Supabase dà già |
| No-code (Bubble, Sharetribe) | Prototipo in settimane | Limiti su app native, prestazioni, costi crescenti, lock-in; **Sharetribe** resta una valida opzione per un *test di mercato* da 4–6 settimane se si vuole validare prima di investire |

## Decisione
Supabase (Postgres + PostGIS, Auth, Storage, Realtime, Edge Functions) in regione Francoforte;
Next.js per sito e web app; Expo per le app; Stripe Connect Express per i pagamenti.

## Costi e alternative
Confronto completo con Firebase, backend su misura, Sharetribe e no-code, più i costi mensili di
tutti i servizi: [docs/09-backend-e-costi-servizi.md](../09-backend-e-costi-servizi.md).

## Conseguenze
- Le regole di accesso vanno scritte e **testate** in SQL (RLS) — vedi `supabase/tests`.
- I tipi TypeScript si generano dallo schema (`supabase gen types`) e si condividono tra web e app.
- Stripe gestisce KYC degli operatori, payout, rimborsi; la piattaforma non detiene fondi di terzi.
