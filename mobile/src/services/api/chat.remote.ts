import { fetch } from 'expo/fetch';

export type agentMessage = { role: string; content: unknown };

export type agentEvent =
  | { type: 'tool'; id: string; tool: string; label: string; params: unknown; result: unknown }
  | { type: 'text'; delta: string }
  | { type: 'done'; messages: agentMessage[] }
  | { type: 'error'; message: string };

const apiUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function streamAgentChat(
  messages: agentMessage[],
  sessionId: string,
  onEvent: (event: agentEvent) => void,
): Promise<void> {
  const response = await fetch(`${apiUrl}/agent/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, sessionId }),
  });
  if (!response.body) throw new Error('No response body from agent');

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const frames = buffer.split('\n\n');
    buffer = frames.pop() ?? '';
    for (const frame of frames) {
      const line = frame.trim();
      if (!line.startsWith('data: ')) continue;
      onEvent(JSON.parse(line.slice(6)));
    }
  }
}
