import { supabase } from '../config/supabaseClient.js';
import { embedText } from '../services/embedding.service.js';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const requestGapMs = 21000; // 3 RPM cap on the free Voyage tier

async function main() {
  const { data, error } = await supabase.from('products').select('id, name, brand, category');
  if (error) throw error;

  for (const p of data as { id: string; name: string; brand: string | null; category: string }[]) {
    const embedding = await embedText(`${p.name} ${p.brand ?? ''} ${p.category}`.trim());
    const { error: updateError } = await supabase.from('products').update({ embedding }).eq('id', p.id);
    if (updateError) throw updateError;
    console.log(`embedded ${p.id} - ${p.name}`);
    await sleep(requestGapMs);
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
