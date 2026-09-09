import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing env var ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  supabaseUrl: required('SUPABASE_URL'),
  supabaseServiceKey: required('SUPABASE_SERVICE_KEY'),
  supabaseSchema: process.env.SUPABASE_SCHEMA ?? 'careloop',
  awsRegion: required('AWS_REGION'),
  awsAccessKeyId: required('AWS_ACCESS_KEY_ID'),
  awsSecretAccessKey: required('AWS_SECRET_ACCESS_KEY'),
  bedrockModel: process.env.BEDROCK_MODEL ?? 'amazon.nova-pro-v1:0',
  voyageApiKey: required('VOYAGE_API_KEY'),
  voyageModel: process.env.VOYAGE_MODEL ?? 'voyage-3.5',
  voyageBaseUrl: process.env.VOYAGE_BASE_URL ?? 'https://api.voyageai.com/v1',
};
