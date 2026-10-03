// Schermata modale (scorre dal basso su iOS) usata quando serve il login per prenotare.
import { ScrollView } from "react-native";
import { router } from "expo-router";
import { LoginForm } from "@/components/login-form";
import { Muted } from "@/components/ui";
import { space } from "@/theme";

export default function LoginModal() {
  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg }}>
      <Muted>Accedi o crea un account per prenotare.</Muted>
      <LoginForm onDone={() => router.back()} />
    </ScrollView>
  );
}
