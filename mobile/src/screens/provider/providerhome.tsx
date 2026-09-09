import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { color, type as t, space } from '../../theme/tokens';
import { SegmentTabs } from '../../components/segmenttabs';
import { TextField } from '../../components/textfield';
import { PillButton } from '../../components/pillbutton';
import { AppBar } from '../../components/appbar';
import { CaptureIdentify } from '../capture/captureidentify';
import { api, type product } from '../../services/api';

type view = 'capture' | 'notFound' | 'logging' | 'success';
type tab = 'camera' | 'manual';

export function ProviderHome() {
  const [view, setView] = useState<view>('capture');
  const [tab, setTab] = useState<tab>('camera');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [product, setProduct] = useState<product | null>(null);
  const [summary, setSummary] = useState('');
  const [note, setNote] = useState('');

  async function identify(inputCode: string) {
    setBusy(true);
    try {
      const found = await api.products.recognize(inputCode);
      if (found) {
        setProduct(found);
        setView('logging');
      } else {
        setView('notFound');
      }
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setProduct(null);
    setCode('');
    setSummary('');
    setNote('');
    setTab('camera');
    setView('capture');
  }

  async function submit() {
    if (!product || !summary) return;
    setBusy(true);
    try {
      await api.repairLog.add(product.id, { summary, note: note || undefined });
      setView('success');
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    if (view !== 'success') return;
    const timer = setTimeout(reset, 1400);
    return () => clearTimeout(timer);
  }, [view]);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <AppBar />

      {view === 'notFound' ? (
        <View style={styles.emptyRoot}>
          <Ionicons name="help-circle-outline" size={48} color={color.mutedForeground} />
          <Text style={styles.emptyTitle}>No product found</Text>
          <Text style={styles.emptyBody}>That code doesn't match anything in CareLoop's records.</Text>
          <PillButton label="Try again" onPress={reset} />
        </View>
      ) : null}

      {view === 'success' ? (
        <View style={styles.emptyRoot}>
          <Ionicons name="checkmark-circle" size={48} color={color.mint} />
          <Text style={styles.emptyTitle}>Repair logged</Text>
          <Text style={styles.emptyBody}>Ready for the next item.</Text>
        </View>
      ) : null}

      {view === 'capture' ? (
        <>
          <View style={styles.header}>
            <Text style={styles.eyebrow}>repair log</Text>
            <Text style={styles.title}>Identify a product</Text>
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
              onCapture={identify}
              scanLabel="Scan"
              lookupLabel="Look it up"
            />
          </ScrollView>
        </>
      ) : null}

      {view === 'logging' && product ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.identity}>
            <Text style={styles.eyebrow}>identified</Text>
            <Text style={styles.title}>{product.name}</Text>
            {product.brand ? <Text style={styles.subtitle}>{product.brand}</Text> : null}
          </View>
          <View style={styles.form}>
            <TextField placeholder="What was fixed" value={summary} onChangeText={setSummary} />
            <TextField
              placeholder="Notes (optional)"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={4}
              style={styles.textarea}
            />
            <PillButton label="Log repair" onPress={submit} disabled={busy || !summary} />
          </View>
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  header: { padding: space.lg, paddingBottom: space.sm, gap: space.xs },
  eyebrow: { ...t.eyebrow, color: color.mint },
  title: { ...t.h2, color: color.foreground },
  subtitle: { ...t.bodySmall, color: color.mutedForeground },
  content: { padding: space.lg, gap: space.lg },
  identity: { gap: space.xs, marginBottom: space.sm },
  form: { gap: space.md },
  textarea: { minHeight: 90, textAlignVertical: 'top' },
  emptyRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: space.xl,
    gap: space.sm,
  },
  emptyTitle: { ...t.h2, color: color.foreground, textAlign: 'center' },
  emptyBody: { ...t.body, color: color.mutedForeground, textAlign: 'center', maxWidth: 280, marginBottom: space.sm },
});
