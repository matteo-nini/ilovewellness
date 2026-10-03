# ILoveWellness 🌿

**Il benessere di cui ti puoi fidare.** Marketplace (app iOS/Android + web app + sito) che mette in
contatto chi cerca benessere con operatori olistici, insegnanti di yoga e meditazione, SPA, terme e
strutture **verificati**: ricerca su mappa, recensioni reali, chat e prenotazione con pagamento.
Ispirato a **Unobravo** (fiducia, professionisti verificati) e **Airbnb** (marketplace, mappa, recensioni).

Progetto nato dalla rete **Confbenessere**. Stato: **Fase 0 — studio di fattibilità e prototipo**.

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
| ADR | [Decisioni architetturali](docs/adr/) | [0001 Monorepo](docs/adr/0001-monorepo.md) · [0002 Stack](docs/adr/0002-stack-supabase-nextjs-expo.md) |

## 🗂️ Struttura del repository

```
apps/web/        Next.js — sito pubblico + web app (oggi: prototipo cliccabile con dati demo)
apps/mobile/     Expo — app iOS/Android (Fase 2, segnaposto)
supabase/        Schema Postgres versionato, seed demo, test di sicurezza (RLS)
docs/            Studio, requisiti, architettura, roadmap, marketing, legale
```

## 🚀 Avvio rapido

Requisiti: Node ≥ 20, pnpm 10.

```bash
pnpm install
pnpm dev            # http://localhost:3000 — prototipo web
pnpm build && pnpm lint && pnpm typecheck
```

Pagine del prototipo: `/` home · `/cerca` ricerca con filtri e mappa · `/operatori/[slug]` scheda con
prenotazione · `/benessere/[categoria]/[citta]` pagine SEO · `/per-operatori` piani e pre-registrazione.

### Database

Schema in [`supabase/migrations`](supabase/migrations): profili, provider (operatori/strutture),
sedi con geolocalizzazione (PostGIS), servizi, disponibilità, prenotazioni anti-sovrapposizione,
recensioni verificate, chat, verifica documenti, segnalazioni DSA — tutto protetto da Row Level Security.

```bash
# Test su un Postgres locale (serve PostGIS): applica stub Supabase + migrazioni + seed + test
pnpm test:db

# Oppure con Supabase CLI (Docker)
supabase init   # la prima volta: crea supabase/config.toml
supabase start && supabase db reset
```

## ✅ Stato

- [x] Studio di fattibilità e documentazione
- [x] Schema dati MVP + test RLS (30+ verifiche automatiche)
- [x] Prototipo web cliccabile (dati fittizi)
- [ ] Risposte alle [domande aperte](docs/08-domande-aperte.md) e interviste di validazione
- [ ] Brand identity, dominio, marchio
- [ ] Progetto Supabase (UE) + collegamento del web al backend
- [ ] Autenticazione, onboarding operatori, Stripe Connect, chat → MVP (vedi roadmap)
