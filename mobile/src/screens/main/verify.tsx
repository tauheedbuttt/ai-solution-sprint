import { useState, type ReactNode } from 'react';
import { View, Text, ScrollView, Pressable, Modal, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, font, type as t, space } from '../../theme/tokens';
import { SegmentTabs } from '../../components/segmenttabs';
import { StatCard } from '../../components/statcard';
import { PillButton } from '../../components/pillbutton';
import { Timeline, type timelineItem } from '../../components/timeline';
import { CaptureIdentify } from '../capture/captureidentify';
import { api, type carePass, type purchaseRecord } from '../../services/api';

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
  const [receiptFor, setReceiptFor] = useState<purchaseRecord | null>(null);
  const origin = carePass.purchaseHistory[0];
  const timeline: timelineItem[] = [
    ...carePass.history.map((event) => ({ id: event.id, kind: event.kind, label: event.label, date: event.date, note: event.note })),
    ...(origin ? [{ id: origin.id, kind: 'origin' as const, label: 'Purchased', date: origin.date, note: `Origin of this Care Pass · ${origin.retailer}` }] : []),
  ];

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
        </View>
        <StatCard label="In use since" value={formatDate(carePass.inUseSince)} size="compact" />

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Lifecycle</Text>
            <View style={styles.lifecyclePill}>
              <Text style={styles.lifecyclePillLabel}>{carePass.nextLifeStatus}</Text>
            </View>
          </View>
          <Text style={styles.sectionSubtitle}>Care, repairs and origin in one timeline</Text>

          <Timeline items={timeline} />
        </View>

        <Section title="Purchase history">
          {carePass.purchaseHistory.length === 0 ? (
            <Text style={styles.sectionEmpty}>No purchase record on file.</Text>
          ) : (
            carePass.purchaseHistory.map((purchase) => (
              <Pressable key={purchase.id} onPress={() => setReceiptFor(purchase)} style={styles.purchaseRow}>
                <View>
                  <Text style={styles.purchaseRetailer}>{purchase.retailer}</Text>
                  <Text style={styles.purchaseDate}>{formatDate(purchase.date)}</Text>
                </View>
                <View style={styles.purchaseRight}>
                  <Text style={styles.purchasePrice}>€{purchase.price}</Text>
                  <View style={styles.purchaseReceiptLink}>
                    <Text style={styles.purchaseReceiptLinkLabel}>View receipt</Text>
                    <Ionicons name="chevron-forward" size={12} color={color.mutedForeground} />
                  </View>
                </View>
              </Pressable>
            ))
          )}
        </Section>

        <Text style={styles.disclaimer}>
          A Care Pass is an ownership record issued by The Care Loop. It is not a Digital Product Passport and is not independently
          verified.
        </Text>
      </ScrollView>

      <ReceiptModal
        purchase={receiptFor}
        itemName={carePass.name}
        onClose={() => setReceiptFor(null)}
      />
    </View>
  );
}

const barcodeBars = [3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 4, 1, 2];

