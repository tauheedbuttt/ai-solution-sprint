# CareLoop MCP Server

Standalone Model Context Protocol (MCP) server compatible with **Claude Desktop**, **Claude Code**, and **remote MCP clients**. Deploys on Vercel or runs locally via `stdio` / `SSE`.

## Tools Provided

1. `searchProducts`: Find products by name, category, brand, or status (uses Voyage AI vector search when `query` is provided).
2. `addCareLog`: Log routine care (`clean`, `store`, `rotate`, `service`) for a product.
3. `addRepairRequest`: File a repair request for a damaged product.
4. `addNextLifeRoute`: Route a product to its next life stage (`reuse`, `resell`, `donate`, `refurbish`, `recycle`).

## Environment Variables

Copy `.env.example` to `.env` and fill in the required variables:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `SUPABASE_SCHEMA` (default: `careloop`)
- `VOYAGE_API_KEY`
- `VOYAGE_MODEL` (default: `voyage-3.5`)
- `VOYAGE_BASE_URL` (default: `https://api.voyageai.com/v1`)
- `PORT` (default: `4001`)

---

## Claude Desktop Integration

### Option 1: Local (`stdio`)
Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "careloop": {
      "command": "node",
      "args": ["/absolute/path/to/ai-solution-sprint/mcp/dist/local.js", "--stdio"],
      "env": {
        "SUPABASE_URL": "https://your-supabase.supabase.co",
        "SUPABASE_SERVICE_KEY": "your-service-key",
        "VOYAGE_API_KEY": "your-voyage-key"
      }
    }
  }
}
```

### Option 2: Remote / Vercel (`sse`)
When deployed on Vercel, connect via SSE endpoint:
`https://your-mcp-app.vercel.app/sse`

---

## Development & Build Commands

```bash
npm install

# Local Express SSE Server
npm run dev

# Local stdio mode (for testing Claude CLI)
npm run dev:stdio

# Build TypeScript
npm run build
```

## Vercel Deployment

Deploy this directory directly to Vercel:

```bash
cd mcp
vercel
```
