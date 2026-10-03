// Barra delle tab in basso. Le cartelle tra parentesi, come (tabs), raggruppano
// le schermate senza comparire nell'URL — esattamente come i route group di Next.js.
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "@/theme";

const icon = (emoji: string) => ({ focused }: { focused: boolean }) => (
  <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>{emoji}</Text>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.terra600,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.white, borderTopColor: colors.sand200 },
        headerStyle: { backgroundColor: colors.sand50 },
        headerTintColor: colors.sage900,
        sceneStyle: { backgroundColor: colors.sand50 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Esplora", headerShown: false, tabBarIcon: icon("🌿") }} />
      <Tabs.Screen name="prenotazioni" options={{ title: "Prenotazioni", tabBarIcon: icon("📅") }} />
      <Tabs.Screen name="profilo" options={{ title: "Profilo", tabBarIcon: icon("👤") }} />
    </Tabs>
  );
}
