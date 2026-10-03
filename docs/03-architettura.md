# 03 · Architettura tecnica

## 1. Principi

1. **Una sola lingua (TypeScript) e un solo modello dati** per sito, web app e app mobile.
2. **Servizi gestiti** al posto di infrastruttura custom: il team deve passare il tempo sul prodotto, non sui server.
3. **Sicurezza nel database**: le regole di accesso stanno in Postgres (Row Level Security), così valgono per web, app e qualsiasi client futuro.
4. **Dati in UE** e conformità GDPR by design.
5. **Rimandare la complessità**: niente microservizi, niente Kubernetes. Un monolite modulare ben fatto regge facilmente le prime centinaia di migliaia di utenti.

## 2. Stack scelto

| Livello | Tecnologia | Perché |
|---|---|---|
| Sito pubblico + web app | **Next.js** (App Router, React, TypeScript) | SSR/SSG per la SEO (pagine città × disciplina, schede operatori), stesso codice per area riservata |
| App iOS/Android | **Expo (React Native)** | Una codebase per due store, aggiornamenti OTA, condivide tipi e logica col web |
| UI | Tailwind CSS (web) · NativeWind (app) · design token condivisi | Coerenza visiva, velocità |
| Backend | **Supabase**: Postgres 15+, Auth, Storage, Realtime, Edge Functions | Postgres vero (no lock-in sul dato), Auth con Google/Apple, chat in tempo reale, regione UE |
| Geo-ricerca | **PostGIS** (incluso in Supabase) | "Vicino a me", raggio, bounding box della mappa |
| Ricerca testuale | Postgres full-text (`unaccent` + dizionario italiano) → Meilisearch/Typesense quando servirà | Partire semplici |
| Pagamenti | **Stripe Connect** (account Express) | Marketplace con split, KYC/AML degli operatori a carico di Stripe, niente licenza di istituto di pagamento, supporto alla reportistica |
| Mappe | Mapbox o MapLibre + tile OpenStreetMap (MapTiler) | Costi prevedibili |
| Email transazionali | Resend o Postmark | Deliverability |
| Push | Expo Notifications (APNs/FCM) | Integrato con Expo |
| Videochiamate (fase 3) | Daily.co o LiveKit | Sessioni online stile Unobravo |
| Hosting web | Vercel (regione `fra1`) | Deploy da Git, preview per ogni PR |
| Osservabilità | Sentry · PostHog EU (con consenso) · log Supabase | |
| CI/CD | GitHub Actions + Vercel + EAS Build/Submit | |

Costo infrastruttura stimato in MVP: **€100–€300/mese** (Supabase Pro, Vercel Pro, Expo EAS,
Mapbox/MapTiler, Resend, Sentry) + commissioni Stripe (~1,5% + €0,25 per carte UE) + account
sviluppatore Apple (99 $/anno) e Google (25 $ una tantum).

## 3. Vista d'insieme

```
            ┌──────────────────────┐      ┌──────────────────────┐
            │  App iOS / Android   │      │ Sito + Web app       │
            │  (Expo, apps/mobile) │      │ (Next.js, apps/web)  │
            └──────────┬───────────┘      └──────────┬───────────┘
                       │  supabase-js / API tipizzata │
                       └──────────────┬───────────────┘
                                      ▼
   ┌──────────────────────────── Supabase (UE) ────────────────────────────┐
   │  Auth (email, Google, Apple)   Storage (foto, documenti verifica)     │
   │  Postgres + PostGIS + RLS      Realtime (chat, stato prenotazioni)    │
   │  Edge Functions: checkout, webhook Stripe, promemoria, notifiche      │
   └──────────────┬──────────────────────────────┬─────────────────────────┘
                  ▼                              ▼
         Stripe Connect                 Resend / Expo Push
```

## 4. Modello dati (MVP)

Lo schema completo e commentato è in
[`supabase/migrations/20261003000000_init.sql`](../supabase/migrations/20261003000000_init.sql).

