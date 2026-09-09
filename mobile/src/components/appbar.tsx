import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../theme/tokens';
import { Sheet } from './sheet';
import { SheetHeader } from './sheetheader';
import { PillButton } from './pillbutton';
import { useAuth } from '../services/auth/context';

// Shared settings entry point: a bare icon button, meant to sit inline in a screen's own top bar.
export function AppBar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable onPress={() => setOpen(true)} hitSlop={12} style={styles.button}>
        <Ionicons name="settings-outline" size={20} color={color.foreground} />
      </Pressable>
      <Sheet visible={open} onClose={() => setOpen(false)}>
        <SheetHeader title="Settings" onClose={() => setOpen(false)} />
        <View style={styles.body}>
          <Text style={styles.label}>Signed in as</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <PillButton label="Log out" onPress={() => signOut()} />
        </View>
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  body: { padding: space.lg, gap: space.sm },
  label: { ...t.eyebrow, color: color.mutedForeground },
  email: { ...t.body, color: color.foreground, marginBottom: space.md },
});
