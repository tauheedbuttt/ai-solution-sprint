import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { color, type as t, space } from '../../theme/tokens';
import { EventCard } from '../../components/eventcard';
import { StatCard } from '../../components/statcard';
import { api, type event, type summary } from '../../services/api';

export function HomeScreen() {
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

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content}>
      {events.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {events.map((e) => (
            <EventCard key={e.id} title={e.title} subtitle={e.subtitle} />
          ))}
        </ScrollView>
      ) : null}

      {summary ? (
        <View style={styles.stats}>
          <StatCard
            label="Your Care Score"
            value={String(summary.careScore)}
            suffix="/100"
            valueColor={color.brownInk}
            description={summary.careScoreNote}
            progress={summary.careScore / 100}
          />
          <StatCard
            label="Care Contribution"
            value={String(summary.careContribution)}
            description={summary.careContributionNote}
            footnote={`~€${summary.retainedValue} value retained`}
          />
          <StatCard label="Care events logged" value={String(summary.careEventsLogged)} />
          <StatCard label="Still in use" value={String(summary.stillInUse)} />
          <StatCard label="Months of life added" value={String(summary.monthsOfLifeAdded)} />
          <StatCard label="Items in your loop" value={String(summary.itemsInLoop)} />
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { paddingVertical: space.lg, gap: space.lg },
  carousel: { paddingHorizontal: space.lg, gap: space.md },
  stats: { paddingHorizontal: space.lg, gap: space.md },
});
