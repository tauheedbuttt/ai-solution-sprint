import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
  font,
  space,
} from "../../theme/tokens";
import { SheetHeader } from "../../components/sheetheader";
import { TextField } from "../../components/textfield";
import { streamAgentChat, type agentMessage } from "../../services/api/chat.remote";

type step = {
  id: string;
  label: string;
  tool: string;
  params: Record<string, unknown>;
  result: Record<string, unknown>;
};
type message = {
  id: string;
  role: "user" | "agent";
  text: string;
  steps?: step[];
};
type reaction = "up" | "down";

// grounded in the current demo catalog: EcoBrew Coffee Maker (p1, active), Trailhead Backpack (p2, active), Nordic Wool Sweater (p3, draft)
const mutatingTools = new Set(["addCareLog", "addRepairRequest", "addNextLifeRoute"]);

const suggestedPrompts = [
  "Log a clean for my Trailhead Backpack",
  "File a repair request for my coffee maker",
  "Donate my Nordic Wool Sweater",
];

type jsonTokenKind = "key" | "string" | "literal" | "punct";
type jsonToken = { text: string; kind: jsonTokenKind };

// tokenize pretty-printed JSON for syntax highlighting, quoted key/string in cyan, bool/number/null in mint
function tokenizeJson(value: unknown): jsonToken[] {
  const json = JSON.stringify(value, null, 2);
  const regex =
    /("(?:\\u[a-fA-F0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;
  const tokens: jsonToken[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(json))) {
    if (match.index > lastIndex) {
      tokens.push({ text: json.slice(lastIndex, match.index), kind: "punct" });
    }
    const text = match[0];
    const isKey = text.startsWith('"') && /:\s*$/.test(text);
    const isString = text.startsWith('"') && !isKey;
    tokens.push({
      text,
      kind: isKey || isString ? (isKey ? "key" : "string") : "literal",
    });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < json.length) {
    tokens.push({ text: json.slice(lastIndex), kind: "punct" });
  }
  return tokens;
}

const jsonTokenStyle: Record<jsonTokenKind, { color: string }> = {
  key: { color: color.codeKey },
  string: { color: color.codeKey },
  literal: { color: color.mint },
  punct: { color: color.foreground },
};

function JsonBlock({ value }: { value: Record<string, unknown> }) {
  const tokens = tokenizeJson(value);
  return (
    <Text style={styles.toolJsonText}>
      {tokens.map((tok, i) => (
        <Text key={i} style={jsonTokenStyle[tok.kind]}>
          {tok.text}
        </Text>
      ))}
    </Text>
  );
}

function ToolCard({ step }: { step: step }) {
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.toolCard}>
      <Pressable style={styles.toolHeader} onPress={() => setOpen((v) => !v)}>
        <Ionicons
          name="construct-outline"
          size={16}
          color={color.mutedForeground}
        />
        <Text style={styles.toolLabel} numberOfLines={1}>
          {step.label}
        </Text>
        <View style={styles.toolStatus}>
          <Ionicons name="checkmark-circle" size={14} color={color.mint} />
          <Text style={styles.toolStatusText}>Completed</Text>
        </View>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={16}
          color={color.mutedForeground}
        />
      </Pressable>
      {open ? (
        <View style={styles.toolBody}>
          <Text style={styles.toolSectionLabel}>Parameters</Text>
          <View style={styles.toolJsonBox}>
            <JsonBlock value={step.params} />
          </View>
          <Text style={styles.toolSectionLabel}>Result</Text>
          <View style={styles.toolJsonBox}>
            <JsonBlock value={step.result} />
          </View>
        </View>
      ) : null}
    </View>
  );
}

