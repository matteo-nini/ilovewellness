# 10 · Guida allo sviluppo

Come far girare tutto in locale, come è organizzato il codice e come lavorare con Supabase.

## 1. Requisiti

- **Node.js 20+** (consigliato 22) e **pnpm 10** (`corepack enable` lo attiva)
- Per i test del database: **Postgres 15+ con PostGIS** (oppure solo la CI)
- Per l'app sul telefono: l'app **Expo Go** (App Store / Play Store) — vedi [11-app-mobile.md](11-app-mobile.md)

```bash
git clone https://github.com/matteo-nini/ilovewellness.git
cd ilovewellness
pnpm install
```

## 2. Due modalità: demo e live

| | Modalità **demo** | Modalità **live** |
|---|---|---|
| Come si attiva | Nessuna configurazione | File `.env.local` con URL e chiave Supabase |
| Dati | Fittizi, in memoria (`packages/core/src/demo-data.ts`) | Database Supabase `ilovewellness-dev` |
| Login, prenotazioni, area operatore | Simulati / non disponibili | Reali |
| Quando usarla | Presentazioni, sviluppo UI, CI | Sviluppo funzionalità, test end-to-end |

Per passare alla modalità live:

```bash
cp apps/web/.env.example apps/web/.env.local       # sito / web app
cp apps/mobile/.env.example apps/mobile/.env.local # app
```

I file `.env.example` contengono già URL e **chiave pubblica** (publishable) del progetto di
sviluppo. È una chiave pensata per stare nel browser/app: la sicurezza è garantita dalle regole RLS
nel database. La **secret key** (service role) non va mai messa nel codice né nei file `.env` dei client.

## 3. Comandi

| Comando (dalla radice) | Cosa fa |
|---|---|
| `pnpm dev` | Sito + web app su http://localhost:3000 |
| `pnpm dev:mobile` | Avvia l'app (QR code per Expo Go; `w` per aprirla nel browser) |
| `pnpm typecheck` | Controllo dei tipi su core, web e app |
| `pnpm test` | Test unitari della logica condivisa (`packages/core`) |
| `pnpm lint` | Lint del web |
| `pnpm build` | Build di produzione del web |
| `pnpm test:db` | Applica migrazioni + seed su un Postgres locale e verifica permessi e prenotazioni |

## 4. Com'è organizzato il codice

```
packages/core/        ← la logica condivisa: la scriviamo una volta, la usano web e app
  src/types.ts          tipi del dominio (Provider, Service, Booking, …)
  src/catalog.ts        funzioni pure: ricerca demo, slot, fuso orario, formattazione
  src/source.ts         CatalogSource: interfaccia unica con due implementazioni (demo / Supabase)
  src/bookings.ts       prenotazioni, area operatore (sempre via Supabase con la sessione utente)
  src/database.types.ts tipi generati dallo schema del database
apps/web/             ← Next.js 16: sito pubblico + web app + area operatore
  src/app/              una cartella per pagina (App Router)
  src/lib/supabase/     client Supabase lato server (cookie) e lato browser
  src/proxy.ts          rinnova la sessione (in Next 16 "middleware" si chiama "proxy")
apps/mobile/          ← Expo (React Native): app iOS/Android (+ anteprima web)
supabase/             ← database: migrazioni SQL, seed, test
```

Il principio: **le pagine non sanno da dove arrivano i dati.** Chiamano `getCatalog().searchProviders(...)`
(web) o `catalog.searchProviders(...)` (app); dietro c'è `demoSource` o `supabaseSource`. Così si
sviluppa l'interfaccia anche senza rete e si cambia backend senza toccare le pagine.

## 5. Supabase in pratica

### 5.1 Il progetto
- **Nome:** `ilovewellness-dev` · **Regione:** Francoforte (eu-central-1) · **Piano:** Free
- **Pannello:** https://supabase.com/dashboard/project/fxyinntpakccpcopneqh
- Contiene già: schema completo, regole di sicurezza, 8 operatori/strutture demo con servizi e orari.

Ricorda: sul piano Free il progetto **va in pausa dopo 7 giorni senza traffico**; si riattiva dal
pannello con un clic (i dati restano).

### 5.2 Le sezioni del pannello che ti servono
| Sezione | A cosa serve |
|---|---|
| **Table Editor** | Vedere/modificare i dati come in un foglio di calcolo (providers, bookings, …) |
| **SQL Editor** | Eseguire query (es. promuoverti admin, approvare un operatore) |
| **Authentication → Users** | Utenti registrati; si possono creare utenti di test a mano |
| **Authentication → URL Configuration** | *Site URL* e *Redirect URLs* per i link nelle email |
| **Advisors** | Avvisi di sicurezza e prestazioni (controllali dopo ogni migrazione) |
| **Logs** | Errori di API, database, autenticazione |

