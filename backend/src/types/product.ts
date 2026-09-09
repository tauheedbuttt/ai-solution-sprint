export type status = 'active' | 'draft' | 'routed';

export type scoreCategory = 'health' | 'planet' | 'ethics' | 'longevity';

export type scoreBreakdown = Record<scoreCategory, { value: number; tag: string }>;

export type productRow = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  status: status;
  care_score: number | null;
  scores: scoreBreakdown | null;
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

export function toDetail(row: productRow): productDetail {
  return {
    ...toListItem(row),
    scores: row.scores ?? undefined,
  };
}
