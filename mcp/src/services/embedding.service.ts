import { createVoyage } from '@ai-sdk/voyage';
import { embed } from 'ai';
import { env } from '../config/env.js';

const voyage = createVoyage({ apiKey: env.voyageApiKey, baseURL: env.voyageBaseUrl });

export async function embedText(text: string) {
  const { embedding } = await embed({ model: voyage.embedding(env.voyageModel), value: text });
  return embedding;
}
