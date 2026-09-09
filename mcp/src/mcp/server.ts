import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchProductsForAgent } from '../services/products.service.js';
import { createCareLog, createNextLifeRoute, createRepairRequest } from '../services/logs.service.js';

export function createCareLoopMcpServer(): McpServer {
  const server = new McpServer({
    name: 'careloop-mcp',
    version: '1.0.0',
  });

  server.tool(
    'searchProducts',
    'Find products by name, brand, category, or status. Call this before any log action to resolve product ids. Can match multiple products.',
    {
      query: z.string().optional().describe('free text describing the product, e.g. "backpack" or "coffee maker"'),
      category: z.string().optional().describe('exact category, e.g. "Home", "Outdoor", "Appliances", "Clothing"'),
      brand: z.string().optional(),
      status: z.enum(['active', 'draft', 'routed']).optional(),
    },
    async (input) => {
      try {
        const result = await searchProductsForAgent(input);
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error: ${err.message ?? err}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'addCareLog',
    'Log routine care (clean, store, rotate, service) for a product. Requires a productId from searchProducts.',
    {
      productId: z.string(),
      type: z.enum(['clean', 'store', 'rotate', 'service']),
      note: z.string().optional(),
      share: z.boolean().optional(),
    },
    async ({ productId, type, note, share }) => {
      try {
        const result = await createCareLog(productId, { type, note, share: share ?? false });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error: ${err.message ?? err}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'addRepairRequest',
    'File a repair request for a broken or damaged product. Requires a productId from searchProducts.',
    {
      productId: z.string(),
      issue: z.string().describe('what is wrong with the product'),
    },
    async ({ productId, issue }) => {
      try {
        const result = await createRepairRequest(productId, { issue });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error: ${err.message ?? err}` }],
          isError: true,
        };
      }
    },
  );

  server.tool(
    'addNextLifeRoute',
    'Route a product to its next life stage (reuse, resell, donate, refurbish, recycle). Requires a productId from searchProducts.',
    {
      productId: z.string(),
      route: z.enum(['reuse', 'resell', 'donate', 'refurbish', 'recycle']),
      retainedValue: z.number().optional(),
    },
    async ({ productId, route, retainedValue }) => {
      try {
        const result = await createNextLifeRoute(productId, { route, retainedValue });
        return {
          content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
        };
      } catch (err: any) {
        return {
          content: [{ type: 'text', text: `Error: ${err.message ?? err}` }],
          isError: true,
        };
      }
    },
  );

  return server;
}
