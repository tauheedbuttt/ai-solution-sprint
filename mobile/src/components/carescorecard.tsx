import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { color, borderWidth, type as t, space } from "../theme/tokens";

const size = 80;
const stroke = 7;
const r = (size - stroke) / 2;
const circumference = 2 * Math.PI * r;

type props = {
  score: number;
  note: string;
};

export function CareScoreCard({ score, note }: props) {
  const progress = Math.max(0, Math.min(1, score / 100));

  return (
    <View style={styles.card}>
      <View style={styles.ring}>
        <Svg width={size} height={size} style={styles.ringSvg}>
          <Circle cx={size / 2} cy={size / 2} r={r} stroke={color.secondary} strokeWidth={stroke} fill="none" />
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            stroke={color.brownInk}
            strokeWidth={stroke}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference * progress} ${circumference}`}
          />
        </Svg>
        <View style={styles.ringLabel}>
          <Text style={styles.ringValue}>{score}</Text>
          <Text style={styles.ringSuffix}>/ 100</Text>
        </View>
      </View>
      <View style={styles.text}>
        <Text style={styles.eyebrow}>Care score</Text>
        <Text style={styles.note}>{note}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.md,
    padding: space.md,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
  },
  ring: { width: size, height: size, alignItems: "center", justifyContent: "center" },
  ringSvg: { transform: [{ rotate: "-90deg" }] },
  ringLabel: { position: "absolute", alignItems: "center" },
  ringValue: { ...t.h3, color: color.foreground },
  ringSuffix: { ...t.bodySmall, color: color.mutedForeground },
  text: { flex: 1, gap: space.xs },
  eyebrow: { ...t.eyebrow, color: color.mutedForeground },
  note: { ...t.bodySmall, color: color.foreground },
});
