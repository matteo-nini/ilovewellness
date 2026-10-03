# 09 · Serve Supabase? Backend e costi dei servizi

> Prezzi indicativi rilevati a **ottobre 2026** (listini pubblici e guide di confronto). I fornitori
> li cambiano spesso: verificarli sulle pagine ufficiali prima di firmare. Cambio usato: 1 $ ≈ 0,92 €.

## 1. In breve

- **Supabase non è obbligatorio.** Un'app come ILoveWellness ha bisogno di un **backend**: database,
  login degli utenti, archivio per foto e documenti, chat in tempo reale, un posto sicuro dove girano
  i pagamenti. Supabase è **uno dei modi** per averlo, non l'unico.
- **L'abbiamo scelto perché è il modo più economico e veloce** per avere tutto questo con un team
  piccolo: un servizio solo, gestito, con server in UE. Le alternative (sotto) costano di più in
  sviluppo, oppure vincolano di più.
- **Non sei tu a doverlo usare.** Supabase lo usano gli sviluppatori. A te (o all'associazione o alla
  società) servono solo tre cose:
  1. **Essere proprietario degli account**: Supabase, Vercel, Stripe, Apple, Google e il dominio devono
     essere intestati al progetto, con la tua carta o quella della società. Gli sviluppatori si
     aggiungono come membri del team e si rimuovono quando serve. È la regola più importante: chi
     possiede gli account possiede il prodotto.
  2. **Guardare i dati quando serve**: Supabase ha un pannello web dove le tabelle si sfogliano come un
     foglio Excel (utenti, operatori, prenotazioni). In più, nell'app ci sarà un back-office pensato per
     te (verifica operatori, segnalazioni, statistiche).
  3. **Pagare le fatture e controllare i consumi**: ogni servizio ha un tetto di spesa configurabile.

## 2. Cosa fa il backend (e cosa fa Supabase per noi)

| Funzione necessaria | Con Supabase | Senza Supabase servirebbe… |
|---|---|---|
| Database (utenti, operatori, prenotazioni, recensioni) | Postgres incluso | Un database gestito (Neon, AWS RDS…) |
| Login con email, Google, Apple | Supabase Auth | Auth0/Clerk (a pagamento) o codice nostro |
| Foto e documenti di verifica | Supabase Storage | AWS S3/Cloudflare R2 + permessi da scrivere |
| Chat in tempo reale | Supabase Realtime | Pusher/Ably o un server WebSocket |
| Logica sicura (pagamenti, webhook Stripe, promemoria) | Edge Functions | Un server API da sviluppare e tenere acceso |
| Ricerca "vicino a me" | PostGIS incluso | Uguale, ma da installare |
| Backup giornalieri | Inclusi nel Pro | Da configurare |

Lo schema già scritto in questa repo (`supabase/migrations`) è **Postgres standard**: se un domani si
volesse lasciare Supabase, i dati e la struttura si spostano su qualsiasi altro Postgres. Il vincolo
("lock-in") è basso.

## 3. Alternative a confronto

| Opzione | Costo servizio (MVP) | Costo di sviluppo | Pro | Contro | Quando ha senso |
|---|---|---|---|---|---|
| **Supabase** (scelta attuale) | 0 € in sviluppo, ~25 $/mese in produzione | Base | Tutto in uno, UE, Postgres standard, pannello semplice | Serve uno sviluppatore che lo conosca (sono molti) | Il caso standard per questo progetto |
| **Firebase** (Google) | 0 € all'inizio, poi a consumo (letture/scritture) | Simile | Molto diffuso tra gli sviluppatori di app | Database NoSQL poco adatto a ricerche e report da marketplace; costi meno prevedibili; lock-in alto | Se il team conosce solo Firebase |
| **Backend su misura** (es. Node/NestJS o Django + Postgres su Render/Railway/AWS) | 20–100 €/mese | **+2–3 mesi** di sviluppo (≈ +20–40k €) | Controllo totale | Più tempo, più manutenzione, più rischi di sicurezza | Con un team tecnico già strutturato |
| **Sharetribe** (marketplace pronto) | Build gratis per prototipare, poi ~99–299 $/mese a seconda del piano | Molto basso per partire | Marketplace funzionante in poche settimane, anche senza programmatori | Personalizzazione limitata, niente app native vere, costo che cresce, da rifare per scalare | **Per validare l'idea** prima di investire nello sviluppo |
| **No-code generico** (Bubble, FlutterFlow) | 30–150 $/mese | Basso-medio | Costruibile da non programmatori | Prestazioni, lock-in forte, SEO debole, migrazione difficile | Prototipi interni |

