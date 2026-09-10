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
  image_url: string | null;
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
  imageUrl?: string;
};

export type productDetail = productListItem & {
  scores?: scoreBreakdown;
  logs?: logItem[];
};

export type recentLogItem = logItem & { productId: string; productName: string; productBrand?: string; productImageUrl?: string };

const careLabel: Record<string, string> = { clean: 'Cleaned', store: 'Stored', rotate: 'Rotated', service: 'Serviced' };
const routeLabel: Record<string, string> = {
  reuse: 'Routed for reuse',
  resell: 'Routed for resale',
  donate: 'Donated',
  refurbish: 'Sent for refurbishment',
  recycle: 'Recycled',
};

function combineLogs(row: productRow): logItem[] {
  const care = (row.care_logs ?? []).map((c) => ({
    id: c.id,
    kind: 'care' as const,
    label: c.note?.trim() || careLabel[c.type] || c.type,
    date: c.created_at,
  }));
  const repair = (row.repair_requests ?? []).map((r) => ({
    id: r.id,
    kind: 'repair' as const,
    label: 'Repair requested',
    date: r.created_at,
    note: r.issue,
  }));
  const nextLife = (row.next_life_routes ?? []).map((n) => ({
    id: n.id,
    kind: 'nextLife' as const,
    label: routeLabel[n.route] ?? n.route,
    date: n.created_at,
    note: n.retained_value ? `Retained value €${n.retained_value}` : undefined,
  }));
  return [...care, ...repair, ...nextLife].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function toListItem(row: productRow): productListItem {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? undefined,
    category: row.category,
    status: row.status,
    careScore: row.care_score ?? undefined,
    imageUrl: row.image_url ?? undefined,
  };
}

export function toDetail(row: productRow): productDetail {
  return {
    ...toListItem(row),
    scores: row.scores ?? undefined,
    logs: combineLogs(row),
  };
}

export function toRecentLogItems(rows: productRow[], limit: number): recentLogItem[] {
  const all = rows.flatMap((row) =>
    combineLogs(row).map((log) => ({
      ...log,
      productId: row.id,
      productName: row.name,
      productBrand: row.brand ?? undefined,
      productImageUrl: row.image_url ?? undefined,
    })),
  );
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, limit);
}
