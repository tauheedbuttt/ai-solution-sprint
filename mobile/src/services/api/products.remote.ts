import { httpClient } from './httpClient';
import type { product } from './index';

export async function fetchProducts(search?: string): Promise<product[]> {
  const { data } = await httpClient.get<product[]>('/products', { params: search ? { q: search } : undefined });
  return data;
}

export async function fetchProductById(id: string): Promise<product | null> {
  try {
    const { data } = await httpClient.get<product>(`/products/${id}`);
    return data;
  } catch (err: any) {
    if (err?.response?.status === 404) return null;
    throw err;
  }
}
