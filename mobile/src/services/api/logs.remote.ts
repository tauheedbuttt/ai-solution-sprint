import { httpClient } from './httpClient';
import type { careType, route } from './index';

export async function postCareLog(productId: string, input: { type: careType; note?: string; share: boolean }): Promise<void> {
  await httpClient.post(`/products/${productId}/care-logs`, input);
}

export async function postRepairRequest(productId: string, input: { partnerId: string; issue: string }): Promise<void> {
  await httpClient.post(`/products/${productId}/repair-requests`, input);
}

export async function postNextLifeRoute(
  productId: string,
  input: { route: route; partnerId?: string; retainedValue?: number },
): Promise<void> {
  await httpClient.post(`/products/${productId}/next-life-routes`, input);
}
