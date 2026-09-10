# CareLoop MCP Server Setup

**Live MCP URL**: `https://tcl-mcp.vercel.app/mcp`

Only Claude Desktop is tested. Other clients aren't verified against this server.

---

## Claude Desktop

Settings → Connectors → Add custom connector, then paste the URL:
`https://tcl-mcp.vercel.app/mcp`

Or add directly to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/mcp"
    }
  }
}
```

---

## Available Tools
- `searchProducts`: Find products using vector search
- `addCareLog`: Log product care actions
- `addRepairRequest`: File repair requests
- `addNextLifeRoute`: Route items to reuse/recycle
