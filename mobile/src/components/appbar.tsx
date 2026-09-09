import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, type as t, space } from '../theme/tokens';
import { Sheet } from './sheet';
import { SheetHeader } from './sheetheader';
import { PillButton } from './pillbutton';
import { useAuth } from '../services/auth/context';

// Shared settings entry point, mounted once per shopper tab shell and once on the provider screen.
export function AppBar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <>
      <View style={styles.row}>
        <Pressable onPress={() => setOpen(true)} hitSlop={8}>
          <Ionicons name="settings-outline" size={22} color={color.foreground} />
        </Pressable>
      </View>
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
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  body: { padding: space.lg, gap: space.sm },
  label: { ...t.eyebrow, color: color.mutedForeground },
  email: { ...t.body, color: color.foreground, marginBottom: space.md },
});
