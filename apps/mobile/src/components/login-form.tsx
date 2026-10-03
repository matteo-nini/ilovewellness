import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { colors, radius, space } from "@/theme";
import { Button, Chip, Muted } from "./ui";

/** Accesso/registrazione con email e password: lo stesso account vale per sito e app. */
export function LoginForm({ onDone }: { onDone?: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!supabase) return <Muted>Modalità demo: collega Supabase con il file .env.local per accedere.</Muted>;

  async function submit() {
    if (!supabase) return;
    setBusy(true);
    setMessage(null);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setBusy(false);
      if (error) return setMessage("Email o password non corretti.");
      onDone?.();
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: { data: { full_name: name.trim() } },
      });
      setBusy(false);
      if (error) return setMessage(error.message);
      if (data.session) onDone?.();
      else setMessage("Controlla la tua email e clicca il link di conferma, poi accedi.");
    }
  }

  return (
    <View style={{ gap: space.md }}>
      <View style={{ flexDirection: "row" }}>
        <Chip label="Accedi" active={mode === "login"} onPress={() => setMode("login")} />
        <Chip label="Registrati" active={mode === "signup"} onPress={() => setMode("signup")} />
      </View>
      {mode === "signup" && (
        <TextInput style={styles.input} placeholder="Nome e cognome" value={name} onChangeText={setName} autoComplete="name" />
      )}
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
      />
      <TextInput
        style={styles.input}
        placeholder="Password (min. 8 caratteri)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete={mode === "login" ? "current-password" : "new-password"}
      />
      {message && <Text style={{ color: colors.terra600 }}>{message}</Text>}
      <Button title={mode === "login" ? "Accedi" : "Crea account"} onPress={submit} loading={busy} disabled={busy || !email || password.length < 8} />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.white, borderWidth: 1, borderColor: colors.sand200, borderRadius: radius.md,
    paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16, color: colors.ink,
  },
});
