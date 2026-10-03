# 01 · Studio di fattibilità — ILoveWellness

> Versione 0.1 · ottobre 2026 · documento di lavoro, da rivedere dopo le interviste di validazione (vedi [08-domande-aperte.md](08-domande-aperte.md)).

## 1. Sintesi (executive summary)

**ILoveWellness** è un marketplace digitale (app iOS/Android + web app + sito) che mette in contatto
chi cerca benessere con chi lo offre: operatori olistici, insegnanti di yoga e meditazione, naturopati,
massaggiatori, centri benessere, SPA, terme, strutture per ritiri. L'utente cerca per luogo, disciplina,
data e prezzo, legge le recensioni verificate, chatta con il professionista/struttura e prenota
(e paga) direttamente in app. Il riferimento è un incrocio tra **Unobravo** (fiducia, professionisti
verificati, percorso guidato, sedute anche online) e **Airbnb** (marketplace a due lati, mappa,
schede ricche, recensioni, pagamenti gestiti dalla piattaforma).

**Verdetto: ha senso, a tre condizioni.**

1. **Partire stretti, non larghi.** "Tutto il benessere, in tutta Italia" è la ricetta per un
   marketplace vuoto. Il lancio va fatto su **1 area geografica** (proposta: Bologna/Emilia-Romagna, dove
   Confbenessere ha già una rete) e **3–4 categorie** (es. yoga & meditazione, massaggi/trattamenti
   olistici, SPA/centri benessere, ritiri/eventi). Si allarga solo quando la liquidità (prenotazioni
   per operatore) è dimostrata.
2. **Fare della fiducia il prodotto.** Il settore olistico in Italia è poco regolamentato
   (L. 4/2013, professioni non organizzate). Il vero vantaggio competitivo rispetto a Google Maps,
   Instagram o Treatwell è un **badge di operatore verificato** (identità, formazione, iscrizione ad
   associazione professionale, assicurazione RC) e recensioni solo da chi ha davvero prenotato.
   È anche l'argomento più forte verso un finanziatore pubblico.
3. **Chiarire subito la natura del finanziamento ministeriale.** Il Ministero della Salute
   finanzia normalmente progetti di prevenzione/promozione della salute tramite enti pubblici,
   Regioni, IRCCS o Terzo Settore, con vincoli di rendicontazione e talvolta su proprietà dei
   risultati e gratuità. Un marketplace a commissione di una società privata non è il beneficiario
   tipico: bisogna capire **chi** riceve i fondi, **per cosa** e **con quali vincoli** prima di
   impostare società, modello di ricavo e roadmap. Vedi [07-finanziamento.md](07-finanziamento.md).

Stima di massima: **MVP web in 5–6 mesi**, **app native a 8–9 mesi**, budget di sviluppo MVP
**€70k–€150k** a seconda del modello (team interno snello vs agenzia), più **€30k–€60k** di
marketing di lancio nella città pilota. Dettagli in [04-roadmap-tempi-costi.md](04-roadmap-tempi-costi.md).

## 2. Il contesto: Confbenessere

Il progetto nasce da **Confbenessere**, una rete di operatori del benessere che ha tenuto il suo
1° Meeting il 4 agosto 2024 presso Montovolo House (Camugnano, Appennino tra Bologna e Firenze).

> ⚠️ **Nota metodologica.** Il sito `confbenessere.wordpress.com` non era raggiungibile
> dall'ambiente in cui è stato redatto questo studio (blocco di rete). Le informazioni
> sull'associazione vanno quindi **integrate dal promotore**: numero di soci/operatori, discipline
> rappresentate, distribuzione geografica, statuto e forma giuridica, rapporti già avviati con
> istituzioni. Sono le domande n. 1–6 di [08-domande-aperte.md](08-domande-aperte.md).

Perché la rete conta: in un marketplace il problema n. 1 è l'**uovo e la gallina** (gli utenti
arrivano se ci sono operatori, gli operatori restano se arrivano utenti). Un'associazione con
qualche centinaio di operatori già fidelizzati risolve il lato offerta del lancio — è l'asset più
prezioso del progetto, più dell'app stessa.

## 3. Il mercato

| Indicatore | Valore | Fonte |
|---|---|---|
| Economia del benessere in Italia | **$140,6 mld** (10° al mondo, 4° in Europa), 5,93% del PIL, $2.384 pro capite | Global Wellness Institute, *Global Wellness Economy: Italy*, 2025 |
| Turismo del benessere + SPA + terme | ≈ **$27 mld** (2024) | GWI 2025 |
| Settori in cui l'Italia è top 10 mondiale | 10 su 11, incl. *medicina tradizionale e complementare*, *mental wellness*, *spa* | GWI 2025 |
| Imprese beauty & wellness attive in Italia | > **100.000** | Treatwell (comunicati post-fusione con Uala) |
| Riferimento Unobravo | > **9.500** psicologi in rete, milioni di sedute erogate | Unobravo / stampa (Forbes, QN) |

