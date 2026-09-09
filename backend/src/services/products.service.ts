import { supabase } from '../config/supabaseClient';
import { productRow, toDetail, toListItem } from '../types/product';
import { embedText } from './embedding.service';

const listColumns = 'id, name, brand, category, status, care_score';
const detailColumns = 'id, name, brand, category, status, care_score, scores, care_logs(*), repair_requests(*), next_life_routes(*)';

export type agentProductFilter = { query?: string; category?: string; brand?: string; status?: string };

export async function searchProductsForAgent(filter: agentProductFilter) {
  let query = supabase.from('products').select(listColumns);
  if (filter.category) query = query.ilike('category', filter.category);
  if (filter.brand) query = query.ilike('brand', filter.brand);
  if (filter.status) query = query.eq('status', filter.status);

  const { data, error } = await query;
  if (error) throw error;
  const filtered = (data as unknown as productRow[]).map(toListItem);

  if (!filter.query) return filtered;

  const embedding = await embedText(filter.query);
  const { data: matches, error: matchError } = await supabase.rpc('match_products', {
    query_embedding: embedding,
    match_threshold: 0.3,
    match_count: 10,
  });
  if (matchError) throw matchError;

  const filteredIds = new Set(filtered.map((p) => p.id));
  return (matches as { id: string }[]).filter((m) => filteredIds.has(m.id)).map((m) => filtered.find((p) => p.id === m.id)!);
}

export async function listProducts(search?: string) {
  let query = supabase.from('products').select(listColumns).order('name', { ascending: true });

  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`name.ilike.${term},brand.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as unknown as productRow[]).map(toListItem);
}

export async function getProductById(id: string) {
  const { data, error } = await supabase.from('products').select(detailColumns).eq('id', id).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return toDetail(data as unknown as productRow);
}
