# CareLoop Deployed MCP Server Setup Guide

This guide explains how to connect your **deployed CareLoop MCP Server** (hosted on Vercel / Remote Server via SSE) directly into **Claude Desktop**, **Claude Code CLI**, **Gemini / Antigravity**, **Cursor / Codex / Windsurf**, and other AI tools.

---

## 🌐 Deployed MCP Server Endpoint

Your live, deployed MCP server endpoint:

```
https://tcl-mcp.vercel.app/sse
```
*(Replace `your-mcp-app.vercel.app` with your actual Vercel deployment URL or domain)*

- **Protocol**: Server-Sent Events (SSE)
- **Authentication / Keys**: Pre-configured on Vercel (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `VOYAGE_API_KEY`) — zero local API keys required for clients!

---

## 🚀 How to Install Deployed MCP in AI Tools

### 1. 🟠 Claude Desktop

Open your Claude Desktop config file:
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

#### **Option A: Direct SSE URL**
```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/sse"
    }
  }
}
```

#### **Option B: Stdio-to-SSE Bridge (`mcp-remote`)**
If your Claude Desktop version requires stdio bridge for SSE:
```json
{
  "mcpServers": {
    "careloop": {
      "command": "npx",
      "args": [
        "-y",
        "mcp-remote",
        "https://tcl-mcp.vercel.app/sse"
      ]
    }
  }
}
```

*Restart Claude Desktop after updating.*

---

### 2. 💻 Claude Code CLI

To register your deployed CareLoop MCP server in terminal:

```bash
claude mcp add careloop https://tcl-mcp.vercel.app/sse
```

Or using the `mcp-remote` bridge:
```bash
claude mcp add careloop npx -y mcp-remote https://tcl-mcp.vercel.app/sse
```

---

### 3. ♊ Gemini / Antigravity CLI

In your Antigravity / Gemini MCP configuration (`.gemini/settings.json` or workspace settings):

```json
{
  "mcpServers": {
    "careloop": {
      "url": "https://tcl-mcp.vercel.app/sse"
    }
  }
}
```

Or via bridge:
```json
{
  "mcpServers": {
    "careloop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://tcl-mcp.vercel.app/sse"]
    }
  }
}
```

---

### 4. ⚡ Cursor IDE

1. Open **Cursor Settings** -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Fill in the fields:
   - **Name**: `careloop`
   - **Type**: `SSE`
   - **URL**: `https://tcl-mcp.vercel.app/sse`
4. Click **Save**.

---

### 5. 🌊 Windsurf / Codex / VS Code (Continue.dev & Roo Code)

#### **Continue.dev (`~/.continue/config.json`)**
```json
{
  "mcpServers": [
    {
      "name": "careloop",
      "url": "https://tcl-mcp.vercel.app/sse"
    }
  ]
}
```

#### **Roo Code (`.vscode/mcp.json`)**
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

### 6. 🤖 Custom Node.js / OpenAI / Codex Client Integration

Connect programmatically using `@modelcontextprotocol/sdk`:

```typescript
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const transport = new SSEClientTransport(
  new URL('https://tcl-mcp.vercel.app/sse')
);

const client = new Client({ name: 'careloop-client', version: '1.0.0' }, { capabilities: {} });
await client.connect(transport);

// List available deployed tools
const tools = await client.listTools();
console.log('Available CareLoop tools:', tools);
```

---

## 🧰 Deployed CareLoop MCP Tools

Once installed, your AI tool will instantly get access to all 4 CareLoop capabilities:

| Tool Name | Description | Example Input |
|---|---|---|
| `searchProducts` | Semantic vector search on product catalog using Voyage AI. | `{"query": "hiking backpack"}` |
| `addCareLog` | Log maintenance (`clean`, `store`, `rotate`, `service`). | `{"productId": "prod_1", "type": "clean"}` |
| `addRepairRequest` | File repair ticket for damaged items. | `{"productId": "prod_1", "issue": "zipper broken"}` |
| `addNextLifeRoute` | Route item to next life (`reuse`, `resell`, `donate`, `refurbish`, `recycle`). | `{"productId": "prod_1", "route": "resell"}` |

---

## 🛠️ Local Development (Alternative)

If you need to test local changes instead of using the deployed version:

```bash
cd mcp
npm install
npm run build
# Stdio mode for local testing:
node dist/local.js --stdio
```
