import { useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  color,
  borderWidth,
  radius,
  type as t,
  space,
} from "../../theme/tokens";
import { SheetHeader } from "../../components/sheetheader";
import { TextField } from "../../components/textfield";

type step = { id: string; tool: string; args: string };
type message = {
  id: string;
  role: "user" | "agent";
  text: string;
  steps?: step[];
};

const suggestedPrompts = [
  "Log a clean for my Trailhead Backpack",
  "What's my care score right now?",
];

// UI-only mock: canned tool traces per intent, no real agent wired up.
function respond(prompt: string): { steps: step[]; text: string } {
  const q = prompt.toLowerCase();
  if (q.includes("clean") || (q.includes("log") && q.includes("care"))) {
    return {
      steps: [
        { id: "s1", tool: "products.search", args: '"backpack"' },
        {
          id: "s2",
          tool: "ownershipLog.logCare",
          args: "productId: p2, type: clean",
        },
      ],
      text: "Logged a clean for your Trailhead Backpack. Care score should tick up shortly.",
    };
  }
  if (q.includes("score")) {
    return {
      steps: [{ id: "s1", tool: "stats.summary", args: "" }],
      text: "Your care score is 78 — half planet impact of what you own, half how you care for it.",
    };
  }
  if (q.includes("repair") || q.includes("partner")) {
    return {
      steps: [{ id: "s1", tool: "partners.list", args: "" }],
      text: "Found 3 repair partners: FixIt Helsinki, Repair Café Kallio, Nordic Refurb Co.",
    };
  }
  if (q.includes("discount") || q.includes("benefit")) {
    return {
      steps: [{ id: "s1", tool: "discounts.list", args: "" }],
      text: "You've unlocked 2 discounts this week: 15% off Iittala, free FixIt Helsinki diagnostic.",
    };
  }
  return {
    steps: [{ id: "s1", tool: "ownershipLog.search", args: `"${prompt}"` }],
    text: "Noted. Demo agent — wire this up to a real tool loop later.",
  };
}

export function AiChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  function send(prompt: string) {
    const text = prompt.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);

    const userMsg: message = { id: mockId(), role: "user", text };
    const agentId = mockId();
    setMessages((m) => [
      ...m,
      userMsg,
      { id: agentId, role: "agent", text: "", steps: [] },
    ]);

    const { steps, text: answer } = respond(text);
    steps.forEach((step, i) => {
      setTimeout(
        () => {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === agentId
                ? { ...msg, steps: [...(msg.steps ?? []), step] }
                : msg,
            ),
          );
          scrollRef.current?.scrollToEnd({ animated: true });
        },
        (i + 1) * 500,
      );
    });
    setTimeout(
      () => {
        setMessages((m) =>
          m.map((msg) => (msg.id === agentId ? { ...msg, text: answer } : msg)),
        );
        scrollRef.current?.scrollToEnd({ animated: true });
        setBusy(false);
      },
      (steps.length + 1) * 500,
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SheetHeader title="AI" onClose={onClose} />
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={[
          styles.content,
          messages.length > 0 && styles.contentFilled,
        ]}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.length === 0 ? (
          <View style={styles.suggestions}>
            <Text style={styles.suggestionsLabel}>Try asking</Text>
            <View style={styles.suggestionsGrid}>
              {suggestedPrompts.map((p) => (
                <Pressable
                  key={p}
                  style={styles.suggestionCard}
                  onPress={() => send(p)}
                >
                  <Text style={styles.suggestionText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
        {messages.map((m) => (
          <View
            key={m.id}
            style={[
              styles.bubble,
              m.role === "user" ? styles.bubbleUser : styles.bubbleAgent,
            ]}
          >
            {m.steps && m.steps.length > 0 ? (
              <View style={styles.timeline}>
                {m.steps.map((s, i) => (
                  <View key={s.id} style={styles.timelineRow}>
                    <View style={styles.timelineMarker}>
                      <View style={styles.timelineDot} />
                      {i < m.steps!.length - 1 ? (
                        <View style={styles.timelineLine} />
                      ) : null}
                    </View>
                    <View style={styles.timelineBody}>
                      <Text style={styles.stepText}>
                        {s.tool}
                        {s.args ? `(${s.args})` : "()"}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : null}
            {m.text ? (
              <Text style={styles.bubbleText}>{m.text}</Text>
            ) : m.role === "agent" ? (
              <Text style={styles.stepText}>thinking…</Text>
            ) : null}
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <TextField
            placeholder="Ask the AI…"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send(input)}
          />
        </View>
        <Pressable
          style={[styles.send, busy && styles.sendDisabled]}
          onPress={() => send(input)}
          disabled={busy}
        >
          <Ionicons name="arrow-up" size={18} color={color.primaryForeground} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function mockId() {
  return `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  content: { flexGrow: 1, padding: space.lg, gap: space.sm },
  contentFilled: { justifyContent: "flex-end" },
  suggestions: { gap: space.sm },
  suggestionsLabel: { ...t.eyebrow, color: color.mutedForeground },
  suggestionsGrid: { flexDirection: "column", gap: space.sm },
  suggestionCard: {
    flex: 1,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    padding: space.md,
    justifyContent: "center",
  },
  suggestionText: { ...t.body, color: color.foreground },
  bubble: {
    maxWidth: "85%",
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    padding: space.sm + 4,
    gap: space.xs,
  },
  bubbleUser: { alignSelf: "flex-end", backgroundColor: color.secondary },
  bubbleAgent: { alignSelf: "flex-start", backgroundColor: color.card },
  bubbleText: { ...t.body, color: color.foreground },
  timeline: {},
  timelineRow: { flexDirection: "row", alignItems: "stretch" },
  timelineMarker: { width: 16, alignItems: "center" },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: color.mint,
    marginTop: 4,
  },
  timelineLine: {
    flex: 1,
    width: borderWidth.hairline,
    backgroundColor: color.border,
    marginTop: 2,
  },
  timelineBody: { flex: 1, paddingBottom: space.xs + 2 },
  stepText: {
    ...t.eyebrow,
    color: color.mutedForeground,
    textTransform: "none",
    letterSpacing: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.lg,
    paddingTop: space.sm,
  },
  inputWrap: { flex: 1 },
  send: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: color.brownInk,
    alignItems: "center",
    justifyContent: "center",
  },
  sendDisabled: { opacity: 0.5 },
});
