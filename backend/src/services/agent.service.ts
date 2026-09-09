import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { streamText, isStepCount, ModelMessage, tool } from 'ai';
import { propagateAttributes, startActiveObservation } from '@langfuse/tracing';
import { z } from 'zod';
import { env } from '../config/env.js';
import { langfuseSpanProcessor } from '../instrumentation.js';
import { createCareLog, createNextLifeRoute, createRepairRequest } from './logs.service.js';
import { searchProductsForAgent } from './products.service.js';

const bedrock = createAmazonBedrock({
  region: env.awsRegion,
  accessKeyId: env.awsAccessKeyId,
  secretAccessKey: env.awsSecretAccessKey,
});

const defaultPartnerId = 'partner1';

const toolLabels: Record<string, string> = {
  searchProducts: 'Searched products',
  addCareLog: 'Logged care',
  addRepairRequest: 'Filed a repair request',
  addNextLifeRoute: 'Routed product',
};

const tools = {
  searchProducts: tool({
    description: 'Find products by name, brand, category, or status. Call this before any log action to resolve product ids. Can match multiple products.',
    inputSchema: z.object({
      query: z.string().optional().describe('free text describing the product, e.g. "backpack" or "coffee maker"'),
      category: z.string().optional().describe('exact category, e.g. "Home", "Outdoor", "Appliances", "Clothing"'),
      brand: z.string().optional(),
      status: z.enum(['active', 'draft', 'routed']).optional(),
    }),
    execute: async (input) => searchProductsForAgent(input),
  }),
  addCareLog: tool({
    description: 'Log routine care (clean, store, rotate, service) for a product. Requires a productId from searchProducts.',
    inputSchema: z.object({
      productId: z.string(),
      type: z.enum(['clean', 'store', 'rotate', 'service']),
      note: z.string().optional(),
      share: z.boolean().optional(),
    }),
    execute: async ({ productId, type, note, share }) => createCareLog(productId, { type, note, share: share ?? false }),
  }),
  addRepairRequest: tool({
    description: 'File a repair request for a broken or damaged product. Requires a productId from searchProducts.',
    inputSchema: z.object({
      productId: z.string(),
      issue: z.string().describe('what is wrong with the product'),
    }),
    execute: async ({ productId, issue }) => createRepairRequest(productId, { partnerId: defaultPartnerId, issue }),
  }),
  addNextLifeRoute: tool({
    description: 'Route a product to its next life stage (reuse, resell, donate, refurbish, recycle). Requires a productId from searchProducts.',
    inputSchema: z.object({
      productId: z.string(),
      route: z.enum(['reuse', 'resell', 'donate', 'refurbish', 'recycle']),
      retainedValue: z.number().optional(),
    }),
    execute: async ({ productId, route, retainedValue }) => createNextLifeRoute(productId, { route, retainedValue }),
  }),
};

const system =
  'You are the CareLoop assistant. You only do three things: log care, file repairs, and route products to their next life, using searchProducts, addCareLog, addRepairRequest, addNextLifeRoute. ' +
  'Always call searchProducts first to resolve which product(s) the user means, then call the matching log tool for each product. ' +
  'If searchProducts returns no match, tell the user instead of guessing an id. Keep replies short. ' +
  'Anything outside these three actions (code, general questions, other topics) is out of scope: refuse in one short sentence, do not answer the off-topic request in any form, and redirect to what you can do.';

function textOf(content: ModelMessage['content']) {
  if (typeof content === 'string') return content;
  return content.map((part) => ('text' in part ? part.text : `[${part.type}]`)).join(' ');
}

export type agentEvent =
  | { type: 'tool'; id: string; tool: string; label: string; params: unknown; result: unknown }
  | { type: 'text'; delta: string }
  | { type: 'done'; messages: ModelMessage[] }
  | { type: 'error'; message: string };

export function runAgentStream(messages: ModelMessage[], sessionId?: string): AsyncGenerator<agentEvent> {
  const queue: agentEvent[] = [];
  let wake: (() => void) | null = null;
  let finished = false;

  function push(event: agentEvent) {
    queue.push(event);
    if (wake) {
      wake();
      wake = null;
    }
  }

  async function run() {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    const pendingCalls = new Map<string, unknown>();
    let finalText = '';

    try {
      await propagateAttributes({ traceName: 'agent-chat', sessionId, tags: ['agent'] }, () =>
        startActiveObservation('agent-chat', async (span) => {
          span.update({ input: lastUserMessage ? textOf(lastUserMessage.content) : undefined });

          const result = streamText({
            model: bedrock(env.bedrockModel),
            system,
            messages,
            tools,
            stopWhen: isStepCount(8),
            telemetry: { functionId: 'agent-chat' },
          });

          for await (const part of result.fullStream) {
            if (part.type === 'tool-call') {
              pendingCalls.set(part.toolCallId, part.input);
            } else if (part.type === 'tool-result') {
              push({
                type: 'tool',
                id: part.toolCallId,
                tool: part.toolName,
                label: toolLabels[part.toolName] ?? part.toolName,
                params: pendingCalls.get(part.toolCallId) ?? part.input,
                result: part.output,
              });
            } else if (part.type === 'text-delta') {
              finalText += part.text;
              push({ type: 'text', delta: part.text });
            }
          }

          const steps = await result.steps;
          const newMessages = steps.flatMap((s) => s.response.messages);
          span.update({ output: finalText });
          push({ type: 'done', messages: newMessages });
        }),
      );
    } catch (err) {
      push({ type: 'error', message: (err as Error).message });
    } finally {
      // serverless deploy: flush before the function may freeze
      await langfuseSpanProcessor.forceFlush();
      finished = true;
      if (wake) {
        wake();
        wake = null;
      }
    }
  }

  run();

  return (async function* () {
    while (true) {
      if (queue.length > 0) {
        yield queue.shift()!;
      } else if (finished) {
        return;
      } else {
        await new Promise<void>((resolve) => {
          wake = resolve;
        });
      }
    }
  })();
}
