import 'dotenv/config';
import { LangfuseSpanProcessor } from '@langfuse/otel';
import { registerTelemetry } from 'ai';
import { LangfuseVercelAiSdkIntegration } from '@langfuse/vercel-ai-sdk';
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

registerTelemetry(new LangfuseVercelAiSdkIntegration());
