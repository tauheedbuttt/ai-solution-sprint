import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4001),
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceKey: required('SUPABASE_SERVICE_KEY'),
  supabaseSchema: process.env.SUPABASE_SCHEMA ?? 'careloop',
  voyageApiKey: required('VOYAGE_API_KEY'),
  voyageModel: process.env.VOYAGE_MODEL ?? 'voyage-3.5',
  voyageBaseUrl: process.env.VOYAGE_BASE_URL ?? 'https://api.voyageai.com/v1',
};