| Tabella | Contenuto |
|---|---|
| `profiles` | Estende `auth.users`: nome, avatar, città, ruolo admin |
| `categories` | Albero di discipline/categorie (es. *Yoga › Hatha*, *SPA › Day spa*) |
| `providers` | Operatore individuale **o** struttura (`kind`), stato di verifica, dati fiscali, account Stripe, rating aggregato |
| `provider_members` | Utenti che gestiscono un provider (owner/staff) — abilita le strutture multi-operatore |
| `provider_categories` | Discipline praticate (N:N) |
| `locations` | Sedi con indirizzo e punto geografico PostGIS |
| `services` | Servizi prenotabili: durata, prezzo, modalità (presenza/online/domicilio), capienza, policy di cancellazione |
| `availability_rules` / `availability_exceptions` | Disponibilità ricorrenti settimanali ed eccezioni |
| `bookings` | Prenotazioni con stato, prezzo congelato, commissione, riferimenti Stripe; **vincolo di esclusione** contro le sovrapposizioni |
| `reviews` | Una recensione per prenotazione completata, con risposta dell'operatore |
| `conversations` / `messages` | Chat 1:1 utente ↔ provider |
| `favorites` | Preferiti |
| `verification_documents` | Documenti di verifica (file su Storage privato) |
| `reports` | Segnalazioni DSA su profili, recensioni, messaggi |

Decisioni rilevanti:
- **Prezzi in centesimi** (`integer`) per evitare errori di arrotondamento.
- **Prezzo e commissione congelati nella prenotazione**: se l'operatore cambia listino, lo storico non cambia.
- **Doppie prenotazioni impossibili** per costruzione: vincolo `EXCLUDE USING gist` sull'intervallo temporale per i servizi individuali.
- **Rating aggregato denormalizzato** su `providers`, aggiornato da trigger (ordinamento veloce).
- **Recensioni verificate** per costruzione: la tabella referenzia una prenotazione `completed` del recensore.

## 5. Sicurezza e privacy

- RLS attiva su **tutte** le tabelle; i test in [`supabase/tests`](../supabase/tests) verificano le regole principali.
- Bucket Storage separati: `public-media` (foto profili) e `verification-docs` (privato, accesso solo owner e admin, URL firmati a scadenza).
- Operazioni sensibili (pagamenti, cambio stato prenotazione con rimborso, verifica operatori) solo da Edge Functions con chiave di servizio, mai dal client.
- Webhook Stripe firmati e idempotenti.
- MFA obbligatoria per admin.
- Minimizzazione: la chat può contenere dati sulla salute (art. 9 GDPR) → informativa chiara, conservazione limitata (es. 24 mesi), nessun uso per profilazione.

## 6. Organizzazione del codice (monorepo)

```
ilovewellness/
├── apps/
│   ├── web/        # Next.js: sito pubblico + web app + area operatore + admin
│   └── mobile/     # Expo: app iOS/Android (fase 2)
├── packages/       # (quando servirà) ui, config, tipi generati da Supabase, logica condivisa
├── supabase/
│   ├── migrations/ # schema SQL versionato
│   ├── tests/      # test SQL di schema e RLS
│   └── seed.sql    # dati di esempio per sviluppo
└── docs/           # questa documentazione + ADR
```

Perché monorepo e non più repository separati: vedi [ADR-0001](adr/0001-monorepo.md).

## 7. Ambienti

| Ambiente | Web | Database | Pagamenti |
|---|---|---|---|
| Locale | `pnpm dev` | Supabase CLI locale (Docker) | Stripe test |
| Preview | Vercel preview per ogni PR | Supabase branch | Stripe test |
| Staging | `staging.ilovewellness.it` | Progetto Supabase staging | Stripe test |
| Produzione | `ilovewellness.it` | Progetto Supabase prod (Francoforte) | Stripe live |
