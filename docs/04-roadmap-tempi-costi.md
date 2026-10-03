# 04 · Roadmap, tempi, team e costi

> Le stime sono ordini di grandezza per decidere, non preventivi. Vanno ricalibrate dopo la
> Fase 0 e con il team effettivo.

## 1. Fasi

```
Mese:      0    1    2    3    4    5    6    7    8    9   10   11   12  ...  18
Fase 0  ██████████                                                    Discovery & validazione
Fase 1            ██████████████████████                              MVP web (pilota)
Lancio                                  ▲ beta chiusa  ▲ lancio pubblico Bologna/ER
Fase 2                                  ███████████████               App native + crescita
Fase 3                                                 ████████████████████  Scala & nuove linee
```

### Fase 0 — Discovery e validazione (mesi 0–2)
Obiettivo: decidere *go/no-go* con dati, non con opinioni.
- Chiarimento del finanziamento e della struttura societaria (doc [07](07-finanziamento.md)).
- 20–30 interviste a operatori, 30–50 a potenziali utenti; test di disponibilità a pagare la commissione/abbonamento.
- Brand identity (logo, palette, tono di voce), verifica marchio e domini.
- Landing page con lista d'attesa e pre-registrazione operatori → obiettivo **100 operatori pre-registrati** nell'area pilota.
- Prototipo cliccabile (già avviato in `apps/web`) da usare nelle interviste.
- Selezione team tecnico; setup legale (vedi doc [06](06-legale-compliance.md)).

### Fase 1 — MVP web (mesi 2–6)
Tutti i requisiti **M** di [02-requisiti.md](02-requisiti.md), web responsive (installabile come PWA).

| Sprint (2 sett.) | Contenuto |
|---|---|
| 1 | Setup progetto, CI/CD, design system, autenticazione, profili |
| 2 | Onboarding operatore, servizi, sedi, upload foto |
| 3 | Ricerca con filtri + mappa, schede pubbliche, pagine SEO |
| 4 | Disponibilità e calendario, motore degli slot |
| 5 | Prenotazione + Stripe Connect (checkout, payout, rimborsi) |
| 6 | Chat realtime, notifiche email |
| 7 | Recensioni, preferiti, back-office verifica e moderazione |
| 8 | Hardening: accessibilità, sicurezza, test E2E, DPIA, contenuti legali |
| 9 | **Beta chiusa** con 30–50 operatori della rete + utenti invitati |
| 10 | Correzioni e **lancio pubblico** nell'area pilota |

### Fase 2 — App native e crescita (mesi 6–10)
- App iOS/Android con Expo (riuso di logica e tipi), push notification, pubblicazione sugli store.
- Classi di gruppo, pacchetti/carnet, eventi e ritiri, gift card, abbonamenti Pro.
- Sincronizzazione calendari, statistiche operatore.
- Marketing di performance + partnership locali.

### Fase 3 — Scala (mesi 10–18)
- Espansione geografica (città per città, replicando il playbook del pilota).
- Sessioni online in videochiamata, questionario di orientamento/matching.
- Canale B2B welfare aziendale; integrazione con piattaforme welfare.
- Versione inglese per turismo del benessere.

## 2. Team

| Ruolo | Fase 0 | Fase 1 | Fase 2–3 | Note |
|---|---|---|---|---|
| Product owner / founder | ✔ | ✔ | ✔ | Il promotore: visione, rete, istituzioni |
| Tech lead / CTO (full-stack TS) | part-time | ✔ | ✔ | Figura chiave: idealmente socio |
| Sviluppatore full-stack | | ✔ | ✔ | |
| Sviluppatore mobile (React Native) | | | ✔ | Può coincidere con il full-stack |
| Product designer UX/UI | ✔ | ✔ (50%) | part-time | |
| Community / onboarding operatori | ✔ | ✔ | ✔ | Cruciale per l'offerta: telefonate, visite, foto |
| Marketing & contenuti | part-time | part-time | ✔ | SEO, social, PR |
| Legale/privacy, commercialista | consulenza | consulenza | consulenza | |

## 3. Costi indicativi

### Sviluppo MVP (Fase 0 + Fase 1)

| Modello | Costo | Pro | Contro |
|---|---|---|---|
| **Team snello interno** (tech lead + 1 dev + designer part-time, 6 mesi) | **€70k–€110k** (+ eventuale equity al tech lead) | Know-how resta in casa, iterazioni rapide | Serve trovare le persone giuste |
| **Agenzia/software house** | **€100k–€150k** | Tempi certi, team già rodato | Costo, dipendenza, manutenzione extra |
| **Ibrido**: agenzia per MVP + assunzione progressiva | €110k–€160k | Transizione graduale | Passaggio di consegne da gestire |
| **No-code (Sharetribe) per test di mercato** | €5k–€20k + €100–€300/mese | Validazione in 4–8 settimane | Da rifare per scalare; app native limitate |

### Primo anno completo (ordine di grandezza)

| Voce | Importo |
|---|---|
| Sviluppo (MVP + app native + evoluzioni) | €120k–€200k |
| Design e brand | €10k–€25k |
| Infrastruttura e servizi SaaS | €3k–€6k |
| Legale, privacy (DPIA, contratti, T&C), commercialista | €8k–€15k |
| Marketing di lancio (area pilota) | €30k–€60k |
| Community/onboarding operatori | €25k–€40k |
| Contingenza (15%) | €30k–€50k |
| **Totale anno 1** | **≈ €225k–€400k** |

Il finanziamento pubblico, se confermato, dovrebbe coprire almeno l'MVP e il pilota; la crescita
successiva va finanziata con ricavi, bandi per startup (Smart&Start Italia, fondi regionali,
CDP Venture) o investitori — vedi [07-finanziamento.md](07-finanziamento.md).

## 4. Milestone misurabili

| Milestone | Quando | Criterio di successo |
|---|---|---|
| M0 Validazione | mese 2 | ≥ 100 operatori pre-registrati, ≥ 500 utenti in lista d'attesa, finanziamento chiarito |
| M1 Beta chiusa | mese 5 | 30 operatori attivi, 100 prenotazioni reali |
| M2 Lancio pilota | mese 6 | Pagamenti live, app web pubblica, 150 operatori attivi |
| M3 App sugli store | mese 9 | Rating store ≥ 4,5 |
| M4 Go/no-go espansione | mese 12 | KPI dello studio di fattibilità §9 raggiunti |