**Raccomandazione.**
- **Se avete (o troverete) uno sviluppatore:** Supabase. È la scelta con il miglior rapporto
  tempo/costo e non richiede competenze tecniche da parte tua.
- **Se volete testare il mercato subito, senza sviluppatori:** Sharetribe per 2–3 mesi nella zona
  pilota, usando questa documentazione come specifica. Poi, con i dati in mano, si sviluppa la
  piattaforma vera (Supabase + Next.js + Expo) e si migrano operatori e utenti.

## 4. Tutti i costi ricorrenti della piattaforma

### 4.1 Servizi tecnici

| Servizio | A cosa serve | Piano iniziale | Quando si sale | Costo indicativo |
|---|---|---|---|---|
| **Supabase** | Database, login, file, chat, funzioni | Free (sviluppo) → **Pro** al lancio | Team solo con requisiti aziendali (SSO, SOC2) | Free 0 € (2 progetti, 500 MB DB, 50k utenti/mese; **si mette in pausa dopo 7 giorni di inattività**, quindi non va bene in produzione) · **Pro 25 $/mese** (8 GB DB, 100 GB file, 250 GB traffico, 100k utenti attivi/mese, backup) + eventuale potenza extra (Small +5 $, Medium +50 $) · un 2° progetto di staging ≈ +10 $/mese · Team 599 $/mese |
| **Vercel** | Hosting di sito e web app | **Pro** (il piano Hobby gratuito **non è consentito per uso commerciale**) | Al crescere del traffico | 20 $/mese per membro del team (1–2 membri bastano) + eventuale consumo extra |
| **Expo EAS** | Compilazione e pubblicazione delle app | Free in fase 1 → Starter in fase 2 | Production con molti rilasci | Free 0 € · Starter ≈ 19 $/mese · Production ≈ 199 $/mese |
| **Apple Developer** | Pubblicare su App Store | — | — | 99 $/anno |
| **Google Play Console** | Pubblicare su Play Store | — | — | 25 $ una tantum |
| **Resend** (o Postmark) | Email transazionali (conferme, promemoria) | Free (≈3.000 email/mese) | Oltre le soglie | ≈ 20 $/mese |
| **Mappe** (MapTiler/Mapbox) | Mappa interattiva nella ricerca | Free tier | Oltre ~100k caricamenti/mese | 0–50 €/mese |
| **Sentry** | Segnalazione errori | Free (1 sviluppatore) | Team | ≈ 26 $/mese |
| **PostHog EU** | Statistiche d'uso (con consenso) | Free (≈1M eventi/mese) | Oltre le soglie | 0–50 $/mese |
| **GitHub** | Codice, CI | Free (organizzazione) | Team per più permessi | 0 € (o 4 $/utente/mese) |
| **Dominio** `.it` + `.com` | Indirizzo web | — | — | ≈ 30 €/anno |
| **Email aziendale** (Google Workspace/Microsoft 365) | info@, supporto@ | — | — | ≈ 6–12 €/utente/mese |
| **Banner cookie e consensi** (es. iubenda, Cookiebot) | GDPR | — | — | ≈ 30–150 €/anno |

### 4.2 Costi legati alle transazioni (Stripe)

Questi costi **crescono solo se si incassa**: si pagano su ogni prenotazione online.

| Voce | Costo indicativo (Stripe, carte UE) |
|---|---|
| Pagamento con carta europea | ≈ 1,5% + 0,25 € a transazione (carte extra-UE e alcune carte business costano di più) |
| Stripe Connect (account degli operatori) | ≈ 2 € per operatore **attivo** al mese (solo nei mesi in cui riceve pagamenti) + ≈ 0,25% + 0,10 € per bonifico all'operatore |
| Rimborsi | La commissione della transazione originale non viene restituita |
| Contestazioni (chargeback) | ≈ 15–20 € ciascuna |

