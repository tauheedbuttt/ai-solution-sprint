import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { color, type as t, space } from "../../theme/tokens";
import { EventCarousel } from "../../components/eventcarousel";
import { StatCard } from "../../components/statcard";
import { useAuth } from "../../services/auth/context";
import { api, type event, type summary } from "../../services/api";

export function HomeScreen() {
  const { user } = useAuth();
  const [events, setEvents] = useState<event[]>([]);
  const [summary, setSummary] = useState<summary>();

  useEffect(() => {
    function load() {
      api.events.list().then(setEvents);
      api.stats.summary().then(setSummary);
    }
    load();
    return api.subscribe(load);
  }, []);

  const name = user ? displayName(user.email) : "";

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      <View style={styles.greeting}>
        <Text style={styles.eyebrow}>the careloop</Text>
        <Text style={styles.hi}>Hi, {name}</Text>
      </View>

      <EventCarousel events={events} />

      {summary ? (
        <View style={styles.stats}>
          <StatCard
            size="hero"
            label="Your Care Score"
            value={String(summary.careScore)}
            suffix="/100"
            valueColor={color.brownInk}
            description={summary.careScoreNote}
            progress={summary.careScore / 100}
          />
          <View style={styles.bento}>
            <View style={styles.bentoBig}>
              <StatCard
                size="bento"
                icon="cube"
                label="Items"
                value={String(summary.itemsInLoop)}
              />
            </View>
            <View style={styles.bentoCol}>
              <StatCard
                size="compact"
                icon="checkmark-done"
                label="Events"
                value={String(summary.careEventsLogged)}
              />
              <StatCard
                size="compact"
                icon="time"
                label="In use"
                value={String(summary.stillInUse)}
              />
            </View>
          </View>

          <StatCard
            layout="row"
            icon="trending-up"
            label="Months of life added"
            value={String(summary.monthsOfLifeAdded)}
          />

          <StatCard
            layout="row"
            icon="leaf"
            label="Care Contribution"
            value={String(summary.careContribution)}
            footnote={`~€${summary.retainedValue} value retained`}
          />
        </View>
      ) : null}
    </ScrollView>
  );
}

function displayName(email: string) {
  const handle = email.split("@")[0] || email;
  return handle.charAt(0).toUpperCase() + handle.slice(1);
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { paddingVertical: space.lg, gap: space.lg },
  greeting: { paddingHorizontal: space.lg, gap: 2 },
  eyebrow: { ...t.eyebrow, color: color.mint },
  hi: { ...t.h2, color: color.foreground },
  stats: { paddingHorizontal: space.lg, gap: space.sm },
  bento: { flexDirection: "row", gap: space.sm },
  bentoBig: { flex: 1.2 },
  bentoCol: { flex: 1, gap: space.sm },
});
