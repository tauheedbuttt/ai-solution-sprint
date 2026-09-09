import { supabase } from '../config/supabaseClient';
import {
  careLogRow,
  nextLifeRouteRow,
  repairRequestRow,
  toCareLog,
  toNextLifeRoute,
  toRepairRequest,
} from '../types/log';

export async function createCareLog(productId: string, input: { type: string; note?: string; share: boolean }) {
  const { data, error } = await supabase
    .from('care_logs')
    .insert({ product_id: productId, type: input.type, note: input.note ?? null, share: input.share })
    .select()
    .single();
  if (error) throw error;
  return toCareLog(data as unknown as careLogRow);
}

export async function listCareLogs(productId: string) {
  const { data, error } = await supabase.from('care_logs').select().eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as careLogRow[]).map(toCareLog);
}

export async function createRepairRequest(productId: string, input: { partnerId: string; issue: string }) {
  const { data, error } = await supabase
    .from('repair_requests')
    .insert({ product_id: productId, partner_id: input.partnerId, issue: input.issue })
    .select()
    .single();
  if (error) throw error;
  return toRepairRequest(data as unknown as repairRequestRow);
}

export async function listRepairRequests(productId: string) {
  const { data, error } = await supabase.from('repair_requests').select().eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as repairRequestRow[]).map(toRepairRequest);
}

export async function createNextLifeRoute(productId: string, input: { route: string; partnerId?: string; retainedValue?: number }) {
  const { data, error } = await supabase
    .from('next_life_routes')
    .insert({ product_id: productId, route: input.route, partner_id: input.partnerId ?? null, retained_value: input.retainedValue ?? null })
    .select()
    .single();
  if (error) throw error;
  return toNextLifeRoute(data as unknown as nextLifeRouteRow);
}

export async function listNextLifeRoutes(productId: string) {
  const { data, error } = await supabase.from('next_life_routes').select().eq('product_id', productId).order('created_at', { ascending: false });
  if (error) throw error;
  return (data as unknown as nextLifeRouteRow[]).map(toNextLifeRoute);
}