function ReceiptModal({
  purchase,
  itemName,
  onClose,
}: {
  purchase: purchaseRecord | null;
  itemName: string;
  onClose: () => void;
}) {
  return (
    <Modal visible={!!purchase} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.receiptOverlay} onPress={onClose}>
        {purchase ? (
          <Pressable style={styles.receiptCard} onPress={() => {}}>
            <View style={[styles.receiptScallopRow, styles.receiptScallopTop]}>
              {barcodeBars.map((_, i) => (
                <View key={i} style={styles.receiptScallopDot} />
              ))}
            </View>

            <Text style={styles.receiptShop}>{purchase.retailer}</Text>
            {purchase.address ? <Text style={styles.receiptMeta}>{purchase.address}</Text> : null}
            {purchase.phone ? <Text style={styles.receiptMeta}>{purchase.phone}</Text> : null}

            <View style={styles.receiptDivider} />
            <Text style={styles.receiptTitle}>PURCHASE RECEIPT</Text>
            <View style={styles.receiptDivider} />

            <View style={styles.receiptLineRow}>
              <Text style={styles.receiptLineHead}>Description</Text>
              <Text style={styles.receiptLineHead}>Price</Text>
            </View>
            <View style={styles.receiptLineRow}>
              <Text style={styles.receiptLineText}>{itemName}</Text>
              <Text style={styles.receiptLineText}>{purchase.price.toFixed(2)}</Text>
            </View>

            <View style={styles.receiptDivider} />
            <View style={styles.receiptLineRow}>
              <Text style={styles.receiptTotalLabel}>Total</Text>
              <Text style={styles.receiptTotalLabel}>€{purchase.price.toFixed(2)}</Text>
            </View>

            {purchase.card ? (
              <View style={styles.receiptLineRow}>
                <Text style={styles.receiptMetaRow}>Card</Text>
                <Text style={styles.receiptMetaRow}>{purchase.card}</Text>
              </View>
            ) : null}
            {purchase.approvalCode ? (
              <View style={styles.receiptLineRow}>
                <Text style={styles.receiptMetaRow}>Approval Code</Text>
                <Text style={styles.receiptMetaRow}>{purchase.approvalCode}</Text>
              </View>
            ) : null}

            <View style={styles.receiptDivider} />
            <Text style={styles.receiptThanks}>THANK YOU!</Text>

            <View style={styles.receiptBarcode}>
              {barcodeBars.map((w, i) => (
                <View key={i} style={{ width: w, height: '100%', backgroundColor: '#111', marginRight: 2 }} />
              ))}
            </View>
            <Text style={styles.receiptFootnote}>Uploaded by owner · verified copy</Text>

            <View style={[styles.receiptScallopRow, styles.receiptScallopBottom]}>
              {barcodeBars.map((_, i) => (
                <View key={i} style={styles.receiptScallopDot} />
              ))}
            </View>
          </Pressable>
        ) : null}
      </Pressable>
    </Modal>
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
  sectionHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { ...t.h3, color: color.foreground },
  sectionSubtitle: { ...t.bodySmall, color: color.mutedForeground, marginTop: -space.xs },
  sectionEmpty: { ...t.bodySmall, color: color.mutedForeground },
  lifecyclePill: {
    borderWidth: borderWidth.hairline,
    borderColor: color.mint,
    paddingHorizontal: space.sm,
    paddingVertical: 4,
  },
  lifecyclePillLabel: { ...t.bodySmall, fontWeight: '600', color: color.mint },
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
  purchaseRight: { alignItems: 'flex-end', gap: 4 },
  purchasePrice: { ...t.body, fontWeight: '600', color: color.brownInk },
  purchaseReceiptLink: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  purchaseReceiptLinkLabel: { ...t.bodySmall, color: color.mutedForeground },
  disclaimer: { ...t.bodySmall, color: color.mutedForeground, fontStyle: 'italic' },
  receiptOverlay: { flex: 1, backgroundColor: color.background, alignItems: 'center', justifyContent: 'center', padding: space.lg },
  receiptCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#f5f3ec',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 18,
    transform: [{ rotate: '-1deg' }],
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 12,
  },
  receiptScallopRow: { flexDirection: 'row', justifyContent: 'space-between' },
  receiptScallopTop: { marginTop: -8, marginBottom: 10 },
  receiptScallopBottom: { marginTop: 10, marginBottom: -8 },
  receiptScallopDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: color.background },
  receiptShop: { textAlign: 'center', fontFamily: font.mono, fontWeight: '700', fontSize: 16, letterSpacing: 0.5, color: '#1a1a1a' },
  receiptMeta: { textAlign: 'center', fontFamily: font.mono, fontSize: 11, color: '#555', marginTop: 2 },
  receiptDivider: { borderTopWidth: 1, borderStyle: 'dashed', borderTopColor: '#999', marginVertical: 10 },
  receiptTitle: { textAlign: 'center', fontFamily: font.mono, fontSize: 12, letterSpacing: 1, color: '#333' },
  receiptLineRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 2 },
  receiptLineHead: { fontFamily: font.mono, fontSize: 11, fontWeight: '700', color: '#333' },
  receiptLineText: { fontFamily: font.mono, fontSize: 12, color: '#222' },
  receiptTotalLabel: { fontFamily: font.mono, fontSize: 16, fontWeight: '800', color: '#111' },
  receiptMetaRow: { fontFamily: font.mono, fontSize: 11, color: '#444' },
  receiptThanks: { textAlign: 'center', fontFamily: font.mono, fontSize: 12, fontWeight: '700', letterSpacing: 0.5, color: '#111', marginTop: 4 },
  receiptBarcode: { flexDirection: 'row', height: 36, marginTop: 14, justifyContent: 'center', alignItems: 'stretch' },
  receiptFootnote: { textAlign: 'center', fontFamily: font.mono, fontSize: 10, color: '#999', marginTop: 10 },
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
