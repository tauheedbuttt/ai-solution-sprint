// CareLoop design tokens, dark theme only. Never hard-code hex outside this file.

export const color = {
  background: '#02041a',
  card: '#090f24',
  foreground: '#f1f2e3',
  mutedForeground: '#bab8aa',
  border: '#ffffff1f',
  mint: '#80b068',
  brownInk: '#f08169',
  primary: '#f1f2e3',
  primaryForeground: '#02041a',
  secondary: '#11172b',
  destructive: '#cd6766',
  input: '#ffffff29',
  ring: '#f08169',
  codeKey: '#7dd3fc', // JSON syntax highlight: keys and string values
  health: '#ffc033',
  planet: '#86af69',
  ethics: '#7897ff',
  longevity: '#e09d81',
} as const;

export const radius = {
  none: 0,
  pill: 999,
} as const;

export const borderWidth = {
  hairline: 1,
} as const;

export const font = {
  display: 'System',
  body: 'System',
  mono: 'Menlo',
} as const;

export const type = {
  h1: { fontFamily: font.display, fontSize: 40, lineHeight: 42, fontWeight: '700' as const },
  h2: { fontFamily: font.display, fontSize: 28, lineHeight: 32, fontWeight: '700' as const },
  h3: { fontFamily: font.display, fontSize: 20, lineHeight: 24, fontWeight: '600' as const },
  body: { fontFamily: font.body, fontSize: 16, lineHeight: 22, fontWeight: '400' as const },
  bodySmall: { fontFamily: font.body, fontSize: 12, lineHeight: 18, fontWeight: '400' as const },
  eyebrow: { fontFamily: font.mono, fontSize: 11, lineHeight: 14, fontWeight: '600' as const, letterSpacing: 1.5, textTransform: 'uppercase' as const },
} as const;

export const space = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const layout = {
  maxWidth: 480,
} as const;
