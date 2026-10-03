# 11 · L'app mobile: come funziona, come provarla, come mostrarla

Guida pensata per chi viene dallo sviluppo web. L'app è in [`apps/mobile`](../apps/mobile) ed è fatta
con **Expo** (SDK 57) e **React Native**.

## 1. React Native spiegato a uno sviluppatore web

React Native è React, ma invece di produrre HTML produce **componenti nativi** iOS e Android.
Si scrive in TypeScript con gli stessi concetti (componenti, props, state, hook).

| Sul web (Next.js) | In React Native / Expo | Note |
|---|---|---|
| `<div>` | `<View>` | Contenitore. Di default è `display: flex` in colonna |
| `<p>`, `<span>` | `<Text>` | **Tutto** il testo deve stare dentro `<Text>` |
| `<button onClick>` | `<Pressable onPress>` | Si usa `onPress`, non `onClick` |
| `<input>` | `<TextInput onChangeText>` | `onChangeText` riceve direttamente la stringa |
| `<img>` | `<Image>` (o `expo-image`) | |
| Scroll della pagina | `<ScrollView>` / `<FlatList>` | Su mobile lo scroll è esplicito; `FlatList` disegna solo gli elementi visibili |
| CSS / Tailwind | `StyleSheet.create({...})` | Oggetti JS, proprietà in camelCase, misure senza `px` |
| `localStorage` | `AsyncStorage` | Usato per salvare la sessione |
| `app/` + `page.tsx` (App Router) | `src/app/` (Expo Router) | Stessa idea: **ogni file è una schermata** |
| `app/layout.tsx` | `src/app/_layout.tsx` | Layout annidati |
| `[slug]/page.tsx` + `params` | `[slug].tsx` + `useLocalSearchParams()` | Rotte dinamiche |
| `(gruppo)/` | `(tabs)/` | Gruppi che non compaiono nell'URL |
| `<Link href>` / `router.push` | `<Link href>` / `router.push` (da `expo-router`) | Quasi identico |
| `NEXT_PUBLIC_*` | `EXPO_PUBLIC_*` | Variabili d'ambiente visibili al client |
| Deploy su Vercel | Build su **EAS** + pubblicazione sugli store | Vedi §4 |

### Le schermate dell'app

```
src/app/
  _layout.tsx            Stack di navigazione + AuthProvider (sessione disponibile ovunque)
  (tabs)/_layout.tsx     Barra in basso: Esplora · Prenotazioni · Profilo
  (tabs)/index.tsx       Esplora: ricerca, filtri per categoria e città, lista
  (tabs)/prenotazioni.tsx Le mie prenotazioni (tira giù per aggiornare, annulla)
  (tabs)/profilo.tsx     Accesso/registrazione, logout
  operatori/[slug].tsx   Scheda operatore: servizi, giorni, orari, prenota
  accedi.tsx             Login in finestra modale (si apre quando serve per prenotare)
```

La logica (ricerca, slot, prenotazioni, fuso orario) **non è nell'app**: è in `packages/core`,
condivisa con il sito. L'app si occupa solo di mostrare e raccogliere input.

## 2. Provarla sul tuo telefono (5 minuti)

1. Installa **Expo Go** dallo store sul telefono.
2. Sul computer, dalla radice del progetto:
   ```bash
   pnpm install
   cp apps/mobile/.env.example apps/mobile/.env.local   # opzionale: dati reali da Supabase
   pnpm dev:mobile
   ```
3. Compare un **QR code** nel terminale:
   - **Android:** inquadralo dall'app Expo Go.
   - **iPhone:** inquadralo con la fotocamera e apri il link in Expo Go.
4. L'app si apre. Ogni volta che salvi un file si aggiorna da sola (*Fast Refresh*).

Il telefono deve essere sulla stessa rete Wi-Fi del computer. Se non funziona (reti aziendali,
firewall): `pnpm --filter @ilovewellness/mobile start --tunnel`.

Comodità nel terminale di Expo: `w` apre l'app nel browser, `r` ricarica, `j` apre il debugger.

> ⚠️ Expo Go supporta una sola versione di SDK alla volta. Il progetto usa l'SDK 57: se Expo Go
> sul telefono è più vecchio o più nuovo, aggiornalo o usa una *development build* (§4.3).

