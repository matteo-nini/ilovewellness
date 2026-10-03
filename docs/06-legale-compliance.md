# 06 · Aspetti legali e compliance

> ⚠️ Questa è una mappa dei temi da affrontare, **non una consulenza legale**. Va validata da un
> avvocato esperto di piattaforme digitali/privacy e da un commercialista prima del lancio.

## 1. Forma giuridica

| Opzione | Note |
|---|---|
| **S.r.l. startup innovativa** (iscrizione sezione speciale Registro Imprese) | Agevolazioni fiscali per investitori, accesso a Smart&Start, costituzione semplificata. Requisiti: spesa R&S ≥ 15%, oppure team qualificato, oppure software registrato |
| **Società Benefit** (come Unobravo) | Coerente con la missione di benessere e con un finanziatore pubblico; obbligo di relazione annuale d'impatto |
| Associazione / Ente del Terzo Settore | Più adatta se il bando lo richiede, ma poco compatibile con un marketplace a commissione e con investitori |

**Raccomandazione preliminare:** S.r.l. startup innovativa **e** Società Benefit, separata
dall'associazione Confbenessere (che può essere socia, partner o ente capofila in un progetto
finanziato). Da confermare in base al bando (doc [07](07-finanziamento.md)).

## 2. Inquadramento delle attività degli operatori

- Le discipline olistiche/bio-naturali sono **professioni non organizzate** ai sensi della **L. 4/2013**: esercizio libero, con possibile adesione ad associazioni professionali che rilasciano attestati di qualità. Alcune Regioni (es. Toscana, Lombardia, Emilia-Romagna) hanno elenchi/registri regionali per gli operatori in discipline bio-naturali.
- **Non sono prestazioni sanitarie**: un operatore olistico non può fare diagnosi né promettere cure. La piattaforma deve:
  - vietare nei Termini claim terapeutici ("cura l'ansia", "guarisce l'ernia") e moderarli;
  - mostrare un disclaimer ("Le discipline del benessere non sostituiscono il parere medico");
  - tenere fuori dal perimetro iniziale le professioni sanitarie (che hanno regole su pubblicità sanitaria, albi e dati sanitari).
- Massaggi: distinguere massaggio benessere (non sanitario) da massofisioterapia (sanitaria).
- Strutture SPA/centri estetici: autorizzazioni comunali e requisiti igienico-sanitari sono a carico della struttura; la piattaforma li richiede in fase di verifica.

## 3. Ruolo della piattaforma e obblighi UE

| Normativa | Cosa comporta per ILoveWellness |
|---|---|
| **Digital Services Act** (Reg. UE 2022/2065) — piattaforma online | Punto di contatto e rappresentante; T&C chiari; meccanismo di **notice & action**; motivazione delle sospensioni; sistema interno di reclamo; **tracciabilità dei professionisti** (art. 30: raccolta e verifica di dati identificativi, P.IVA); trasparenza sui sistemi di raccomandazione e sulla pubblicità; divieto di dark pattern. Esenzioni parziali per micro/piccole imprese, ma l'art. 30 si applica ai marketplace |
| **Reg. P2B** (UE 2019/1150) | T&C per gli operatori con preavviso di 15 giorni sulle modifiche; **parametri di ranking** dichiarati; motivazione di sospensioni; sistema di gestione reclami |
| **Direttiva Omnibus** (recepita nel Codice del Consumo) | Dichiarare se e come si verifica che le recensioni provengano da clienti reali → noi: solo dopo prenotazione completata; vietato pubblicare recensioni false o selettive |
| **Codice del Consumo** | Informazioni precontrattuali, prezzo totale chiaro, identità dell'operatore. Il **diritto di recesso** di 14 giorni non si applica ai servizi relativi al tempo libero con data specifica (art. 59 lett. n): vale la policy di cancellazione scelta dall'operatore, da comunicare chiaramente |
| **DAC7** (D.Lgs. 32/2023) | Le piattaforme devono raccogliere dati dei venditori e **comunicare annualmente all'Agenzia delle Entrate** i corrispettivi (entro il 31 gennaio). Va previsto dal primo anno |
| **PSD2 / servizi di pagamento** | Non detenere fondi di terzi: usare **Stripe Connect**, che gestisce KYC/AML e split dei pagamenti |
| **European Accessibility Act** (D.Lgs. 82/2022) | Dal 28/06/2025 i servizi di e-commerce verso consumatori devono essere accessibili (WCAG 2.1 AA, dichiarazione di accessibilità). Esenzione per microimprese, ma conviene progettare accessibile da subito |

## 4. Privacy (GDPR)

- **Titolarità**: ILoveWellness è titolare per i dati degli utenti sulla piattaforma; gli operatori sono titolari autonomi dei dati che trattano per erogare la prestazione. Va formalizzato nei contratti.
- **Dati particolari (art. 9)**: in chat o nel questionario l'utente può rivelare informazioni sulla salute. Misure: informativa esplicita, consenso dove necessario, minimizzazione (nessun campo obbligatorio "patologie"), conservazione limitata, nessun uso a fini di marketing/profilazione.
- **DPIA** obbligatoria prima del lancio (trattamento su larga scala, possibili dati sanitari, geolocalizzazione).
- **Registro dei trattamenti**, nomina responsabili (Supabase, Stripe, Vercel, Resend, ecc.) con DPA, dati in UE o con garanzie per trasferimenti extra-UE.
- **Cookie e tracciamento**: banner conforme alle Linee guida Garante 2021; analytics solo con consenso o configurati in modo anonimo.
- **Diritti** degli interessati: accesso, rettifica, cancellazione, portabilità implementati in app (requisito F-05).
- **Minori**: registrazione consentita da 18 anni (o 14 con regole specifiche — si sceglie 18 per semplicità).

## 5. Documenti da predisporre prima del lancio

- [ ] Termini e condizioni utenti
- [ ] Termini e condizioni operatori/strutture (P2B compliant) e accordo di commissione
- [ ] Informativa privacy utenti e operatori; cookie policy
- [ ] Policy sulle recensioni (Omnibus)
- [ ] Linee guida contenuti (claim vietati, foto, linguaggio)
- [ ] Policy di cancellazione e rimborsi
- [ ] Procedura notice & action e reclami (DSA)
- [ ] Dichiarazione di accessibilità
- [ ] DPIA e registro dei trattamenti
- [ ] Contratti con fornitori (DPA)
- [ ] Ricerca di anteriorità e deposito marchio "ILoveWellness" — **attenzione: "I LOVE Wellness" è già usato per prodotti in Europa** (vedi [12](12-contenuti-sito.md))

## 6. Fiscalità della commissione

La commissione è un corrispettivo per un servizio di intermediazione: la piattaforma fattura la
commissione all'operatore (IVA 22%; per operatori in regime forfettario, attenzione al meccanismo
di reverse charge/estero se si fattura da entità non italiana). L'operatore resta responsabile di
fatturare/emettere ricevuta al cliente finale per l'intero importo della prestazione. Da definire
con il commercialista il flusso esatto (incluso il caso "paghi in struttura").
