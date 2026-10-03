# @ilovewellness/mobile (Fase 2)

App iOS/Android con **Expo (React Native)**, prevista nella Fase 2 della
[roadmap](../../docs/04-roadmap-tempi-costi.md) (mesi 6–10), dopo che l'MVP web avrà validato il prodotto.

Perché dopo il web: il web serve subito per SEO e per lanciare il pilota più in fretta (installabile
come PWA); l'app nativa aggiunge notifiche push, esperienza più fluida e presenza sugli store.

Riutilizzerà dal monorepo: tipi generati dallo schema Supabase, logica di dominio
(`packages/`), design token. Avvio previsto:

```bash
pnpm create expo-app apps/mobile --template tabs
```
