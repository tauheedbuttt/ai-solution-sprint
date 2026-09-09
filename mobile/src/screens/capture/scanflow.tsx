import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../../theme/tokens';
import { SheetHeader } from '../../components/sheetheader';
import { SegmentTabs } from '../../components/segmenttabs';
import { TextField } from '../../components/textfield';
import { Select } from '../../components/select';
import { PillButton } from '../../components/pillbutton';
import { api, type product } from '../../services/api';

const categoryOptions = ['Electronics', 'Appliances', 'Furniture', 'Clothing', 'Outdoor', 'Home', 'Others'].map((c) => ({
  value: c,
  label: c,
}));

const pointOfSaleOptions = [
  { value: 'online', label: 'Online' },
  { value: 'physical_store', label: 'Physical store' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'gift', label: 'Gift' },
];

type tab = 'camera' | 'manual' | 'manualProduct';

export function ScanFlow({ onClose, onDone }: { onClose: () => void; onDone: () => void }) {
  const [tab, setTab] = useState<tab>('camera');
  const [busy, setBusy] = useState(false);
  const [match, setMatch] = useState<product | null>(null);
  const [addedLabel, setAddedLabel] = useState<string | null>(null);

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Others');
  const [barcode, setBarcode] = useState('');
  const [pointOfSaleText, setPointOfSaleText] = useState('');
  const [pointOfSale, setPointOfSale] = useState<string>();

  async function recognize(inputCode: string) {
    setBusy(true);
    try {
      const found = await api.products.recognize(inputCode);
      if (found) {
        setMatch(found);
      } else {
        setBarcode(inputCode === 'unknown' ? '' : inputCode);
        setTab('manualProduct');
      }
    } finally {
      setBusy(false);
    }
  }

  async function addMatch() {
    if (!match) return;
    setBusy(true);
    try {
      const added = await api.ownershipLog.addExisting(match.id);
      setMatch(null);
      setAddedLabel(added.name);
    } finally {
      setBusy(false);
    }
  }

  async function submitManualProduct() {
    setBusy(true);
    try {
      const added = await api.ownershipLog.addManual({
        name,
        brand: brand || undefined,
        category,
        barcode: barcode || undefined,
        pointOfSale: pointOfSaleText || undefined,
      });
      setAddedLabel(added.name);
    } finally {
      setBusy(false);
    }
  }

  if (addedLabel) {
    return (
      <View style={styles.root}>
        <SheetHeader title="Scan" onClose={onClose} />
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={48} color={color.mint} />
          <Text style={styles.centerTitle}>Added to your loop</Text>
          <Text style={styles.centerBody}>{addedLabel}</Text>
          <PillButton label="Done" onPress={onDone} />
        </View>
      </View>
    );
  }

  if (match) {
    return (
      <View style={styles.root}>
        <SheetHeader title="Scan" onClose={onClose} />
        <View style={styles.center}>
          <Text style={styles.centerTitle}>We found it</Text>
          <Text style={styles.centerBody}>{match.name}{match.brand ? ` · ${match.brand}` : ''}</Text>
          <Text style={styles.centerMuted}>{match.category}</Text>
          <PillButton label="+ Add it to my loop" onPress={addMatch} disabled={busy} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <SheetHeader title="Scan" onClose={onClose} />
      <SegmentTabs
        value={tab}
        onChange={(v) => setTab(v as tab)}
        options={[
          { value: 'camera', label: 'Camera' },
          { value: 'manual', label: 'Manual entry' },
          { value: 'manualProduct', label: 'Not in catalog' },
        ]}
      />
      <ScrollView contentContainerStyle={styles.content}>
        {tab === 'camera' ? (
          <View style={styles.viewfinderWrap}>
            <View style={styles.viewfinder}>
              <Pressable style={styles.galleryButton} onPress={() => recognize('demo')} disabled={busy}>
                <Ionicons name="image" size={20} color={color.foreground} />
              </Pressable>
              <Text style={styles.viewfinderHint}>Point your camera at a barcode</Text>
            </View>
            <PillButton label={busy ? 'Scanning…' : 'Scan'} icon="scan" onPress={() => recognize('demo')} disabled={busy} />
          </View>
        ) : null}

        {tab === 'manual' ? (
          <View style={styles.form}>
            <TextField placeholder="Barcode or product code" value={code} onChangeText={setCode} autoCapitalize="none" />
            <PillButton label="Look it up" onPress={() => recognize(code)} disabled={busy || !code} />
          </View>
        ) : null}

        {tab === 'manualProduct' ? (
          <View style={styles.form}>
            <View style={styles.notInCatalog}>
              <Ionicons name="leaf" size={16} color={color.mint} />
              <Text style={styles.notInCatalogLabel}>Not in the catalog?</Text>
            </View>
            <Text style={styles.helper}>Describe what you own. We'll check for it first, so the same thing doesn't end up in here twice.</Text>
            <TextField placeholder="Product name" value={name} onChangeText={setName} />
            <TextField placeholder="Brand (optional)" value={brand} onChangeText={setBrand} />
            <Select value={category} placeholder="Category" options={categoryOptions} onChange={setCategory} />
            <TextField placeholder="Barcode (optional)" value={barcode} onChangeText={setBarcode} autoCapitalize="none" />
            <TextField placeholder="Where you bought it (optional)" value={pointOfSaleText} onChangeText={setPointOfSaleText} />
            <Select value={pointOfSale} placeholder="Point of sale, not specified" options={pointOfSaleOptions} onChange={setPointOfSale} />
            <PillButton label="+ Add it to my loop" onPress={submitManualProduct} disabled={busy || !name} />
            <View style={styles.notInCatalog}>
              <Ionicons name="help-circle" size={14} color={color.mutedForeground} />
              <Text style={styles.footnote}>New entries start as drafts. They won't get a Care Score until we've verified enough data.</Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { padding: space.lg, gap: space.md },
  form: { gap: space.md },
  viewfinderWrap: { alignItems: 'center', gap: space.lg },
  viewfinder: {
    width: '100%',
    maxWidth: 360,
    height: 360,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
  },
  galleryButton: {
    position: 'absolute',
    top: space.md,
    right: space.md,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
  },
  viewfinderHint: { ...t.bodySmall, color: color.mutedForeground },
  notInCatalog: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  notInCatalogLabel: { ...t.eyebrow, color: color.foreground },
  helper: { ...t.bodySmall, color: color.mutedForeground },
  footnote: { ...t.bodySmall, color: color.mutedForeground, flex: 1 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.md, padding: space.lg },
  centerTitle: { ...t.h3, color: color.foreground },
  centerBody: { ...t.body, color: color.foreground },
  centerMuted: { ...t.bodySmall, color: color.mutedForeground },
});
