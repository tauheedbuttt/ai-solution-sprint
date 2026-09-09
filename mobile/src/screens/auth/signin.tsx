import { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { color, space, type as t } from '../../theme/tokens';
import { PillButton } from '../../components/pillbutton';
import { TextField } from '../../components/textfield';
import { RoleSwitch } from '../../components/roleswitch';
import { useAuth } from '../../services/auth/context';
import type { role } from '../../services/api';

export function SignInScreen() {
  const { signIn } = useAuth();
  const [role, setRole] = useState<role>('shopper');
  const [email, setEmail] = useState('demo@careloop.app');
  const [password, setPassword] = useState('demopass');
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  async function submit() {
    setError(undefined);
    setBusy(true);
    try {
      await signIn(email, password, role);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign in failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.eyebrow}>the careloop</Text>
        <Text style={styles.title}>Sign in</Text>

        <RoleSwitch value={role} onChange={setRole} />

        <View style={styles.form}>
          <TextField
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="you@example.com"
          />
          <TextField
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />
        </View>

        {error ? <Text style={styles.formError}>{error}</Text> : null}
        <PillButton label={busy ? 'Signing in…' : 'Sign in'} onPress={submit} disabled={busy} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { flex: 1, justifyContent: 'center', padding: space.lg, gap: space.lg },
  eyebrow: { ...t.eyebrow, color: color.mint },
  title: { ...t.h1, color: color.foreground },
  form: { gap: space.md },
  formError: { ...t.bodySmall, color: color.destructive },
});
