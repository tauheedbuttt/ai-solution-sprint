import { useState, type ReactNode } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../../theme/tokens';
import { SegmentTabs } from '../../components/segmenttabs';
import { StatCard } from '../../components/statcard';
import { PillButton } from '../../components/pillbutton';
import { CaptureIdentify } from '../capture/captureidentify';
import { api, type carePass, type carePassEvent } from '../../services/api';

type view = 'capture' | 'notFound' | 'result';
type tab = 'camera' | 'manual';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function VerifyScreen() {
  const [view, setView] = useState<view>('capture');
  const [tab, setTab] = useState<tab>('camera');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [carePass, setCarePass] = useState<carePass | null>(null);

  async function lookup(inputCode: string) {
    setBusy(true);
    try {
      const found = await api.carePass.resolve(inputCode);
      if (found) {
        setCarePass(found);
        setView('result');
      } else {
        setView('notFound');
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setCarePass(null);
    setCode('');
    setTab('camera');
    setView('capture');
  }

  if (view === 'notFound') {
    return (
      <View style={styles.emptyRoot}>
        <Ionicons name="help-circle-outline" size={48} color={color.mutedForeground} />
        <Text style={styles.emptyTitle}>No Care Pass found</Text>
        <Text style={styles.emptyBody}>That code doesn't match anything in CareLoop's records.</Text>
        <PillButton label="Try again" onPress={reset} />
      </View>
    );
  }

  if (view === 'result' && carePass) {
    return <CarePassView carePass={carePass} onReset={reset} />;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>verify</Text>
        <Text style={styles.title}>Check a Care Pass</Text>
      </View>
      <SegmentTabs
        value={tab}
        onChange={(v) => setTab(v as tab)}
        options={[
          { value: 'camera', label: 'Camera' },
          { value: 'manual', label: 'Manual entry' },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <CaptureIdentify
          tab={tab}
          code={code}
          onCodeChange={setCode}
          busy={busy}
          onCapture={lookup}
          scanLabel="Verify"
          lookupLabel="Verify"
        />
      </ScrollView>
    </View>
  );
}

function CarePassView({ carePass, onReset }: { carePass: carePass; onReset: () => void }) {
  return (
    <View style={styles.root}>
      <View style={styles.topBar}>
        <Pressable onPress={onReset} hitSlop={8} style={styles.topBarBack}>
          <Ionicons name="chevron-back" size={22} color={color.foreground} />
          <Text style={styles.topBarLabel}>Verify another</Text>
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.identity}>
          <Text style={styles.eyebrow}>care pass</Text>
          <Text style={styles.title}>{carePass.name}</Text>
          <Text style={styles.subtitle}>
            {carePass.brand ? `${carePass.brand} · ` : ''}
            {carePass.category} · {carePass.status === 'active' ? 'Active' : carePass.status === 'draft' ? 'Draft' : 'Routed'}
          </Text>
        </View>

        <View style={styles.statGrid}>
          <StatCard label="Trust score" value={String(carePass.trustScore)} suffix="/100" size="compact" />
          <StatCard label="Confidence" value={carePass.confidence} size="compact" />
          <StatCard label="Repairability" value={String(carePass.repairability)} suffix="/100" size="compact" />
          <StatCard label="Expected lifespan" value={String(carePass.expectedLifespanYears)} suffix="yrs" size="compact" />
          <StatCard label="In use since" value={formatDate(carePass.inUseSince)} size="compact" />
        </View>

        <Section title="Care & repair history">
          {carePass.history.length === 0 ? (
            <Text style={styles.sectionEmpty}>No events logged yet.</Text>
          ) : (
            carePass.history.map((event) => <EventRow key={event.id} event={event} />)
          )}
        </Section>

        <Section title="Repairs">
          {carePass.repairs.length === 0 ? (
            <Text style={styles.sectionEmpty}>No repairs logged.</Text>
          ) : (
            carePass.repairs.map((event) => <EventRow key={event.id} event={event} />)
          )}
        </Section>

        <Section title="Next life">
          <View style={styles.nextLifeCard}>
            <Ionicons name="leaf-outline" size={16} color={color.mint} />
            <Text style={styles.nextLifeLabel}>{carePass.nextLifeStatus}</Text>
          </View>
        </Section>

        <Section title="Purchase history">
          {carePass.purchaseHistory.length === 0 ? (
            <Text style={styles.sectionEmpty}>No purchase record on file.</Text>
          ) : (
            carePass.purchaseHistory.map((purchase) => (
              <View key={purchase.id} style={styles.purchaseRow}>
                <View>
                  <Text style={styles.purchaseRetailer}>{purchase.retailer}</Text>
                  <Text style={styles.purchaseDate}>{formatDate(purchase.date)}</Text>
                </View>
                <Text style={styles.purchasePrice}>€{purchase.price}</Text>
              </View>
            ))
          )}
        </Section>

        <Text style={styles.disclaimer}>
          A Care Pass is an ownership record issued by The Care Loop. It is not a Digital Product Passport and is not independently
          verified.
        </Text>
      </ScrollView>
    </View>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function EventRow({ event }: { event: carePassEvent }) {
  return (
    <View style={styles.eventRow}>
      <Ionicons name={event.kind === 'repair' ? 'build-outline' : 'sparkles-outline'} size={16} color={color.mint} />
      <View style={styles.eventBody}>
        <Text style={styles.eventLabel}>{event.label}</Text>
        {event.note ? <Text style={styles.eventNote}>{event.note}</Text> : null}
      </View>
      <Text style={styles.eventDate}>{formatDate(event.date)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  header: { padding: space.lg, paddingBottom: space.sm, gap: space.xs },
  eyebrow: { ...t.eyebrow, color: color.mint },
  title: { ...t.h2, color: color.foreground },
  content: { padding: space.lg, gap: space.lg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  topBarBack: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  topBarLabel: { ...t.body, color: color.foreground },
  identity: { gap: space.xs },
  subtitle: { ...t.bodySmall, color: color.mutedForeground },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  section: { gap: space.sm },
  sectionTitle: { ...t.h3, color: color.foreground },
  sectionEmpty: { ...t.bodySmall, color: color.mutedForeground },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.md,
  },
  eventBody: { flex: 1, gap: 2 },
  eventLabel: { ...t.body, color: color.foreground },
  eventNote: { ...t.bodySmall, color: color.mutedForeground },
  eventDate: { ...t.bodySmall, color: color.mutedForeground },
  nextLifeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.md,
  },
  nextLifeLabel: { ...t.body, color: color.foreground },
  purchaseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.md,
  },
  purchaseRetailer: { ...t.body, color: color.foreground },
  purchaseDate: { ...t.bodySmall, color: color.mutedForeground },
  purchasePrice: { ...t.body, fontWeight: '600', color: color.brownInk },
  disclaimer: { ...t.bodySmall, color: color.mutedForeground, fontStyle: 'italic' },
  emptyRoot: {
    flex: 1,
    backgroundColor: color.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  emptyTitle: { ...t.h2, color: color.foreground, textAlign: 'center' },
  emptyBody: { ...t.body, color: color.mutedForeground, textAlign: 'center', maxWidth: 280, marginBottom: space.sm },
});