Esempio: una prenotazione da 60 € con commissione ILoveWellness del 12% (7,20 €) →
costo Stripe ≈ 1,15 € → **margine ≈ 6 €**, prima degli altri costi. Si può decidere se assorbire il
costo Stripe o ribaltarlo in parte sull'operatore.

### 4.3 Riepilogo mensile per fase

| Fase | Servizi tecnici | Note |
|---|---|---|
| **Sviluppo e prototipo** (mesi 0–5) | **≈ 20–60 €/mese** | Supabase Free, Vercel Pro 1 membro, resto gratuito |
| **Lancio pilota web** (mesi 5–9) | **≈ 80–150 €/mese** | Supabase Pro + staging, Vercel Pro, email, mappe, Sentry; + Apple 99 $/anno |
| **App sugli store e crescita** (mesi 9–18) | **≈ 150–400 €/mese** | + Expo Starter, più traffico e utenti |
| **Scala nazionale** (100k+ utenti) | **≈ 500–1.500 €/mese** | Potenza database superiore, più traffico, piani team |
| **+ Stripe** | ≈ 2–2,5% dell'incassato online | Variabile, proporzionale alle prenotazioni |

In proporzione al budget del primo anno (225k–400k €, vedi [04](04-roadmap-tempi-costi.md)) i servizi
tecnici pesano **meno dell'1%**: il costo vero sono le persone (sviluppo, onboarding operatori,
marketing), non l'infrastruttura.

## 5. E l'hosting SiteGround che abbiamo già?

SiteGround offre PostgreSQL dal pannello Site Tools (*Site → PostgreSQL*). Ma **un database
PostgreSQL non equivale a Supabase**: Supabase è un database **più** tutto quello che sta intorno.

### 5.1 Cosa offre ciascuno

| Pezzo necessario all'app | SiteGround (hosting condiviso) | Supabase |
|---|---|---|
| Database PostgreSQL | ✅ Sì, condiviso con altri clienti | ✅ Sì, istanza dedicata al progetto |
| **PostGIS** (ricerca "vicino a me") | ⚠️ Probabilmente no: sull'hosting condiviso non si hanno i permessi per installare estensioni (da verificare col supporto) | ✅ Incluso |
| **API** che web e app possono chiamare | ❌ Va scritta da noi (es. PHP/Laravel) e mantenuta | ✅ Generata automaticamente dallo schema (REST + RPC) |
| **Login** (email, Google, Apple), reset password, sessioni | ❌ Da sviluppare | ✅ Incluso |
| **Sicurezza** per riga (RLS) usabile dalle app | ⚠️ Postgres la supporta, ma senza un'API che passi l'identità dell'utente va reimplementata nel codice del backend | ✅ Integrata: le regole che abbiamo già scritto funzionano così come sono |
| **Chat in tempo reale** (WebSocket) | ❌ L'hosting condiviso non mantiene connessioni aperte né processi sempre attivi | ✅ Realtime incluso |
| Archivio foto e documenti con permessi | ⚠️ Cartelle sul server, permessi da scrivere a mano | ✅ Storage con regole |
| Funzioni server (webhook Stripe, promemoria programmati) | ⚠️ Script PHP + cron | ✅ Edge Functions + cron |
| Gestione dei picchi di connessioni (pooling) | ⚠️ Limiti del piano condiviso, non configurabili | ✅ Pooler incluso (Supavisor) |
| Backup | ✅ Backup giornalieri del sito | ✅ Backup giornalieri (Pro), ripristino puntuale a pagamento |
| Costo | Già pagato | 0 € in sviluppo, 25 $/mese in produzione |

