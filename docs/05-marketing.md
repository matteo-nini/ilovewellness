# 05 · Strategia di marketing e go-to-market

## 1. Il principio: prima l'offerta, poi la domanda, in un posto solo

Un marketplace si lancia **una città alla volta**. Airbnb ha iniziato da San Francisco e New York,
Unobravo da una nicchia (psicologia online) prima di allargarsi. Per ILoveWellness:

1. **Offerta** (operatori/strutture) nell'area pilota → fino a una densità minima (≥ 150 attivi, con disponibilità reali).
2. **Domanda** (utenti) concentrata **sulla stessa area**, così ogni utente trova davvero qualcosa vicino a sé.
3. Solo dopo i KPI di liquidità → nuova città, replicando lo stesso playbook.

## 2. Brand

- **Nome:** ILoveWellness — emozionale, internazionale, facile. Da verificare: registrabilità del marchio (classi 35, 41, 44, 9/42 per l'app) e somiglianza con marchi esistenti "I Love…".
- **Promessa:** *"Il benessere di cui ti puoi fidare."* (alternative: *"Trova il tuo benessere, vicino a te."* · *"Prenditi cura di te. Al resto pensiamo noi."*)
- **Tono di voce:** caldo, accogliente, concreto; mai promesse terapeutiche ("guarisce", "cura") — vedi doc 06.
- **Valori da comunicare:** verifica degli operatori, recensioni vere, prezzi trasparenti, semplicità.
- **Identità visiva:** toni naturali (salvia, sabbia, terracotta), fotografia reale degli operatori della rete (non stock), illustrazioni morbide. Il prototipo in `apps/web` usa già una prima palette.

## 3. Acquisizione dell'offerta (operatori e strutture)

| Leva | Azione | Obiettivo |
|---|---|---|
| **Rete Confbenessere** | Onboarding assistito 1:1 (telefonata + profilo compilato insieme + servizio foto) | 50–100 operatori "fondatori" |
| **Programma Fondatori** | Primi 200 operatori: 0% commissione per 6 mesi + Pro gratis 12 mesi + badge "Fondatore" | Rimuovere il rischio di provare |
| **Associazioni di categoria** | Accordi con associazioni L. 4/2013 (naturopati, shiatsu, yoga, ecc.): verifica facilitata per i loro iscritti | Credibilità + volumi |
| **Strutture** | Visita commerciale a SPA/day spa/agriturismi dell'area: argomento "riempi gli slot dei giorni feriali" | 20–30 strutture |
| **Eventi** | Presenza a fiere (es. RiminiWellness, fiere olistiche locali), meeting Confbenessere | Lead |
| **Referral operatore** | Un mese Pro gratis per ogni collega portato e attivato | Crescita organica |

## 4. Acquisizione della domanda (utenti)

| Canale | Tattica | Note |
|---|---|---|
| **SEO** (canale principale a lungo termine) | Pagine città × disciplina (`/yoga/bologna`, `/massaggio-shiatsu/bologna`), schede operatori indicizzabili, guide ("Cos'è lo shiatsu", "Come scegliere un naturopata") | È il canale che ha fatto crescere Unobravo e Airbnb; i risultati arrivano in 6–12 mesi |
| **Contenuti social** | Instagram/TikTok con gli operatori come protagonisti (mini-lezioni, dietro le quinte), Pinterest per SPA/ritiri | Gli operatori condividono → reach gratuita |
| **Performance marketing** | Meta Ads e Google Ads geolocalizzati sull'area pilota; Google Ads su query ad alta intenzione ("massaggio bologna oggi") | Budget test €1–3k/mese, ottimizzando sul CAC |
| **Gift card** | Campagne a Natale, San Valentino, festa della mamma | Acquisizione a costo negativo |
| **Partnership locali** | Palestre, negozi bio, coworking, hotel (concierge), farmacie | Materiale QR, codici sconto |
| **PR** | Storia "rete di operatori + finanziamento pubblico + app italiana" → stampa locale e di settore | Credibilità |
| **Referral utenti** | €10 a te, €10 all'amico sulla prima prenotazione | |
| **B2B welfare** (fase 3) | Pacchetti per aziende dell'area; piattaforme welfare | Volumi ricorrenti |

## 5. Funnel e metriche

```
Visite → Ricerche → Visualizzazioni scheda → Inizio prenotazione → Prenotazione → Ripetizione
```

| Metrica | Target pilota |
|---|---|
| Conversione visita → prenotazione | ≥ 2% |
| CAC utente che prenota | < €25 |
| Ripetizione entro 90 giorni | ≥ 25% |
| Operatori con ≥ 1 prenotazione/mese | ≥ 40% |
| NPS utenti / operatori | ≥ 50 / ≥ 40 |

## 6. Piano di lancio (area pilota)

| Quando | Attività |
|---|---|
| −8 settimane | Landing + lista d'attesa; inizio onboarding Fondatori |
| −4 settimane | Contenuti social con gli operatori; PR locale "in arrivo" |
| −2 settimane | Beta chiusa: amici, famiglie, rete; raccolta prime recensioni |
| Lancio | Evento fisico (open day con lezioni gratuite presso operatori), comunicato stampa, campagne geolocalizzate |
| +4 settimane | Analisi funnel, interviste, correzioni; prima campagna gift card se in stagione |

<a id="validazione"></a>
## 7. Script per le interviste di validazione (Fase 0)

**Operatori (20–30 min)**
1. Come ti trovano oggi i nuovi clienti? Quanti al mese?
2. Come gestisci agenda, pagamenti, disdette? Cosa ti fa perdere più tempo?
3. Usi già piattaforme (Treatwell, Instagram, Google, siti di settore)? Cosa ti piace/non ti piace?
4. Pagheresti una commissione per un cliente nuovo? Quanto ti sembra giusto? E un abbonamento mensile per agenda e pagamenti?
5. Saresti disposto a farti verificare (documenti, formazione, assicurazione)?
6. *(mostra il prototipo)* Cosa manca? Cosa non useresti?

**Utenti (15–20 min)**
1. L'ultima volta che hai cercato un massaggio/corso yoga/SPA: come hai fatto? Cosa è stato difficile?
2. Come capisci se un operatore olistico è affidabile?
3. Prenoteresti e pagheresti in app un operatore che non conosci? Cosa ti servirebbe per farlo?
4. Quanto spendi in media e quanto spesso?
5. *(mostra il prototipo)* Prenoteresti qualcosa qui? Perché sì/no?

## 8. Il sito Confbenessere attuale

Il sito di Confbenessere su WordPress.com va rifatto, ma **non deve competere** con ILoveWellness.
Proposta: Confbenessere diventa il sito istituzionale dell'associazione (chi siamo, eventi,
formazione, iscrizione), con link evidente a ILoveWellness come "la piattaforma della rete".
ILoveWellness ha un proprio dominio, brand e sito (in questa repo).