Lettura: il mercato è enorme ma **frammentato** — migliaia di piccoli operatori individuali
(partita IVA forfettaria, spesso senza sito né gestionale), scoperta affidata a passaparola,
Instagram e Google Maps. È esattamente la condizione in cui un marketplace verticale crea valore
(come Airbnb con gli appartamenti privati, Unobravo con gli psicologi freelance).

### Segmenti utente (lato domanda)

| Persona | Bisogno | Cosa cerca in app |
|---|---|---|
| **Giulia, 34, impiegata in città** | Stress, sonno, mal di schiena da scrivania | Massaggio/yoga vicino a casa o ufficio, la sera, prezzo chiaro, recensioni |
| **Marco & Sara, coppia 40+** | Weekend rigenerante | SPA/terme, pacchetti di coppia, ritiri nel weekend, gift card |
| **Elena, 55, curiosa del mondo olistico** | Percorso personale (naturopatia, reiki, meditazione) | Operatore *affidabile e verificato*, primo colloquio conoscitivo, anche online |
| **HR manager di un'azienda** | Welfare aziendale | Pacchetti/abbonamenti per dipendenti (canale B2B, fase 3) |

### Segmenti operatore (lato offerta)

| Tipo | Esempi | Esigenza principale |
|---|---|---|
| Professionista individuale | Naturopata, operatore shiatsu, insegnante yoga, counselor, massaggiatore | Visibilità, agenda, incassi, credibilità |
| Studio/centro | Centro yoga, studio olistico multi-operatore | Gestione classi, più operatori, pacchetti |
| Struttura | SPA, day spa, terme, agriturismo/hotel con area wellness, centro ritiri | Riempire slot e periodi di bassa stagione, vendere pacchetti e gift card |
| Organizzatore di eventi | Ritiri, workshop, festival | Vendita biglietti, comunicazione |

## 4. Concorrenza

| Concorrente | Cosa fa | Sovrapposizione | Debolezza su cui fare leva |
|---|---|---|---|
| **Treatwell** (ex Uala) | Prenotazione beauty & wellness, gestionale saloni | Alta su SPA/massaggi | Focus estetica/parrucchieri; commissioni percepite alte (20–30% su nuovi clienti); niente olistico |
| **Unobravo** | Psicoterapia online/in presenza, matching | Modello, non categoria | Solo psicologia (professione sanitaria regolamentata) |
| **MioDottore / Doctolib** | Prenotazione medici e professioni sanitarie | Bassa (sanitario) | Non coprono discipline olistiche |
| **EventiYoga** | Catalogo eventi/corsi yoga (≈6.000 eventi, >1.000 insegnanti) | Media su yoga | Verticale stretto, poco transazionale |
| **Mindbody / ClassPass / Wellhub** | Software per studi + abbonamenti fitness/yoga, welfare aziendale | Media su yoga/fitness | Orientati a palestre/studi strutturati, poco olistico, prodotto non italiano |
| **ProntoPro / TrovaWeb** | Directory generiche di professionisti | Bassa | Generalisti, nessuna verifica di settore |
| **Airbnb Esperienze, Smartbox, siti delle SPA** | Esperienze e cofanetti | Media su SPA/ritiri | Nessuna relazione continuativa con il professionista |
| **Google Maps + Instagram** | Scoperta "di fatto" | Altissima | Nessuna verifica, nessuna prenotazione/pagamento integrato |

**Posizionamento proposto:** *"Il benessere di cui ti puoi fidare"* — l'unico posto dove trovare
operatori olistici e strutture **verificati**, con recensioni reali e prenotazione immediata.
Né beauty (Treatwell), né sanità (MioDottore): il benessere olistico e la prevenzione degli stili di vita.

## 5. Analisi SWOT

| Punti di forza | Punti di debolezza |
|---|---|
| Rete Confbenessere come offerta iniziale · Possibile finanziamento pubblico · Mercato grande e frammentato senza un leader olistico · Brand emozionale e facile da ricordare | Categoria molto eterogenea (SPA ≠ reiki ≠ yoga) → UX e modello prezzi complessi · Team tecnico/prodotto da costruire · Sito attuale debole, brand da creare |
| **Opportunità** | **Minacce** |
| Welfare aziendale in crescita · Turismo del benessere (Appennino, terme) · European Accessibility Act e DSA alzano l'asticella per i piccoli concorrenti · Verifica operatori come standard di settore (anche con associazioni L. 4/2013) | Treatwell/ClassPass che si allargano all'olistico · Disintermediazione (cliente e operatore che dopo la prima volta si accordano fuori app) · Rischio reputazionale (pratiche non scientifiche + fondi del Ministero della Salute) · Vincoli imposti dal finanziatore |

