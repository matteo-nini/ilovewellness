// Layout radice: come app/layout.tsx in Next.js. Uno "Stack" impila le schermate
// (navigazione con il tasto indietro), dentro c'è il gruppo di tab (tabs).
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "@/lib/auth";
import { colors } from "@/theme";

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerTintColor: colors.sage900,
          headerStyle: { backgroundColor: colors.sand50 },
          contentStyle: { backgroundColor: colors.sand50 },
          headerBackTitle: "Indietro",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="operatori/[slug]" options={{ title: "" }} />
        <Stack.Screen name="accedi" options={{ presentation: "modal", title: "Accedi" }} />
      </Stack>
    </AuthProvider>
  );
}
