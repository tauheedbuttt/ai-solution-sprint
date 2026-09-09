import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { color, borderWidth, radius, type as t, space } from '../theme/tokens';
import { ProgressBar } from './progressbar';
import { PillButton } from './pillbutton';
import type { discount } from '../services/api';

type props = {
  discount: discount;
  progressCount: number;
  onPress: () => void;
};

export function DiscountCard({ discount, progressCount, onPress }: props) {
  const unlocked = progressCount >= discount.threshold.count;
  const remaining = Math.max(0, discount.threshold.count - progressCount);
  const progress = discount.threshold.count === 0 ? 1 : progressCount / discount.threshold.count;

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.hero}>
        <Ionicons name="image-outline" size={28} color={color.mutedForeground} />
        <View style={styles.logo}>
          <Text style={styles.logoLetter}>{discount.actorName.charAt(0)}</Text>
        </View>
      </View>
      <View style={styles.body}>
        <Text style={styles.actor} numberOfLines={1}>{discount.actorName}</Text>
        <Text style={styles.headline} numberOfLines={2}>{discount.headline}</Text>
        <ProgressBar progress={progress} />
        <Text style={[styles.eyebrow, unlocked && styles.eyebrowUnlocked]}>
          {unlocked ? 'unlocked' : `${remaining} more log${remaining === 1 ? '' : 's'} to unlock`}
        </Text>
        <PillButton
          label={unlocked ? 'Redeem the offer' : `Log ${remaining} more to unlock`}
          onPress={onPress}
          disabled={!unlocked}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: borderWidth.hairline, borderColor: color.border, backgroundColor: color.card },
  hero: {
    height: 120,
    backgroundColor: color.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    position: 'absolute',
    top: space.sm,
    left: space.sm,
    width: 32,
    height: 32,
    borderRadius: radius.pill,
    backgroundColor: color.card,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: { ...t.body, fontWeight: '700', color: color.foreground },
  body: { padding: space.md, gap: space.xs },
  actor: { ...t.eyebrow, color: color.mint },
  headline: { ...t.h3, color: color.foreground, minHeight: 48 },
  eyebrow: { ...t.eyebrow, color: color.mutedForeground },
  eyebrowUnlocked: { color: color.brownInk },
});