In pratica, usando SiteGround dovremmo **costruire da zero il backend**: API, autenticazione,
permessi, upload, notifiche. Sono le cose che la [tabella del §3](#3-alternative-a-confronto) stima in
**+2–3 mesi di sviluppo (≈ 20–40k €)**: molto più dei 25 $/mese risparmiati. E la chat in tempo
reale su hosting condiviso non si può fare bene.

### 5.2 Prestazioni e accessi contemporanei

Cosa significa davvero "migliaia di accessi":
- **Utenti registrati ≠ utenti contemporanei ≠ query contemporanee.** 10.000 utenti attivi al mese
  in un marketplace di questo tipo producono, nell'ora di punta, qualche decina di persone
  connesse insieme e **poche richieste al secondo** al database. Il pilota sarà ben sotto.
- **PostgreSQL gestisce la concorrenza con un processo per connessione** e regge benissimo letture
  e scritture parallele; i vincoli che abbiamo messo (es. il blocco delle doppie prenotazioni) sono
  garantiti dal database anche con molte richieste simultanee.
- **Il collo di bottiglia sono le connessioni**, non i "thread": ogni connessione costa memoria.
  Le app mobili e le funzioni serverless aprono molte connessioni brevi. Per questo serve un
  *connection pooler* che le raccolga: in Supabase c'è già; sull'hosting condiviso il numero di
  connessioni e la CPU sono limitati dal piano e divisi con altri siti, e non si possono ampliare.

| | SiteGround condiviso | Supabase Pro (istanza base) | Supabase con istanza più grande |
|---|---|---|---|
| Risorse | Condivise, quota del piano | 2 core ARM, 1 GB RAM dedicati al DB | Da Small a 16XL, si alza dal pannello senza migrare |
| Connessioni | Limitate dal piano (da verificare) | 60 dirette + pooler per centinaia di client | Crescono con l'istanza |
| Scalare | Cambiare piano o passare a un server dedicato e **migrare** | Un clic, pochi minuti di riavvio | — |
| Ottimizzato per | Siti WordPress/PHP | API per app e web | — |

Per il pilota **entrambi reggerebbero il carico**: la differenza vera non è la velocità grezza ma
tutto ciò che manca intorno al database e la possibilità di crescere senza migrare.

### 5.3 Come usare SiteGround nel progetto

Non è da buttare. Ha senso usarlo per ciò in cui è forte:
- il **sito istituzionale di Confbenessere** (WordPress), blog e landing di campagna;
- **email** aziendali e **dominio**/DNS;
- eventualmente la **versione web demo dell'app** (file statici, vedi [11](11-app-mobile.md#a-versione-web-dellapp-la-più-rapida-per-una-presentazione)).

Il cuore dell'app (database, login, prenotazioni, chat) resta su Supabase. Se in futuro si volesse
uscire da un servizio esterno, l'alternativa sensata non è l'hosting condiviso ma **Supabase
installato su un server virtuale** (VPS, es. 10–30 €/mese): stesso codice, più lavoro di gestione.

> Da verificare con il supporto SiteGround prima di escludere definitivamente l'opzione: versione
> di PostgreSQL, disponibilità di PostGIS, accesso remoto al database, limite di connessioni del
> piano, supporto ad applicazioni Node.js sempre attive.

## 6. Checklist account da aprire (a nome del progetto)

- [ ] Organizzazione GitHub (`ilovewellness`) — gratis
- [ ] Supabase: organizzazione + progetto `ilovewellness-prod` in regione **Frankfurt (eu-central-1)** e `ilovewellness-staging`
- [ ] Vercel: team Pro collegato all'organizzazione GitHub
- [ ] Stripe: account della società, attivazione **Connect**
- [ ] Apple Developer (serve il D-U-N-S della società) e Google Play Console — solo in fase 2
- [ ] Dominio e email aziendale
- [ ] Gestore password condiviso (es. Bitwarden/1Password) per non perdere gli accessi

## Fonti

- Supabase, piani 2026: https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/ · https://toolradar.com/blog/supabase-pricing-2026 · https://focusreactive.com/blog/supabase-price/
- Vercel, piani 2026 e limite uso commerciale Hobby: https://dev.to/nayankyada/vercel-pricing-2026-what-you-actually-pay-for-a-real-nextjs-project-33md · https://schematichq.com/blog/vercel-pricing
- Firebase, prezzi 2026: https://www.budgetforge.dev/tools/firebase-pricing-2026
- SiteGround, PostgreSQL in Site Tools: https://www.siteground.com/kb/postgresql-manager · https://www.siteground.com/kb/what_databases_can_i_use_with_my_account
- Sharetribe, piani: https://findstack.com/products/sharetribe/pricing · https://www.capterra.com/p/162942/Sharetribe/
- Stripe, Expo, Resend, Sentry, PostHog, MapTiler, Apple, Google: listini pubblici dei fornitori (valori indicativi da verificare)
