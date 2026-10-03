import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { router } from "expo-router";
import {
  bookingStatusLabel, formatDateTime, formatPrice, listMyBookings, transitionBooking, type Booking,
} from "@ilovewellness/core";
import { Button, Card, Muted, Title } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { colors, space } from "@/theme";

export default function BookingsScreen() {
  const { session } = useAuth();
  const [bookings, setBookings] = useState<Booking[] | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    if (!supabase || !session) return;
    setBookings(await listMyBookings(supabase, session.user.id));
  }, [session]);

  useEffect(() => { load(); }, [load]);

  if (!supabase) return <Muted style={{ margin: space.lg }}>Modalità demo: le prenotazioni sono disponibili collegando Supabase.</Muted>;
  if (!session) {
    return (
      <View style={{ padding: space.lg, gap: space.md }}>
        <Title size={22}>Accedi per vedere le tue prenotazioni</Title>
        <Button title="Accedi o registrati" onPress={() => router.push("/accedi")} />
      </View>
    );
  }

  const cancellable = (b: Booking) => ["pending", "confirmed", "awaiting_payment"].includes(b.status) && b.startsAt > new Date().toISOString();

  return (
    <FlatList
      data={bookings ?? []}
      keyExtractor={(b) => b.id}
      contentContainerStyle={{ padding: space.lg, gap: space.md }}
      // "tira giù per aggiornare", il gesto tipico delle app
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await load(); setRefreshing(false); }} />}
      ListEmptyComponent={<Muted>{bookings ? "Ancora nessuna prenotazione." : "Caricamento…"}</Muted>}
      renderItem={({ item: b }) => (
        <Card style={{ gap: 4 }}>
          <Text style={{ fontWeight: "600", textTransform: "capitalize" }}>{formatDateTime(b.startsAt)}</Text>
          <Text>{b.serviceName} · {b.providerName}</Text>
          <Muted>{formatPrice(b.priceCents)} · {bookingStatusLabel[b.status]}</Muted>
          {cancellable(b) && (
            <Button
              title="Annulla"
              variant="secondary"
              style={{ marginTop: space.sm }}
              onPress={async () => {
                await transitionBooking(supabase!, b.id, "cancelled_by_client");
                load();
              }}
            />
          )}
          {b.status === "pending" && <Text style={{ color: colors.muted, fontSize: 12 }}>In attesa della conferma dell&apos;operatore</Text>}
        </Card>
      )}
    />
  );
}
