# 02 · Requisiti di prodotto

> Priorità con metodo **MoSCoW**: **M** = Must (MVP), **S** = Should (subito dopo l'MVP),
> **C** = Could (fasi successive), **W** = Won't (per ora, escluso esplicitamente).

## 1. Attori e ruoli

| Ruolo | Descrizione |
|---|---|
| **Ospite** | Visitatore non registrato: può cercare, vedere schede e recensioni |
| **Utente** (cliente) | Registrato: prenota, paga, chatta, recensisce, salva preferiti |
| **Operatore** | Professionista individuale (yoga, naturopatia, massaggi, ecc.) |
| **Struttura** | SPA, centro benessere, studio, terme, centro ritiri; può avere più operatori/staff |
| **Staff di struttura** | Membro di una struttura che gestisce agenda e chat (permessi limitati) |
| **Moderatore / Admin** | Team ILoveWellness: verifica operatori, modera contenuti e recensioni, gestisce dispute |

Un account può avere più ruoli (es. un'insegnante di yoga che prenota anche un massaggio).

## 2. Requisiti funzionali

### 2.1 Registrazione e profilo
| ID | Requisito | Pr. |
|---|---|---|
| F-01 | Registrazione utente con email + password, Google e Apple Sign-In | M |
| F-02 | Verifica email; recupero password | M |
| F-03 | Profilo utente: nome, foto, città, preferenze (discipline di interesse) | M |
| F-04 | Consensi GDPR separati (termini, privacy, marketing, profilazione) e loro revoca | M |
| F-05 | Cancellazione account ed export dati (art. 17 e 20 GDPR) | M |
| F-06 | Onboarding operatore a step: dati anagrafici e fiscali, discipline, bio, foto, sede/i, servizi e prezzi, disponibilità, dati di pagamento (Stripe Connect) | M |
| F-07 | Onboarding struttura con più sedi, più operatori/staff e ruoli | S |
| F-08 | Questionario di orientamento "Cosa stai cercando?" che suggerisce categorie (stile Unobravo, **senza** finalità diagnostiche) | S |

### 2.2 Verifica e fiducia
| ID | Requisito | Pr. |
|---|---|---|
| F-10 | Caricamento documenti operatore: identità, attestati di formazione, iscrizione ad associazione professionale (L. 4/2013), polizza RC | M |
| F-11 | Workflow di verifica in back-office (in attesa → verificato / respinto con motivazione) e **badge "Verificato"** | M |
| F-12 | Tracciabilità dei venditori professionali (DSA art. 30): ragione sociale, P.IVA, contatti | M |
| F-13 | Segnalazione di profili/contenuti illeciti (notice & action, DSA art. 16) | M |
| F-14 | Riverifica periodica (scadenza polizza/iscrizioni) con promemoria automatico | C |

### 2.3 Ricerca e scoperta (stile Airbnb)
| ID | Requisito | Pr. |
|---|---|---|
| F-20 | Ricerca per testo, categoria/disciplina, luogo (città, "vicino a me", raggio km) | M |
| F-21 | Filtri: data/fascia oraria, prezzo, durata, valutazione, in presenza / online / a domicilio, lingue, solo verificati | M |
| F-22 | Risultati in **lista + mappa** sincronizzate | M |
| F-23 | Scheda operatore/struttura: galleria, bio, discipline, formazione, badge, servizi con prezzi e durate, sedi su mappa, recensioni, prossime disponibilità | M |
| F-24 | Preferiti (cuore) e liste | S |
| F-25 | Pagine SEO per città × disciplina (es. "/yoga/bologna") generate dal catalogo | M |
| F-26 | Eventi e ritiri con date, posti disponibili, biglietti | S |
| F-27 | Criteri di ranking pubblici e dichiarazione dei contenuti sponsorizzati (Reg. UE 2019/1150 "P2B", DSA) | M |

### 2.4 Prenotazioni e calendario
| ID | Requisito | Pr. |
|---|---|---|
| F-30 | L'operatore definisce disponibilità ricorrenti, eccezioni (ferie), buffer tra appuntamenti, anticipo minimo | M |
| F-31 | Prenotazione istantanea o **su richiesta** (l'operatore accetta entro X ore) a scelta dell'operatore | M |
| F-32 | Prevenzione doppie prenotazioni (vincolo a livello di database) | M |
| F-33 | Politiche di cancellazione configurabili (flessibile / moderata / rigida) | M |
| F-34 | Riprogrammazione e cancellazione da entrambe le parti, con notifica | M |
| F-35 | Promemoria automatici (email/push) 24 h e 2 h prima | M |
| F-36 | Classi di gruppo con capienza (es. lezione yoga 12 posti) | S |
| F-37 | Pacchetti e carnet (es. 10 lezioni) | S |
| F-38 | Sincronizzazione calendario Google/Apple (ICS in uscita, poi bidirezionale) | S |
| F-39 | Sessioni online in videochiamata integrata (come Unobravo) | C |

### 2.5 Pagamenti
| ID | Requisito | Pr. |
|---|---|---|
| F-40 | Pagamento in app con carta, Apple Pay, Google Pay (Stripe Connect, conto "Express" per operatore) | M |
| F-41 | Opzione "paghi in struttura" per gli operatori che lo preferiscono | M |
| F-42 | Trattenuta automatica della commissione e payout all'operatore dopo l'erogazione | M |
| F-43 | Rimborsi automatici secondo la policy di cancellazione | M |
| F-44 | Ricevute per l'utente; report mensile per l'operatore (la fattura al cliente resta in capo all'operatore) | M |
| F-45 | Abbonamenti operatori (Pro/Business) | S |
| F-46 | Gift card acquistabili e spendibili in app | S |
| F-47 | Report DAC7 dei redditi dei venditori all'Agenzia delle Entrate | M (prima della chiusura del 1° anno fiscale) |

### 2.6 Chat e notifiche
| ID | Requisito | Pr. |
|---|---|---|
| F-50 | Chat 1:1 utente ↔ operatore/struttura, anche prima della prenotazione | M |
| F-51 | Allegati immagine, stato letto, notifiche push/email per messaggi non letti | M |
| F-52 | Filtro anti-disintermediazione leggero (avviso se si condividono telefono/email prima della prenotazione) | S |
| F-53 | Segnalazione/blocco utente nella chat | M |
| F-54 | Risposte rapide e messaggi automatici per l'operatore | C |

### 2.7 Recensioni
| ID | Requisito | Pr. |
|---|---|---|
| F-60 | Recensione (1–5 stelle + testo) **solo dopo una prenotazione completata** — recensioni verificate (Direttiva Omnibus) | M |
| F-61 | Risposta pubblica dell'operatore | M |
| F-62 | Moderazione e segnalazione recensioni; pubblicazione della policy sulle recensioni | M |
| F-63 | Sotto-valutazioni (accoglienza, pulizia, professionalità, rapporto qualità/prezzo) | S |

### 2.8 Area operatore (dashboard)
| ID | Requisito | Pr. |
|---|---|---|
| F-70 | Agenda giornaliera/settimanale, gestione prenotazioni | M |
| F-71 | Gestione servizi, prezzi, foto, sedi | M |
| F-72 | Incassi, payout, commissioni | M |
| F-73 | Statistiche (visite profilo, conversione, recensioni) | S |
| F-74 | Rubrica clienti e note private (attenzione: possibili dati sanitari → minimizzazione) | C |

### 2.9 Back-office admin
| ID | Requisito | Pr. |
|---|---|---|
| F-80 | Coda di verifica operatori con visualizzazione documenti | M |
| F-81 | Gestione segnalazioni (DSA), moderazione recensioni e profili, sospensioni con motivazione | M |
| F-82 | Gestione categorie/discipline, città, contenuti in evidenza | M |
| F-83 | Gestione dispute e rimborsi | M |
| F-84 | Cruscotto KPI (vedi studio di fattibilità §9) | S |

### 2.10 Esclusi esplicitamente (Won't, per ora)
- Prestazioni sanitarie, diagnosi, prescrizioni: **fuori perimetro**. Professioni sanitarie (fisioterapisti, psicologi, dietisti) potranno essere valutate in futuro con requisiti ad hoc.
- Vendita di prodotti fisici (integratori, oli, ecc.).
- Marketplace internazionale (solo Italia, lingua IT; inglese in fase 3 per turismo).

## 3. Requisiti non funzionali

| ID | Area | Requisito |
|---|---|---|
| NF-01 | Piattaforme | Web responsive (mobile first) + app iOS e Android con stesse funzionalità core |
| NF-02 | Prestazioni | LCP < 2,5 s su 4G per pagine pubbliche; ricerca < 500 ms p95 |
| NF-03 | Disponibilità | 99,5% mensile per MVP |
| NF-04 | Sicurezza | OWASP ASVS L2; Row Level Security su tutte le tabelle; MFA per admin e operatori; segreti fuori dal codice |
| NF-05 | Privacy | Dati ospitati in UE (Supabase regione Francoforte, Stripe EU); DPIA prima del lancio; registro dei trattamenti |
| NF-06 | Accessibilità | **WCAG 2.1 AA** (obbligatorio: European Accessibility Act, in vigore dal 28/06/2025 per servizi di e-commerce) |
| NF-07 | SEO | Rendering lato server per pagine pubbliche, dati strutturati schema.org (`LocalBusiness`, `Service`, `AggregateRating`, `Event`) |
| NF-08 | Scalabilità | Architettura adeguata fino a ~100k utenti senza riscritture |
| NF-09 | Osservabilità | Log centralizzati, error tracking (Sentry), analytics privacy-friendly (PostHog EU, con consenso) |
| NF-10 | Qualità | CI con lint, typecheck, test; test end-to-end del flusso di prenotazione |
| NF-11 | Lingua | Italiano; i18n predisposto per inglese |
| NF-12 | Backup | Backup giornalieri con point-in-time recovery |

## 4. User story principali (MVP)

1. **Come utente** voglio cercare "massaggio shiatsu vicino a me sabato mattina" e vedere i risultati su una mappa, **per** scegliere in pochi minuti.
2. **Come utente** voglio vedere che un operatore è verificato e leggere recensioni di chi l'ha davvero visto, **per** fidarmi.
3. **Come utente** voglio scrivere all'operatore prima di prenotare, **per** chiarire dubbi.
4. **Come utente** voglio prenotare e pagare in app e ricevere un promemoria, **per** non dimenticarmi.
5. **Come operatore** voglio impostare una volta la mia disponibilità settimanale, **per** ricevere prenotazioni senza telefonate.
6. **Come operatore** voglio ricevere i soldi sul mio conto senza gestire incassi, **per** risparmiare tempo.
7. **Come struttura** voglio riempire gli slot liberi dei giorni feriali, **per** aumentare il fatturato.
8. **Come admin** voglio verificare i documenti di un nuovo operatore in meno di 5 minuti, **per** mantenere alta la qualità.

## 5. Flusso di prenotazione (MVP)

```
Ricerca → Scheda → Scelta servizio → Scelta slot → Login/registrazione
→ Riepilogo + policy cancellazione → Pagamento (o "paga in struttura")
→ [istantanea] Confermata      [su richiesta] In attesa → Accettata/Rifiutata (rimborso)
→ Promemoria → Erogata → Payout operatore → Invito a recensire
```

Stati prenotazione: `pending` (in attesa operatore) · `confirmed` · `cancelled_by_client` ·
`cancelled_by_provider` · `completed` · `no_show` · `disputed`. Sono modellati nello schema
in [`supabase/migrations`](../supabase/migrations).
