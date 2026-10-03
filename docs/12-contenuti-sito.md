# 12 · Contenuti del sito attuale e marchio

## 1. Recupero dal sito WordPress

Il sito attuale è **https://ilovewellnessworld.wordpress.com/** (e c'è anche
https://confbenessere.wordpress.com/). Nessuno dei due era raggiungibile dall'ambiente in cui
è stato sviluppato il prototipo (blocco di rete), quindi **i testi non sono ancora stati importati**.
La pagina `/chi-siamo` contiene una proposta di testo da sostituire con quella reale.

### Come esportare i contenuti (2 minuti)
1. Accedi a WordPress.com → bacheca del sito.
2. **Strumenti → Esporta → Esporta tutto** (oppure *Impostazioni → Esporta*): scarichi un file
   `.zip` con un `.xml` (formato WXR) che contiene pagine, articoli, categorie e link alle immagini.
3. Per le immagini: **Media → seleziona → Scarica**, oppure **Strumenti → Esporta → Esporta libreria media**.
4. Metti i file nella cartella `content/wordpress/` della repo (o inviali in chat): li converto in
   pagine del nuovo sito.

In alternativa basta copiare e incollare in chat i testi delle pagine principali (chi siamo, servizi,
contatti, eventi).

### Cosa ne faremo
| Contenuto WordPress | Destinazione nel nuovo progetto |
|---|---|
| Chi siamo / mission | `/chi-siamo` |
| Elenco operatori o soci | Operatori da invitare nel programma Fondatori (non pubblicati senza consenso) |
| Eventi e meeting | Sezione eventi/ritiri (fase 2) o pagine dedicate |
| Articoli | Blog/guide SEO ("Cos'è lo shiatsu", ecc.) |
| Contatti | Footer e pagina contatti |

## 2. ⚠️ Attenzione al nome "ILoveWellness"

Una ricerca rapida mostra che **"I LOVE Wellness" è già usato come marchio commerciale in Europa**
(linea di prodotti per la cura della persona venduta da catene come Holland & Barrett) e che
**"Love Wellness"** è un marchio statunitense nel settore benessere. Esistono anche un podcast
"I Love Wellness" e altri usi simili.

Non significa che il nome sia inutilizzabile — classi di prodotti e servizi diverse possono
convivere — ma **prima di investire in brand, dominio e app sugli store** serve:
1. una ricerca di anteriorità su **EUIPO** (eSearch plus) e **UIBM**, in particolare nelle classi
   35 (marketplace), 41 (corsi, yoga), 44 (servizi di benessere), 9 e 42 (app e software);
2. il parere di un consulente in proprietà industriale;
3. un piano B: varianti come "ILoveWellness World" (già usato dal sito attuale), un nome
   italiano, o un marchio figurativo distintivo.

Il nome dell'app sugli store (`apps/mobile/app.json`) e il dominio si cambiano facilmente oggi:
molto meno dopo il lancio.

Fonti: https://www.eurosalesinternational.ie/i-love-wellness/ ·
https://www.hollandandbarrett.gr/en/brands/i-love-wellness/ ·
https://www.linkedin.com/company/love-wellness