### 5.3 Prima configurazione (5 minuti, da fare una volta)
1. **Authentication → URL Configuration**: *Site URL* = `http://localhost:3000`; aggiungi in
   *Redirect URLs* `http://localhost:3000/**` (e poi l'indirizzo Vercel quando ci sarà).
2. **Authentication → Providers → Email**: in sviluppo puoi disattivare *Confirm email*, così
   dopo la registrazione si entra subito. Il servizio email incluso in Supabase invia pochissime
   email all'ora: in produzione andrà collegato un SMTP (es. Resend, vedi [09](09-backend-e-costi-servizi.md)).
3. Registrati dal sito (`/accedi`) e poi, nello **SQL Editor**, diventa amministratore:
   ```sql
   update public.profiles set is_admin = true
   where id = (select id from auth.users where email = 'LA-TUA-EMAIL');
   ```

### 5.4 Provare il flusso completo
1. Registrati come cliente e prenota "Trattamento shiatsu" da Giulia Neri (prenotazione *su richiesta*).
2. Per vedere il lato operatore, collega il tuo utente a un operatore demo dallo SQL Editor:
   ```sql
   insert into public.provider_members (provider_id, user_id, role)
   select 'b0000000-0000-0000-0000-000000000002', id, 'owner' from auth.users where email = 'LA-TUA-EMAIL';
   ```
3. Vai su `/area-operatore`: vedrai la richiesta e potrai confermarla o rifiutarla.
4. Oppure crea un nuovo profilo operatore da `/area-operatore` (nasce in *bozza*), invialo in
   verifica e approvalo dallo SQL Editor (che lavora come proprietario del database, quindi
   le protezioni pensate per gli utenti dell'app non si applicano):
   ```sql
   update public.providers set verification_status = 'verified', verified_at = now()
   where slug = 'SLUG-DEL-PROVIDER';
   ```
   Nell'app lo farà il back-office admin tramite la funzione `set_provider_verification`.

### 5.5 Cambiare lo schema del database
1. Crea un nuovo file in `supabase/migrations/` con data e nome, es. `20261010120000_preferiti.sql`.
2. Scrivi **solo cambiamenti non distruttivi** quando possibile (aggiungere colonne/tabelle).
3. Aggiungi un test in `supabase/tests/10_rls_and_booking.sql` e lancia `pnpm test:db`.
4. Applica al progetto: dallo **SQL Editor** (incolla il file) oppure con la CLI:
   ```bash
   npx supabase login
   npx supabase link --project-ref fxyinntpakccpcopneqh
   npx supabase db push
   ```
5. Rigenera i tipi TypeScript:
   ```bash
   npx supabase gen types typescript --project-id fxyinntpakccpcopneqh > packages/core/src/database.types.ts
   ```
6. Controlla **Advisors → Security**.

> Le migrazioni già applicate al progetto di sviluppo sono quelle in `supabase/migrations/`
> (init, storage, hardening, search_details, location_coords).

## 6. Pubblicare il web (anteprima online)

1. Su https://vercel.com → *Add New Project* → importa il repository GitHub.
2. **Root Directory:** `apps/web` (Vercel riconosce pnpm e il monorepo).
3. **Environment Variables:** `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   (stessi valori di `.env.example`). Senza variabili il sito va online in modalità demo.
4. Aggiungi l'indirizzo Vercel tra le *Redirect URLs* di Supabase.

Per uso commerciale serve il piano Pro di Vercel (vedi [09](09-backend-e-costi-servizi.md)); per
anteprime private di sviluppo l'Hobby va bene.

## 7. Stato e prossimi passi

| Fatto ✅ | Da fare (in ordine suggerito) |
|---|---|
| Ricerca, schede, slot reali dal DB | Onboarding operatore completo: sedi (con geocoding), servizi, orari, foto |
| Registrazione/login (email + password) | Back-office admin: coda verifiche, segnalazioni |
| Prenotazione con pagamento in struttura | Chat (Supabase Realtime) |
| Le mie prenotazioni + annullamento | Email transazionali (conferma, promemoria) |
| Area operatore: conferma/rifiuta/svolta | Pagamenti online con Stripe Connect |
| App mobile con le stesse funzioni cliente | Recensioni dall'interfaccia (lo schema è pronto) |
| Test su DB, logica condivisa, CI | Mappa interattiva (MapLibre) |
