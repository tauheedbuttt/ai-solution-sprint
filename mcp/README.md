# CareLoop MCP Server

Standalone Model Context Protocol (MCP) server for **Claude Desktop**. Deploys on Vercel (Streamable HTTP) or runs locally via `stdio`.

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

### Option 2: Remote / Vercel (Streamable HTTP)
Settings → Connectors → Add custom connector, then paste the `/mcp` endpoint:
`https://your-mcp-app.vercel.app/mcp`

This is the transport Claude Desktop's custom connector UI expects. The server also exposes a legacy `/sse` endpoint, but it isn't used by Claude Desktop and isn't tested.

---

## Development & Build Commands

```bash
npm install

# Local Express SSE Server
npm run dev

# Local stdio mode (for testing Claude Desktop's stdio option)
npm run dev:stdio

# Build TypeScript
npm run build
```

## Vercel Deployment

This directory is linked to a Vercel project via GitHub integration. Pushing to `main` auto-deploys:

```bash
git add mcp/
git commit -m "your message"
git push origin main
```

Check deploy status on the commit:

```bash
gh api repos/<owner>/<repo>/commits/<sha>/status --jq '.statuses[] | select(.context | contains("tcl-mcp"))'
```

Manual deploy (needs `vercel login` first if the CLI token is stale):

```bash
cd mcp
vercel --prod
```
