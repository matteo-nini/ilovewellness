import { Link } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { formatPrice, type ProviderListItem } from "@ilovewellness/core";
import { colors, font, radius, space } from "@/theme";
import { VerifiedBadge } from "./ui";

export function Cover({ name, palette, height = 120 }: { name: string; palette: [string, string]; height?: number }) {
  const initials = name.split(/\s+/).filter((w) => /^[A-Za-zÀ-ÿ]/.test(w)).slice(0, 2).map((w) => w[0]).join("");
  return (
    <View style={{ height, backgroundColor: palette[0], justifyContent: "flex-end" }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: palette[1], opacity: 0.45, borderBottomLeftRadius: 400 }]} />
      <Text style={[font.serif, { color: "rgba(255,255,255,0.9)", fontSize: 34, margin: space.md }]}>{initials}</Text>
    </View>
  );
}

/** Card di un risultato. <Link asChild> rende tutta la card un collegamento alla scheda. */
export function ProviderCard({ item }: { item: ProviderListItem }) {
  return (
    <Link href={`/operatori/${item.slug}`} asChild>
      <Pressable style={({ pressed }) => [styles.card, pressed && { opacity: 0.85 }]}>
        <Cover name={item.displayName} palette={item.palette} />
        <View style={styles.body}>
          <View style={styles.row}>
            <Text style={[font.serif, styles.name]} numberOfLines={1}>{item.displayName}</Text>
            {item.verified && <VerifiedBadge />}
          </View>
          <Text style={styles.muted} numberOfLines={1}>{item.categoryNames.join(" · ")}</Text>
          <Text style={styles.headline} numberOfLines={2}>{item.headline}</Text>
          <View style={styles.row}>
            <Text style={styles.small}>
              {item.ratingCount ? `★ ${item.ratingAvg.toFixed(1)} (${item.ratingCount})` : "Nuovo"}
            </Text>
            <Text style={styles.small}>
              da <Text style={{ fontWeight: "700" }}>{formatPrice(item.minPriceCents)}</Text>
            </Text>
          </View>
          <Text style={styles.meta}>
            📍 {item.city}
            {item.distanceKm !== null ? ` · ${item.distanceKm} km` : ""}
            {item.hasOnline ? " · anche online" : ""}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.white, borderRadius: radius.lg, overflow: "hidden", borderWidth: 1, borderColor: colors.sand200, marginBottom: space.lg },
  body: { padding: space.lg, gap: 4 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: space.sm },
  name: { fontSize: 20, color: colors.sage900, flexShrink: 1 },
  muted: { color: colors.muted, fontSize: 13 },
  headline: { color: colors.ink, fontSize: 15, lineHeight: 20 },
  small: { fontSize: 14, color: colors.ink },
  meta: { fontSize: 12, color: colors.muted, marginTop: 2 },
});
