import 'dotenv/config';
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { registerTelemetry } from 'ai';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { Context } from '@opentelemetry/api';
import { Span, SpanProcessor } from '@opentelemetry/sdk-trace-base';

const langfuse = new LangfuseSpanProcessor();

// AI SDK names spans "chat <model>"; strip the model since it's already a separate attribute
const modelInNamePattern = /^(chat|invoke_agent|embeddings) .+$/;

class StripModelFromNameProcessor implements SpanProcessor {
  onStart(span: Span, parentContext: Context) {
    const match = span.name.match(modelInNamePattern);
    if (match) span.updateName(match[1]);
    langfuse.onStart(span, parentContext);
  }
  onEnd(span: Parameters<SpanProcessor['onEnd']>[0]) {
    langfuse.onEnd(span);
  }
  forceFlush() {
    return langfuse.forceFlush();
  }
  shutdown() {
    return langfuse.shutdown();
  }
}

export const langfuseSpanProcessor = langfuse;

const sdk = new NodeSDK({ spanProcessors: [new StripModelFromNameProcessor()] });
sdk.start();

// Native dynamic import to load ESM package in CommonJS runtime on Vercel
(async () => {
  try {
    const { LangfuseVercelAiSdkIntegration } = await (eval(
      'import("@langfuse/vercel-ai-sdk")'
    ) as Promise<typeof import('@langfuse/vercel-ai-sdk')>);
    registerTelemetry(new LangfuseVercelAiSdkIntegration());
  } catch (err) {
    console.error('Failed to initialize Langfuse telemetry:', err);
  }
})();
