import { careLogRow, nextLifeRouteRow, repairRequestRow } from './log.js';

export type status = 'active' | 'draft' | 'routed';
export type scoreCategory = 'health' | 'planet' | 'ethics' | 'longevity';
export type scoreBreakdown = Record<scoreCategory, { value: number; tag: string }>;
export type logKind = 'care' | 'repair' | 'nextLife';
export type logItem = { id: string; kind: logKind; label: string; date: string; note?: string };

export type productRow = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  status: status;
  care_score: number | null;
  scores: scoreBreakdown | null;
  care_logs?: careLogRow[];
  repair_requests?: repairRequestRow[];
  next_life_routes?: nextLifeRouteRow[];
};

export type productListItem = {
  id: string;
  name: string;
  brand?: string;
  category: string;
  status: status;
  careScore?: number;
};

export type productDetail = productListItem & {
  scores?: scoreBreakdown;
  logs?: logItem[];
};

export function toListItem(row: productRow): productListItem {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category,
    status: row.status,
    careScore: row.care_score ?? undefined,
  };
}
