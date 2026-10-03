import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { allCities, rootCategories, type ProviderListItem } from "@ilovewellness/core";
import { ProviderCard } from "@/components/provider-card";
import { Chip, Muted, Title } from "@/components/ui";
import { isLive } from "@/lib/env";
import { catalog } from "@/lib/supabase";
import { colors, radius, space } from "@/theme";

export default function ExploreScreen() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | undefined>();
  const [city, setCity] = useState<string | undefined>("bologna");
  const [results, setResults] = useState<ProviderListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Ricerca ogni volta che cambia un filtro (con 300 ms di attesa mentre si scrive).
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(() => {
      catalog
        .searchProviders({ q: query.trim() || undefined, category, city })
        .then((r) => { if (!cancelled) { setResults(r); setError(null); } })
        .catch((e) => !cancelled && setError(String(e.message ?? e)));
    }, 300);
    return () => { cancelled = true; clearTimeout(t); };
  }, [query, category, city]);

  const header = (
    <View style={{ gap: space.md, marginBottom: space.lg }}>
      <Text style={styles.brand}>I<Text style={{ color: colors.terra500 }}>♥</Text>Wellness</Text>
      <Title>Il benessere di cui ti puoi fidare.</Title>
      <TextInput
        style={styles.search}
        placeholder="Cerca: shiatsu, yoga, percorso termale…"
        value={query}
        onChangeText={setQuery}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="Tutto" active={!category} onPress={() => setCategory(undefined)} />
        {rootCategories().map((c) => (
          <Chip key={c.slug} label={`${c.icon} ${c.name}`} active={category === c.slug} onPress={() => setCategory(c.slug)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <Chip label="Ovunque" active={!city} onPress={() => setCity(undefined)} />
        {allCities().map((c) => (
          <Chip key={c.slug} label={`📍 ${c.name}`} active={city === c.slug} onPress={() => setCity(c.slug)} />
        ))}
      </ScrollView>
      {!isLive && <Muted>Modalità demo · dati fittizi</Muted>}
      {error && <Text style={{ color: colors.terra600 }}>Errore: {error}</Text>}
      {results && <Muted>{results.length} risultati</Muted>}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
      {/* FlatList è la lista "virtualizzata" di React Native: disegna solo le card visibili */}
      <FlatList
        data={results ?? []}
        keyExtractor={(item) => item.slug}
        renderItem={({ item }) => <ProviderCard item={item} />}
        ListHeaderComponent={header}
        ListEmptyComponent={results ? <Muted>Nessun risultato: prova a cambiare zona o filtri.</Muted> : <ActivityIndicator color={colors.sage700} />}
        contentContainerStyle={{ padding: space.lg }}
        keyboardShouldPersistTaps="handled"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  brand: { fontFamily: "Georgia", fontSize: 20, fontWeight: "700", color: colors.sage900 },
  search: {
    backgroundColor: colors.white, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.sand200,
    paddingHorizontal: space.lg, paddingVertical: space.md, fontSize: 16, color: colors.ink,
  },
});