## 3. Mostrarla ad altri: quattro opzioni

| Opzione | Per chi | Costo | Fatica |
|---|---|---|---|
| **A. Versione web** dell'app | Chiunque, da un link | Gratis | Bassissima |
| **B. Expo Go + EAS Update** | Persone con Expo Go installato | Gratis (piano Free EAS) | Bassa |
| **C. Build installabile** (APK Android / TestFlight iOS) | Tester, finanziatori, operatori pilota | Android gratis; iOS richiede Apple Developer (99 $/anno) | Media |
| **D. Pubblicazione sugli store** | Tutti | Apple 99 $/anno, Google 25 $ una tantum | Alta (revisione, privacy, screenshot) |

### A. Versione web dell'app (la più rapida per una presentazione)
Expo può esportare la stessa app come sito statico:
```bash
pnpm --filter @ilovewellness/mobile export:web   # crea apps/mobile/dist
npx serve -s apps/mobile/dist                     # prova in locale
```
La cartella `dist` si pubblica su Vercel/Netlify (progetto separato, *Root Directory*
`apps/mobile`, comando di build `pnpm export:web`, output `dist`). Aperta dal telefono sembra un'app;
è ottima per demo e interviste. Non ha però notifiche push né funzioni native.

### B. Expo Go + EAS Update (link condivisibile)
```bash
npx eas-cli@latest login            # account gratuito su expo.dev
npx eas-cli@latest init             # collega il progetto (aggiunge un projectId in app.json)
npx eas-cli@latest update --branch demo --message "Demo per Confbenessere"
```
Ottieni un link/QR: chi ha Expo Go lo apre e vede l'ultima versione. Ogni `eas update` successivo
aggiorna l'app di tutti senza reinstallare nulla.

### C. Build installabile vera (consigliata per il pilota con gli operatori)
```bash
npx eas-cli@latest build:configure                   # crea eas.json
npx eas-cli@latest build --platform android --profile preview   # APK da scaricare e installare
npx eas-cli@latest build --platform ios --profile preview       # richiede account Apple Developer
```
- **Android:** EAS restituisce un link all'APK, installabile su qualsiasi Android.
- **iOS:** con l'account Apple si distribuisce tramite **TestFlight** (fino a 10.000 tester con link d'invito).
- Le build avvengono nel cloud di Expo: **non servono Xcode né Android Studio**. Il piano Free
  include un numero limitato di build al mese (vedi [09](09-backend-e-costi-servizi.md)).

### D. Store
`npx eas-cli@latest submit` invia la build ad App Store Connect e Google Play. Servono: account
sviluppatore intestati alla società, icona e screenshot, privacy policy pubblica, scheda
"Privacy nutrition label" (iOS) e "Data safety" (Android), un account demo per i revisori Apple.

## 4. Concetti da conoscere andando avanti

1. **Expo Go vs development build.** Expo Go contiene un insieme fisso di moduli nativi. Se
   aggiungiamo una libreria con codice nativo non incluso (es. pagamenti Stripe nativi, mappe
   avanzate) servirà una *development build*: un "Expo Go personalizzato" per il nostro progetto
   (`eas build --profile development`). Il codice JS non cambia.
2. **Aggiungere librerie:** sempre con `npx expo install nome-pacchetto` (sceglie la versione
   compatibile con l'SDK), non con `pnpm add`.
3. **Cartelle `ios/` e `android/`:** non esistono e non vanno create a mano: Expo le genera al
   momento della build da `app.json` (*Continuous Native Generation*).
4. **Aggiornamenti over-the-air:** le modifiche solo JS/asset si pubblicano con `eas update` senza
   ripassare dalla revisione degli store; le modifiche native richiedono una nuova build.
5. **Monorepo:** il file `.npmrc` alla radice imposta `node-linker=hoisted`, richiesto da Metro
   (il bundler di React Native) per trovare i pacchetti condivisi.

## 5. Prossimi passi per l'app
- Notifiche push (promemoria appuntamenti) con `expo-notifications`.
- Mappa dei risultati (`react-native-maps`, richiede development build).
- Login con Apple/Google (obbligatorio su iOS se si offrono login social).
- Area operatore anche in app (oggi è sul web).
- Icona, splash screen e nome definitivi dopo la scelta del brand.