export function AiChat({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [reactions, setReactions] = useState<
    Record<string, reaction | undefined>
  >({});
  const scrollRef = useRef<ScrollView>(null);
  const sessionId = useRef(mockId());
  const history = useRef<agentMessage[]>([]);
  const queryClient = useQueryClient();

  function toggleReaction(id: string, value: reaction) {
    setReactions((r) => ({ ...r, [id]: r[id] === value ? undefined : value }));
  }

  async function send(prompt: string) {
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
    history.current = [...history.current, { role: "user", content: text }];

    try {
      await streamAgentChat(history.current, sessionId.current, (event) => {
        if (event.type === "tool") {
          const step: step = {
            id: event.id,
            label: event.label,
            tool: event.tool,
            params: event.params as Record<string, unknown>,
            result: event.result as Record<string, unknown>,
          };
          setMessages((m) =>
            m.map((msg) =>
              msg.id === agentId
                ? { ...msg, steps: [...(msg.steps ?? []), step] }
                : msg,
            ),
          );
          if (mutatingTools.has(event.tool)) {
            queryClient.invalidateQueries({ queryKey: ["recentLogs"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
            queryClient.invalidateQueries({ queryKey: ["product"] });
          }
        } else if (event.type === "text") {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === agentId
                ? { ...msg, text: msg.text + event.delta }
                : msg,
            ),
          );
        } else if (event.type === "done") {
          history.current = [...history.current, ...event.messages];
        } else if (event.type === "error") {
          setMessages((m) =>
            m.map((msg) =>
              msg.id === agentId
                ? { ...msg, text: `Something went wrong: ${event.message}` }
                : msg,
            ),
          );
        }
        scrollRef.current?.scrollToEnd({ animated: true });
      });
    } catch (err) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === agentId
            ? { ...msg, text: "Couldn't reach the assistant. Try again." }
            : msg,
        ),
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SheetHeader title={"Assistant"} onClose={onClose} />
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
        {messages.map((m) =>
          m.role === "user" ? (
            <View key={m.id} style={styles.bubbleUser}>
              <Text style={styles.bubbleText}>{m.text}</Text>
            </View>
          ) : (
            <View key={m.id} style={styles.agentTurn}>
              {m.steps && m.steps.length > 0 ? (
                <View style={styles.toolStack}>
                  {m.steps.map((s) => (
                    <ToolCard key={s.id} step={s} />
                  ))}
                </View>
              ) : null}
              {m.text ? (
                <>
                  <Text style={styles.agentText}>{m.text}</Text>
                  <View style={styles.actionRow}>
                    <Pressable
                      hitSlop={8}
                      onPress={() => toggleReaction(m.id, "up")}
                    >
                      <Ionicons
                        name={
                          reactions[m.id] === "up"
                            ? "thumbs-up"
                            : "thumbs-up-outline"
                        }
                        size={16}
                        color={
                          reactions[m.id] === "up"
                            ? color.mint
                            : color.mutedForeground
                        }
                      />
                    </Pressable>
                    <Pressable
                      hitSlop={8}
                      onPress={() => toggleReaction(m.id, "down")}
                    >
                      <Ionicons
                        name={
                          reactions[m.id] === "down"
                            ? "thumbs-down"
                            : "thumbs-down-outline"
                        }
                        size={16}
                        color={
                          reactions[m.id] === "down"
                            ? color.destructive
                            : color.mutedForeground
                        }
                      />
                    </Pressable>
                    <View style={styles.actionSpacer} />
                    <Pressable style={styles.textBtn}>
                      <Ionicons
                        name="refresh-outline"
                        size={13}
                        color={color.mutedForeground}
                      />
                      <Text style={styles.textBtnLabel}>Request revision</Text>
                    </Pressable>
                    <Pressable style={styles.textBtn}>
                      <Ionicons
                        name="download-outline"
                        size={13}
                        color={color.mutedForeground}
                      />
                      <Text style={styles.textBtnLabel}>Download PDF</Text>
                    </Pressable>
                  </View>
                </>
              ) : (
                <Text style={styles.stepText}>thinking…</Text>
              )}
            </View>
          ),
        )}
      </ScrollView>
      <View style={styles.inputOuter}>
        <TextField
          placeholder="Ask about a score, an item you own or where to repair something"
          value={input}
          onChangeText={setInput}
          multiline
          style={styles.inputField}
        />
        <View style={styles.inputFooter}>
          <Text style={styles.groundedLabel}>Grounded in Care Loop data</Text>
          <Pressable
            style={[styles.send, busy && styles.sendDisabled]}
            onPress={() => send(input)}
            disabled={busy}
          >
            <Ionicons
              name="arrow-up"
              size={18}
              color={color.primaryForeground}
            />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function mockId() {
  return `m${Date.now()}${Math.random().toString(36).slice(2, 6)}`;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: color.background },
  intro: {
    gap: space.xs,
    flexWrap: "wrap",
    display: "flex",
    maxWidth: "100%",
  },
  introTop: { flexDirection: "row", alignItems: "center", gap: space.sm },
  introTitle: { ...t.h3, color: color.foreground },
  introSubtitle: {
    ...t.bodySmall,
    color: color.mutedForeground,
    flexWrap: "wrap",
  },
  content: { flexGrow: 1, padding: space.lg, gap: space.md },
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
  bubbleUser: {
    maxWidth: "85%",
    alignSelf: "flex-end",
    backgroundColor: color.secondary,
    padding: space.sm + 4,
  },
  bubbleText: { ...t.body, color: color.foreground },
  agentTurn: { gap: space.sm },
  agentText: { ...t.body, color: color.foreground },
  stepText: {
    ...t.eyebrow,
    color: color.mutedForeground,
    textTransform: "none",
    letterSpacing: 0,
  },
  toolStack: { gap: space.sm },
  toolCard: { borderWidth: borderWidth.hairline, borderColor: color.border },
  toolHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: space.sm,
    padding: space.sm + 4,
  },
  toolLabel: { ...t.body, color: color.foreground, flex: 1 },
  toolStatus: { flexDirection: "row", alignItems: "center", gap: 4 },
  toolStatusText: { ...t.bodySmall, color: color.mint, fontWeight: "600" },
  toolBody: {
    gap: space.xs,
    padding: space.sm + 4,
    borderTopWidth: borderWidth.hairline,
    borderTopColor: color.border,
  },
  toolSectionLabel: { ...t.eyebrow, color: color.mutedForeground },
  toolJsonBox: {
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    backgroundColor: color.card,
    padding: space.sm,
  },
  toolJsonText: {
    fontFamily: font.mono,
    fontSize: 12,
    lineHeight: 17,
    color: color.foreground,
  },
  actionRow: { flexDirection: "row", alignItems: "center", gap: space.md },
  actionSpacer: { flex: 1 },
  textBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  textBtnLabel: {
    ...t.eyebrow,
    color: color.mutedForeground,
    letterSpacing: 0.5,
  },
  inputOuter: {
    margin: space.lg,
    marginTop: space.sm,
    borderWidth: borderWidth.hairline,
    borderColor: color.border,
    padding: space.md,
    gap: space.md,
  },
  inputField: {
    borderWidth: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    minHeight: t.body.lineHeight,
    maxHeight: t.body.lineHeight * 5,
    textAlignVertical: "top",
  },
  inputFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  groundedLabel: { ...t.eyebrow, color: color.mutedForeground },
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
