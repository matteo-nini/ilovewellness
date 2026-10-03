import { ScrollView, View } from "react-native";
import { LoginForm } from "@/components/login-form";
import { Button, Card, Muted, Title } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { space } from "@/theme";

export default function ProfileScreen() {
  const { session } = useAuth();
  return (
    <ScrollView contentContainerStyle={{ padding: space.lg, gap: space.lg }}>
      {session ? (
        <Card style={{ gap: space.md }}>
          <Title size={22}>Ciao!</Title>
          <Muted>{session.user.email}</Muted>
          <Muted>L&apos;area operatore (gestione prenotazioni ricevute) per ora è sul sito web.</Muted>
          <Button title="Esci" variant="secondary" onPress={() => supabase?.auth.signOut()} />
        </Card>
      ) : (
        <View style={{ gap: space.md }}>
          <Title size={22}>Il tuo account</Title>
          <Muted>Lo stesso account funziona sul sito e sull&apos;app.</Muted>
          <LoginForm />
        </View>
      )}
      <Muted style={{ fontSize: 12 }}>ILoveWellness · versione 0.1 di sviluppo</Muted>
    </ScrollView>
  );
}
