# ADR-0001 · Monorepo invece di repository separati

- **Stato:** proposta (da confermare con il team)
- **Data:** 2026-10-03

## Contesto
Il progetto comprende sito pubblico, web app, app iOS/Android e backend. Unobravo, il riferimento,
offre la stessa esperienza su web e app. L'idea iniziale era creare un'organizzazione GitHub con
repository separati per sito, app e web app.

## Decisione
Un **unico repository (monorepo)** gestito con pnpm workspaces (+ Turborepo quando ci saranno più pacchetti):
`apps/web` (Next.js: sito + web app), `apps/mobile` (Expo), `supabase/` (schema), `packages/` (codice condiviso).

L'**organizzazione GitHub** resta consigliata (proprietà del codice in capo al progetto e non a una
persona, gestione permessi del team): il repository attuale si può trasferire nell'organizzazione
in qualsiasi momento senza perdere storia (Settings → Transfer ownership).

## Motivazioni
- Sito e web app **sono la stessa applicazione** Next.js: separarli duplicherebbe autenticazione, componenti e deploy.
- Un cambio allo schema dati, ai tipi e alle due app può stare in **una sola pull request** coerente.
- Un team piccolo (2–4 sviluppatori) non trae beneficio dall'isolamento dei repository e ne paga il costo (versioni, sincronizzazione, CI multipli).
- Strumenti maturi (pnpm, Turborepo, EAS, Vercel) supportano nativamente i monorepo.

## Conseguenze
- CI con filtri per percorso (si builda solo ciò che cambia).
- Eventuali repository separati in futuro solo per componenti con ciclo di vita autonomo (es. sito marketing su CMS, SDK per partner).
