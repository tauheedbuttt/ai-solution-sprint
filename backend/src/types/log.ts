export type careType = 'clean' | 'store' | 'rotate' | 'service';
export type route = 'reuse' | 'resell' | 'donate' | 'refurbish' | 'recycle';

export type careLogRow = {
  id: string;
  product_id: string;
  type: careType;
  note: string | null;
  share: boolean;
  created_at: string;
};

export type repairRequestRow = {
  id: string;
  product_id: string;
  partner_id: string;
  issue: string;
  created_at: string;
};

export type nextLifeRouteRow = {
  id: string;
  product_id: string;
  route: route;
  partner_id: string | null;
  retained_value: number | null;
  created_at: string;
};

export type careLog = { id: string; productId: string; type: careType; note?: string; share: boolean; createdAt: string };
export type repairRequest = { id: string; productId: string; partnerId: string; issue: string; createdAt: string };
export type nextLifeRoute = { id: string; productId: string; route: route; partnerId?: string; retainedValue?: number; createdAt: string };

export function toCareLog(row: careLogRow): careLog {
  return { id: row.id, productId: row.product_id, type: row.type, note: row.note ?? undefined, share: row.share, createdAt: row.created_at };
}

export function toRepairRequest(row: repairRequestRow): repairRequest {
  return { id: row.id, productId: row.product_id, partnerId: row.partner_id, issue: row.issue, createdAt: row.created_at };
}

export function toNextLifeRoute(row: nextLifeRouteRow): nextLifeRoute {
  return {
    id: row.id,
    productId: row.product_id,
    route: row.route,
    partnerId: row.partner_id ?? undefined,
    retainedValue: row.retained_value ?? undefined,
    createdAt: row.created_at,
  };
}
