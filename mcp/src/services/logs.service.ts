import { supabase } from '../config/supabaseClient.js';
import {
  careLogRow,
  nextLifeRouteRow,
  repairRequestRow,
  toCareLog,
  toNextLifeRoute,
  toRepairRequest,
} from '../types/log.js';

const defaultPartnerId = 'partner1';

export async function createCareLog(productId: string, input: { type: string; note?: string; share: boolean }) {
  const { data, error } = await supabase
    .from('care_logs')
    .insert({ product_id: productId, type: input.type, note: input.note ?? null, share: input.share })
    .select()
    .single();
  if (error) throw error;
  return toCareLog(data as unknown as careLogRow);
}

export async function createRepairRequest(productId: string, input: { partnerId?: string; issue: string }) {
  const { data, error } = await supabase
    .from('repair_requests')
    .insert({ product_id: productId, partner_id: input.partnerId ?? defaultPartnerId, issue: input.issue })
    .select()
    .single();
  if (error) throw error;
  return toRepairRequest(data as unknown as repairRequestRow);
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
