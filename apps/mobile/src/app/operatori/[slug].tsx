// Scheda operatore: l'equivalente di apps/web/src/app/operatori/[slug]/page.tsx.
// Il parametro [slug] si legge con useLocalSearchParams (in Next arriva come props.params).
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, router, useLocalSearchParams } from "expo-router";
import {
  createBooking, formatDuration, formatPrice, modeLabel, policyLabel, ratingOf, romeToIso,
  type DaySlots, type Provider,
} from "@ilovewellness/core";
import { Cover } from "@/components/provider-card";
import { Button, Card, Muted, Title, VerifiedBadge } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { catalog, supabase } from "@/lib/supabase";
import { colors, radius, space } from "@/theme";

const dayFmt = new Intl.DateTimeFormat("it-IT", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const asUtcNoon = (d: string) => new Date(`${d}T12:00:00Z`);

function notify(title: string, message: string) {
  // Alert nativo su iOS/Android; sul web si usa window.alert
  if (Platform.OS === "web") window.alert(`${title}\n\n${message}`);
  else Alert.alert(title, message);
}

export default function ProviderScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { session } = useAuth();
  const [provider, setProvider] = useState<Provider | null | undefined>(undefined);
  const [serviceId, setServiceId] = useState<string | undefined>();
  const [days, setDays] = useState<DaySlots[] | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [slot, setSlot] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    catalog.getProvider(slug).then((p) => {
      setProvider(p);
      setServiceId(p?.services[0]?.id);
    });
  }, [slug]);

  const service = provider?.services.find((s) => s.id === serviceId);

  useEffect(() => {
    if (!provider || !service) return;
    let cancelled = false;
    catalog.availableSlots(provider, service).then((d) => !cancelled && setDays(d)).catch(() => !cancelled && setDays([]));
    return () => { cancelled = true; };
  }, [provider, service, reload]);

  if (provider === undefined) return <ActivityIndicator style={{ marginTop: 40 }} color={colors.sage700} />;
  if (!provider) return <Muted style={{ margin: space.lg }}>Operatore non trovato.</Muted>;

  const { avg, count } = ratingOf(provider);
  const selectedDay = days?.find((d) => d.date === day && d.slots.length) ?? days?.find((d) => d.slots.length);

  async function book() {
    if (!provider || !service || !selectedDay || !slot) return;
    if (!supabase) {
      notify("Modalità demo", "Prenotazione simulata: collega Supabase per prenotare davvero.");
      return;
    }
    if (!session) {
      router.push("/accedi");
      return;
    }
    setBusy(true);
    try {
      const b = await createBooking(supabase, {
        userId: session.user.id,
        providerId: provider.id!,
        serviceId: service.id,
        startsAt: romeToIso(selectedDay.date, slot),
      });
      notify(
        b.status === "confirmed" ? "Prenotazione confermata 🎉" : "Richiesta inviata ✉️",
        `${service.name} · ${dayFmt.format(asUtcNoon(selectedDay.date))} alle ${slot}`,
      );
      setSlot(null);
      setReload((r) => r + 1);
    } catch (e) {
      notify("Non è stato possibile prenotare", e instanceof Error ? e.message : String(e));
      setReload((r) => r + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: provider.displayName }} />
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }}>
        <Cover name={provider.displayName} palette={provider.palette} height={180} />
        <View style={{ padding: space.lg, gap: space.lg }}>
          <View style={{ gap: space.sm }}>
            <Title size={30}>{provider.displayName}</Title>
            {provider.verified && <VerifiedBadge />}
            <Text style={{ fontSize: 16, color: colors.ink }}>{provider.headline}</Text>
            <Muted>
              {count ? `★ ${avg.toFixed(1)} (${count}) · ` : ""}📍 {provider.location.address}, {provider.location.city}
            </Muted>
          </View>

          <Text style={styles.body}>{provider.bio}</Text>

          <View style={{ gap: space.sm }}>
            <Title size={22}>Scegli il servizio</Title>
            {provider.services.map((s) => (
              <Pressable
                key={s.id}
                onPress={() => { setServiceId(s.id); setDays(null); setDay(null); setSlot(null); }}
                style={[styles.service, s.id === serviceId && styles.serviceActive]}
                accessibilityRole="radio"
                accessibilityState={{ checked: s.id === serviceId }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontWeight: "600", color: colors.ink }}>{s.name}</Text>
                  <Muted>{formatDuration(s.durationMin)} · {modeLabel[s.mode]}</Muted>
                </View>
                <Text style={{ fontFamily: "Georgia", fontSize: 18 }}>{formatPrice(s.priceCents)}</Text>
              </Pressable>
            ))}
            {service && <Muted>{policyLabel[service.cancellationPolicy]}</Muted>}
          </View>

          <View style={{ gap: space.sm }}>
            <Title size={22}>Quando?</Title>
            {!days ? (
              <ActivityIndicator color={colors.sage700} />
            ) : (
              <>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {days.map((d) => {
                    const active = selectedDay?.date === d.date;
                    return (
                      <Pressable
                        key={d.date}
                        disabled={!d.slots.length}
                        onPress={() => { setDay(d.date); setSlot(null); }}
                        style={[styles.day, active && styles.dayActive, !d.slots.length && { opacity: 0.35 }]}
                      >
                        <Text style={{ color: active ? colors.white : colors.ink, textTransform: "capitalize" }}>{dayFmt.format(asUtcNoon(d.date))}</Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>
                {selectedDay ? (
                  <View style={styles.slots}>
                    {selectedDay.slots.map((t) => (
                      <Pressable key={t} onPress={() => setSlot(t)} style={[styles.slot, slot === t && styles.slotActive]}>
                        <Text style={{ color: slot === t ? colors.white : colors.ink }}>{t}</Text>
                      </Pressable>
                    ))}
                  </View>
                ) : (
                  <Muted>Nessuna disponibilità nelle prossime due settimane.</Muted>
                )}
              </>
            )}
          </View>

          {service && slot && selectedDay && (
            <Card style={{ gap: space.sm }}>
              <Text style={{ fontWeight: "600" }}>{service.name}</Text>
              <Muted>{dayFmt.format(asUtcNoon(selectedDay.date))} alle {slot} · {formatPrice(service.priceCents)} · pagamento in struttura</Muted>
              <Button title={provider.instantBooking ? "Prenota" : "Invia richiesta"} onPress={book} loading={busy} />
            </Card>
          )}

          <Muted style={{ fontSize: 12 }}>
            Le discipline del benessere non sostituiscono diagnosi o cure mediche.
          </Muted>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  body: { fontSize: 16, lineHeight: 24, color: colors.ink },
  service: {
    flexDirection: "row", alignItems: "center", gap: space.md, padding: space.md,
    borderRadius: radius.md, borderWidth: 1, borderColor: colors.sand200, backgroundColor: colors.white,
  },
  serviceActive: { borderColor: colors.sage700, borderWidth: 2 },
  day: { borderRadius: radius.md, borderWidth: 1, borderColor: colors.sand200, paddingVertical: space.sm, paddingHorizontal: space.md, marginRight: space.sm, backgroundColor: colors.white },
  dayActive: { backgroundColor: colors.sage700, borderColor: colors.sage700 },
  slots: { flexDirection: "row", flexWrap: "wrap", gap: space.sm },
  slot: { borderRadius: radius.sm, borderWidth: 1, borderColor: colors.sand200, paddingVertical: space.sm, width: "22%", alignItems: "center", backgroundColor: colors.white },
  slotActive: { backgroundColor: colors.terra500, borderColor: colors.terra500 },
});
