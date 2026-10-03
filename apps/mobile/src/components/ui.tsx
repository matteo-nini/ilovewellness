// Mattoncini dell'interfaccia. In React Native: <View> ≈ <div>, <Text> ≈ <span>/<p>
// (tutto il testo DEVE stare dentro <Text>), <Pressable> ≈ <button>.
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type PressableProps, type ViewStyle } from "react-native";
import { colors, font, radius, space } from "@/theme";

export function Button({
  title, variant = "primary", loading, style, ...props
}: PressableProps & { title: string; variant?: "primary" | "secondary"; loading?: boolean; style?: ViewStyle }) {
  const primary = variant === "primary";
  return (
    <Pressable
      accessibilityRole="button"
      {...props}
      style={({ pressed }) => [
        styles.button,
        primary ? styles.buttonPrimary : styles.buttonSecondary,
        (pressed || props.disabled) && { opacity: 0.7 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={primary ? colors.white : colors.sage700} />
      ) : (
        <Text style={[styles.buttonText, { color: primary ? colors.white : colors.sage700 }]}>{title}</Text>
      )}
    </Pressable>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && { color: colors.white }]}>{label}</Text>
    </Pressable>
  );
}

export function VerifiedBadge() {
  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>✓ Verificato</Text>
    </View>
  );
}

export function Title({ children, size = 28 }: { children: React.ReactNode; size?: number }) {
  return <Text style={[font.serif, { fontSize: size, color: colors.sage900, lineHeight: size * 1.2 }]}>{children}</Text>;
}

export function Muted({ children, style }: { children: React.ReactNode; style?: object }) {
  return <Text style={[{ color: colors.muted, fontSize: 14, lineHeight: 20 }, style]}>{children}</Text>;
}

export function Card({ children, style }: { children: React.ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  button: { borderRadius: radius.md, paddingVertical: space.md, paddingHorizontal: space.lg, alignItems: "center" },
  buttonPrimary: { backgroundColor: colors.terra500 },
  buttonSecondary: { borderWidth: 1, borderColor: colors.sage300, backgroundColor: colors.white },
  buttonText: { fontSize: 16, fontWeight: "600" },
  chip: {
    borderRadius: radius.pill, borderWidth: 1, borderColor: colors.sand200, backgroundColor: colors.white,
    paddingVertical: space.sm, paddingHorizontal: space.md, marginRight: space.sm,
  },
  chipActive: { backgroundColor: colors.sage700, borderColor: colors.sage700 },
  chipText: { fontSize: 14, color: colors.ink },
  badge: { backgroundColor: colors.sage100, borderRadius: radius.pill, paddingHorizontal: space.sm, paddingVertical: 2, alignSelf: "flex-start" },
  badgeText: { color: colors.sage700, fontSize: 12, fontWeight: "600" },
  card: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.sand200, padding: space.lg },
});
