import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../../theme/tokens';
import { TextField } from '../../components/textfield';
import { PillButton } from '../../components/pillbutton';

type tab = 'camera' | 'manual';

type props = {
  tab: tab;
  code: string;
  onCodeChange: (value: string) => void;
  busy: boolean;
  onCapture: (code: string) => void;
  scanLabel?: string;
  manualPlaceholder?: string;
  lookupLabel?: string;
};

// One capture UI, reused by Scan (02-home-tab) and Verify (05-verify-tab) with different downstream calls.
export function CaptureIdentify({
  tab,
  code,
  onCodeChange,
  busy,
  onCapture,
  scanLabel = 'Scan',
  manualPlaceholder = 'Barcode or product code',
  lookupLabel = 'Look it up',
}: props) {
  if (tab === 'manual') {
    return (
      <View style={styles.form}>
        <TextField placeholder={manualPlaceholder} value={code} onChangeText={onCodeChange} autoCapitalize="none" />
        <PillButton label={lookupLabel} onPress={() => onCapture(code)} disabled={busy || !code} />
      </View>
    );
  }

  return (
    <View style={styles.viewfinderWrap}>
      <View style={styles.viewfinder}>
        <Pressable style={styles.galleryButton} onPress={() => onCapture('demo')} disabled={busy}>
          <Ionicons name="image" size={20} color={color.foreground} />
        </Pressable>
        <Text style={styles.viewfinderHint}>Point your camera at a barcode</Text>
      </View>
      <PillButton label={busy ? 'Scanning…' : scanLabel} icon="scan" onPress={() => onCapture('demo')} disabled={busy} />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
