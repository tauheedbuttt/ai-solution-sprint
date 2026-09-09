# CareLoop MCP Server Setup

**Live MCP URL**: `https://tcl-mcp.vercel.app/sse`

---

## 1. Claude Desktop
Add to `claude_desktop_config.json`:
```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/sse"
    }
  }
}
```

---

## 2. Claude Code CLI
Run in terminal:
```bash
claude mcp add careloop https://tcl-mcp.vercel.app/sse
```

---

## 3. Gemini / Antigravity
Add to `.gemini/settings.json`:
```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/sse"
    }
  }
}
```

---

## 4. Cursor IDE
1. Open **Cursor Settings** → **Features** → **MCP**.
2. Add Server → Name: `careloop` | Type: `SSE` | URL: `https://tcl-mcp.vercel.app/sse`

---

## 5. VS Code (Continue / Roo Code)
Add to config file:
```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/sse"
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