## 6. Modello di business

Unobravo incassa l'intera seduta dal paziente e riconosce un compenso al professionista: funziona
perché il servizio è omogeneo e la piattaforma fa il *matching*. Per ILoveWellness, data
l'eterogeneità dell'offerta, il modello più adatto è quello **Airbnb/Treatwell**: l'operatore
fissa i propri prezzi, la piattaforma incassa e trattiene una commissione. Proposta "ibrida":

| Fonte di ricavo | Meccanica | Ipotesi di prezzo |
|---|---|---|
| **Commissione su prenotazione** | Solo su clienti *nuovi* portati dalla piattaforma (riduce la disintermediazione) | 12–15% (benchmark mercato 10–30%) |
| **Abbonamento operatori "Pro"** | Base gratuito (profilo + richieste); Pro con agenda, pagamenti online, statistiche, gestione clienti abituali senza commissione | €19–€39/mese |
| **Strutture/centri "Business"** | Multi-operatore, classi, pacchetti, gift card | €49–€99/mese |
| **Gift card** | Molto forte su SPA e coppie (Natale, San Valentino, festa della mamma) | margine sulla commissione + breakage |
| **Eventi e ritiri** | Biglietteria | 5–8% |
| **Visibilità sponsorizzata** | Posizioni in evidenza (dichiarate come tali, obbligo P2B/DSA) | a CPC o pacchetti |
| **B2B welfare aziendale** (fase 3) | Crediti benessere per dipendenti, anche tramite piattaforme welfare | contratto annuo |

> 💡 Se il finanziamento pubblico imponesse gratuità per gli utenti o vincoli sul profitto, il
> modello si sposta sul **SaaS per operatori** (abbonamenti) mantenendo gratuita la ricerca/prenotazione.
> Questo è il motivo per cui il chiarimento sul finanziamento viene prima di tutto.

### Scenario economico indicativo (da validare)

Ipotesi: scontrino medio €60–€70, commissione media effettiva 12%, conversione operatori a Pro 15–20%.

| | Anno 1 (pilota Bologna/ER) | Anno 2 (Emilia-Romagna + 2 città) | Anno 3 (nazionale) |
|---|---|---|---|
| Operatori/strutture attivi | 300 | 1.500 | 5.000 |
| Utenti registrati | 5.000 | 30.000 | 150.000 |
| Prenotazioni annue | 3.000 | 15.000 | 60.000 |
| Ricavi commissioni | ≈ €22k | ≈ €117k | ≈ €500k |
| Ricavi abbonamenti | ≈ €21k | ≈ €105k | ≈ €350k |
| Gift card / eventi / B2B | — | ≈ €50k | ≈ €200k |
| **Ricavi totali** | **≈ €43k** | **≈ €270k** | **≈ €1,05M** |
| Costi (team, marketing, infrastruttura) | €200–€300k | €400–€550k | €800k–€1,1M |

Conclusione economica: come per ogni marketplace, **i primi 2 anni sono di investimento**; il
break-even realistico è al 3°–4° anno e **dipende quasi interamente dalla liquidità** (quante
prenotazioni riceve in media ogni operatore attivo). Il finanziamento pubblico ha senso proprio per
coprire la fase pilota e la costruzione della piattaforma.

## 7. Fattibilità tecnica

**Alta.** Nessun componente richiede ricerca: profili, ricerca geografica, calendario, pagamenti
marketplace, chat, recensioni, notifiche sono problemi risolti con servizi maturi (Supabase/Postgres
+ PostGIS, Stripe Connect, Expo/React Native, Next.js). Il rischio tecnico è basso; il rischio
vero è **di mercato** (liquidità) e **di esecuzione** (team e marketing). Dettagli in
[03-architettura.md](03-architettura.md).

Raccomandazione: **una sola codebase TypeScript** in monorepo (web Next.js + app Expo + backend
Supabase), come fa Unobravo con app e web app coerenti. Si veda l'[ADR-0001](adr/0001-monorepo.md).

## 8. Rischi principali e mitigazioni

