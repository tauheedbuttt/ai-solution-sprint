import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { color, borderWidth, type as t, space } from '../../theme/tokens';
import { SheetHeader } from '../../components/sheetheader';
import { SegmentTabs } from '../../components/segmenttabs';
import { TextField } from '../../components/textfield';
import { Select } from '../../components/select';
import { SwitchToggle } from '../../components/switchtoggle';
import { PillButton } from '../../components/pillbutton';
import { api, type product, type partner, type careType, type route } from '../../services/api';

const careTypeOptions = [
  { value: 'clean', label: 'Clean' },
  { value: 'store', label: 'Store' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'service', label: 'Service' },
];

const routeOptions: { value: route; label: string }[] = [
  { value: 'reuse', label: 'Reuse' },
  { value: 'resell', label: 'Resell' },
  { value: 'donate', label: 'Donate' },
  { value: 'refurbish', label: 'Refurbish' },
  { value: 'recycle', label: 'Recycle' },
];

type action = 'care' | 'repair' | 'nextLife';

export function LogFlow({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<product[]>([]);
  const [selected, setSelected] = useState<product | null>(null);

  useEffect(() => {
    api.products.search(query).then(setProducts);
  }, [query]);

  if (!selected) {
    return (
      <View style={styles.root}>
        <SheetHeader title="Log" onClose={onClose} />
        <View style={styles.searchWrap}>
          <TextField placeholder="Search your products" value={query} onChangeText={setQuery} autoCapitalize="none" />
        </View>
        <ScrollView>
          {products.map((p) => (
            <Pressable key={p.id} style={styles.row} onPress={() => setSelected(p)}>
              <View>
                <Text style={styles.rowTitle}>{p.name}</Text>
                <Text style={styles.rowSubtitle}>{p.category}</Text>
              </View>
              <Text style={styles.rowBadge}>{p.status === 'draft' ? 'Draft' : p.careScore ? `Score ${p.careScore}` : ''}</Text>
            </Pressable>
          ))}
          {products.length === 0 ? <Text style={styles.empty}>No products match "{query}"</Text> : null}
        </ScrollView>
      </View>
    );
  }

  return <ProductDetail product={selected} onBack={() => setSelected(null)} onClose={onClose} onDone={onDone} />;
}

function ProductDetail({
  product,
  onBack,
  onClose,
  onDone,
}: {
  product: product;
  onBack: () => void;
  onClose: () => void;
  onDone: () => void;
}) {
  const [action, setAction] = useState<action>('care');
  const [busy, setBusy] = useState(false);
  const [partners, setPartners] = useState<partner[]>([]);

  const [careTypeValue, setCareTypeValue] = useState<string>('clean');
  const [note, setNote] = useState('');
  const [share, setShare] = useState(false);

  const [partnerId, setPartnerId] = useState<string>();
  const [issue, setIssue] = useState('');

  const [routeValue, setRouteValue] = useState<string>('reuse');
  const [nextLifePartnerId, setNextLifePartnerId] = useState<string>();
  const [retainedValue, setRetainedValue] = useState('');

  useEffect(() => {
    api.partners.list().then(setPartners);
  }, []);

  async function submitCare() {
    setBusy(true);
    try {
      await api.ownershipLog.logCare(product.id, { type: careTypeValue as careType, note: note || undefined, shareAsRepairKnowledge: share });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  async function submitRepair() {
    if (!partnerId) return;
    setBusy(true);
    try {
      await api.ownershipLog.requestRepair(product.id, { partnerId, issue });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  async function submitNextLife() {
    setBusy(true);
    try {
      await api.ownershipLog.routeNextLife(product.id, {
        route: routeValue as route,
        partnerId: nextLifePartnerId,
        retainedValue: retainedValue ? Number(retainedValue) : undefined,
      });
      onDone();
    } finally {
      setBusy(false);
    }
  }

  const partnerOptions = partners.map((p) => ({ value: p.id, label: p.name }));

  return (
    <View style={styles.root}>
      <SheetHeader title={product.name} onClose={onClose} onBack={onBack} />
      <SegmentTabs
        value={action}
        onChange={(v) => setAction(v as action)}
        options={[
          { value: 'care', label: 'Log care' },
          { value: 'repair', label: 'Find repair' },
          { value: 'nextLife', label: 'Next life' },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {action === 'care' ? (
          <View style={styles.form}>
            <Text style={styles.title}>Log a care event</Text>
            <Select value={careTypeValue} placeholder="Care event type" options={careTypeOptions} onChange={setCareTypeValue} />
            <TextField
              placeholder="Optional note (what you did, products used…)"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
            <View style={styles.toggleRow}>
              <SwitchToggle value={share} onChange={setShare} />
              <Text style={styles.toggleLabel}>Share this note as repair knowledge with the community</Text>
            </View>
            <PillButton label="+ Log event" onPress={submitCare} disabled={busy} />
          </View>
        ) : null}

        {action === 'repair' ? (
          <View style={styles.form}>
            <Text style={styles.title}>Request a repair</Text>
            <Select value={partnerId} placeholder="Choose a partner" options={partnerOptions} onChange={setPartnerId} />
            <TextField
              placeholder="Describe the issue"
              value={issue}
              onChangeText={setIssue}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
            <PillButton label="Request repair" icon="build" onPress={submitRepair} disabled={busy || !partnerId} />
          </View>
        ) : null}

        {action === 'nextLife' ? (
          <View style={styles.form}>
            <Text style={styles.title}>Route to its next life</Text>
            <Select value={routeValue} placeholder="Route" options={routeOptions} onChange={setRouteValue} />
            <Select value={nextLifePartnerId} placeholder="Partner (optional)" options={partnerOptions} onChange={setNextLifePartnerId} />
            <TextField
              placeholder="Retained value (€, optional)"
              value={retainedValue}
              onChangeText={setRetainedValue}
              keyboardType="numeric"
            />
            <PillButton label="Route it" icon="sync" onPress={submitNextLife} disabled={busy} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  searchWrap: { padding: space.lg, paddingBottom: 0 },
  content: { padding: space.lg, gap: space.md },
  form: { gap: space.md },
  title: { ...t.h3, color: color.foreground },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  toggleLabel: { ...t.bodySmall, color: color.foreground, flex: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  rowTitle: { ...t.body, color: color.foreground },
  rowSubtitle: { ...t.bodySmall, color: color.mutedForeground },
  rowBadge: { ...t.eyebrow, color: color.mint },
  empty: { ...t.bodySmall, color: color.mutedForeground, padding: space.lg },
});
