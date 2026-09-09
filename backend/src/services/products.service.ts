import { supabase } from '../config/supabaseClient';
import { productRow, toDetail, toListItem } from '../types/product';

const listColumns = 'id, name, brand, category, status, care_score';
const detailColumns = 'id, name, brand, category, status, care_score, scores';

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
