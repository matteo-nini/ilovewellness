# ILoveWellness 🌿

**Il benessere di cui ti puoi fidare.** Marketplace (app iOS/Android + web app + sito) che mette in
contatto chi cerca benessere con operatori olistici, insegnanti di yoga e meditazione, SPA, terme e
strutture **verificati**: ricerca su mappa, recensioni reali, chat e prenotazione con pagamento.
Ispirato a **Unobravo** (fiducia, professionisti verificati) e **Airbnb** (marketplace, mappa, recensioni).

Progetto nato dalla rete **Confbenessere**. Stato: **Fase 0 → 1 — studio completato, sviluppo dell'MVP avviato** (web, app e database collegati).

## 📚 Documentazione

| # | Documento | Contenuto |
|---|---|---|
| 01 | [Studio di fattibilità](docs/01-studio-fattibilita.md) | Verdetto, mercato, concorrenza, SWOT, modello di business, scenario economico, rischi, KPI go/no-go |
| 02 | [Requisiti](docs/02-requisiti.md) | Ruoli, requisiti funzionali (MoSCoW), non funzionali, user story, flusso di prenotazione |
| 03 | [Architettura](docs/03-architettura.md) | Stack tecnico, modello dati, sicurezza, ambienti |
| 04 | [Roadmap, tempi e costi](docs/04-roadmap-tempi-costi.md) | Fasi, sprint MVP, team, budget, milestone |
| 05 | [Marketing e go-to-market](docs/05-marketing.md) | Brand, acquisizione operatori e utenti, lancio, script interviste |
| 06 | [Legale e compliance](docs/06-legale-compliance.md) | Forma societaria, L. 4/2013, DSA, P2B, Omnibus, DAC7, GDPR, accessibilità |
| 07 | [Finanziamento](docs/07-finanziamento.md) | Il nodo Ministero della Salute, altre fonti, fabbisogno |
| 08 | [Domande aperte](docs/08-domande-aperte.md) | Cosa serve sapere dal promotore per proseguire |
| 09 | [Backend e costi dei servizi](docs/09-backend-e-costi-servizi.md) | Serve Supabase? Alternative, costi mensili di tutti i servizi, account da aprire |
| 10 | [Guida allo sviluppo](docs/10-sviluppo.md) | Setup, modalità demo/live, Supabase in pratica, migrazioni, deploy |
| 11 | [App mobile](docs/11-app-mobile.md) | React Native per sviluppatori web, provarla sul telefono, come mostrarla |
| 12 | [Contenuti e marchio](docs/12-contenuti-sito.md) | Recupero dal sito WordPress, rischio sul nome |
| ADR | [Decisioni architetturali](docs/adr/) | [0001 Monorepo](docs/adr/0001-monorepo.md) · [0002 Stack](docs/adr/0002-stack-supabase-nextjs-expo.md) |

## 🗂️ Struttura del repository

```
apps/web/        Next.js 16 — sito pubblico + web app + area operatore
apps/mobile/     Expo (React Native) — app iOS/Android, esportabile anche per il web
packages/core/   Logica e tipi condivisi tra web e app (ricerca, slot, prenotazioni, accesso a Supabase)
supabase/        Schema Postgres versionato, seed demo, test di sicurezza (RLS)
docs/            Studio, requisiti, architettura, roadmap, marketing, legale, guide
```

## 🚀 Avvio rapido

Requisiti: Node ≥ 20, pnpm 10. Guida completa: [docs/10-sviluppo.md](docs/10-sviluppo.md).

```bash
pnpm install
pnpm dev            # sito + web app → http://localhost:3000
pnpm dev:mobile     # app → QR code da aprire con Expo Go sul telefono
```

Senza configurazione tutto gira in **modalità demo** (dati fittizi). Per usare il database reale
(progetto Supabase `ilovewellness-dev`, già popolato):

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env.local
```

Controlli: `pnpm typecheck` · `pnpm test` · `pnpm lint` · `pnpm build` · `pnpm test:db` (Postgres + PostGIS locale).

## ✅ Stato

- [x] Studio di fattibilità e documentazione
- [x] Database su Supabase (Francoforte) con regole di sicurezza e test automatici
- [x] Web: ricerca, schede, prenotazione reale (pagamento in struttura), login, le mie prenotazioni, area operatore
- [x] App mobile: esplora, scheda e prenotazione, le mie prenotazioni, profilo
- [ ] Risposte alle [domande aperte](docs/08-domande-aperte.md), contenuti dal sito WordPress, verifica marchio
- [ ] Onboarding operatori completo, back-office admin, chat, email, Stripe Connect → MVP (vedi [roadmap](docs/04-roadmap-tempi-costi.md))
