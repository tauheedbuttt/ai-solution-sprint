import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { color, borderWidth, type as t, space } from "../theme/tokens";

type props = {
  title: string | React.ReactNode;
  onClose: () => void;
  onBack?: () => void;
};

export function SheetHeader({ title, onClose, onBack }: props) {
  return (
    <View style={styles.row}>
      {onBack ? (
        <Pressable onPress={onBack} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color={color.foreground} />
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
      {typeof title === "string" ? (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      ) : (
        title
      )}
      <Pressable onPress={onClose} hitSlop={8}>
        <Ionicons name="close" size={22} color={color.foreground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderBottomWidth: borderWidth.hairline,
    borderBottomColor: color.border,
  },
  spacer: { width: 22 },
  title: { ...t.h3, color: color.foreground, flex: 1, textAlign: "center" },
});