| # | Rischio | Prob. | Impatto | Mitigazione |
|---|---|---|---|---|
| R1 | Marketplace vuoto (poca liquidità) | Alta | Alto | Lancio geografico stretto; onboarding assistito della rete Confbenessere; obiettivo ≥ 4 prenotazioni/mese per operatore attivo prima di espandersi |
| R2 | Disintermediazione | Alta | Medio | Commissione solo su clienti nuovi; abbonamento Pro con valore gestionale (agenda, pagamenti, fatture); recensioni e garanzie solo in app |
| R3 | Reputazione/claim sanitari | Media | Alto | Policy contenuti: vietate diagnosi e promesse terapeutiche; disclaimer; categorie "benessere" non "cura"; moderazione; comitato scientifico consultivo |
| R4 | Vincoli del finanziamento pubblico | Media | Alto | Due diligence sul bando prima di costituire la società; struttura societaria compatibile (vedi doc 07) |
| R5 | Qualità operatori disomogenea | Media | Alto | Verifica documentale, badge, recensioni verificate, procedura di segnalazione (DSA) |
| R6 | Compliance (GDPR, DSA, DAC7, P2B, Omnibus, EAA) | Media | Medio | Stripe Connect per KYC e pagamenti; consulente legale dal giorno 1; vedi doc 06 |
| R7 | Concorrenza (Treatwell/ClassPass) | Media | Medio | Nicchia olistica + verifica + comunità; i grandi non presidiano l'olistico |
| R8 | Team/esecuzione | Media | Alto | CTO/tech lead dedicato o partner tecnico con equity; roadmap per fasi con milestone misurabili |
| R9 | Nome/marchio: "I LOVE Wellness" è già un marchio di prodotti in Europa | Media | Medio | Ricerca di anteriorità EUIPO/UIBM prima di brand e store; piano B sul nome (vedi [12](12-contenuti-sito.md#2--attenzione-al-nome-ilovewellness)) |

## 9. KPI per decidere (go / no-go)

Al termine del pilota (≈ 6 mesi dopo il lancio MVP) si prosegue verso l'espansione se:

- ≥ **150 operatori attivi** (profilo completo + disponibilità aggiornata) nell'area pilota;
- ≥ **40%** degli operatori attivi riceve almeno 1 prenotazione al mese;
- ≥ **25%** degli utenti che prenotano lo rifà entro 90 giorni;
- valutazione media ≥ **4,5/5** e < 2% di prenotazioni contestate;
- CAC (costo di acquisizione utente pagante) < **€25**.

## 10. Prossimi passi immediati (4–6 settimane)

1. Risposte alle [domande aperte](08-domande-aperte.md), soprattutto sul finanziamento.
2. **Interviste di validazione**: 20–30 operatori della rete + 30–50 potenziali utenti (script in [05-marketing.md](05-marketing.md#validazione)).
3. Verifica marchio "ILoveWellness" (UIBM/EUIPO) e domini `.it`/`.com`.
4. Landing page con lista d'attesa (utenti) e pre-registrazione (operatori) — misura l'interesse reale.
5. Decisione su team tecnico (interno, freelance, agenzia) e budget.
6. Avvio sviluppo MVP secondo [04-roadmap-tempi-costi.md](04-roadmap-tempi-costi.md) — lo schema dati e il prototipo cliccabile sono già in questa repo.

## Fonti

- Global Wellness Institute, *New research ranks Italy among the world's top 10 wellness economies, valued at $140.6 billion* (2025) — https://globalwellnessinstitute.org/press-room/press-releases/new-research-from-the-global-wellness-institute-ranks-italy-among-the-worlds-top-10-wellness-economies-valued-at-140-6-billion/
- Global Wellness Institute, *Wellness in Italy* — https://globalwellnessinstitute.org/wellness-in-italy/
- Treatwell/Uala, fusione e dati di mercato — https://www.spabusiness.com/wellness-news/Treatwell-completes-merger-with-Uala/350041 · https://www.quotidiano.net/economia/made-in-italy/treatwell-dopo-lapp-beauty-scende-8857598f
- Unobravo — https://www.unobravo.com/lavora-con-noi · https://forbes.it/2026/09/22/unobravo-terapia-presenza-italia · https://www.quotidiano.net/economia/money-vibez/fatti-vedere-da-uno-bravo-come-una-psicologa-di-27-anni-ha-costruito-unazienda-da-7-milioni-di-sedute-x07s7i52
- EventiYoga (App Store) — https://apps.apple.com/it/app/eventiyoga/id1514783292
- ProntoPro (Forbes) — https://forbes.it/2023/08/08/prontopro-piattaforma-aiuta-trovare-professionista-giusto/
- Legge 4/2013 e discipline olistiche — https://www.dequo.it/consulenze/lavoro-previdenza/attestato-operatori-olistici-e-valido-in-italia · https://www.fiscoetasse.com/approfondimenti/13720-le-discipline-bio-naturali-un-settore-professionale-in-cerca-di-identita.html
- Confbenessere, 1° Meeting (Fioravanti Consulting) — https://fioravanticonsulting.wordpress.com/
