import { TextInput, Text, View, StyleSheet, type TextInputProps } from 'react-native';
import { color, radius, borderWidth, type as t, space } from '../theme/tokens';

type props = TextInputProps & {
  label: string;
  error?: string;
};

export function TextField({ label, error, style, ...input }: props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={color.mutedForeground}
        style={[styles.input, error && styles.inputError, style]}
        {...input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: space.xs },
  label: { ...t.eyebrow, color: color.foreground },
  input: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    borderRadius: radius.none,
    color: color.foreground,
    paddingHorizontal: space.md,
    paddingVertical: space.sm + 4,
    ...t.body,
  },
  inputError: { borderColor: color.destructive },
  error: { ...t.bodySmall, color: color.destructive },
});
