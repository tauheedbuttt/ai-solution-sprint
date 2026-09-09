# CareLoop MCP Server Setup Guide

This guide details how to install, configure, and connect the **CareLoop Model Context Protocol (MCP)** server across major AI applications including **Claude (Desktop & CLI)**, **Gemini / Antigravity**, **Cursor / Codex / Windsurf**, and custom MCP clients.

---

## 📋 Prerequisites

- **Node.js**: `v22.x` or higher
- **Package Manager**: `npm`
- **Required API Keys & Environment Variables**:
  - `SUPABASE_URL`: Your Supabase database endpoint.
  - `SUPABASE_SERVICE_KEY`: Service role secret for Supabase access.
  - `SUPABASE_SCHEMA`: (Optional, default `careloop`) Database schema name.
  - `VOYAGE_API_KEY`: API key from Voyage AI for vector embeddings.
  - `VOYAGE_MODEL`: (Optional, default `voyage-3.5`) Voyage AI embedding model.
  - `PORT`: (Optional, default `4001`) Port for local SSE server.

---

## 🛠️ Step 1: Local Build

1. **Navigate to MCP directory**:
   ```bash
   cd mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside `mcp/`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_KEY=your-supabase-service-key
   SUPABASE_SCHEMA=careloop
   VOYAGE_API_KEY=your-voyage-api-key
   VOYAGE_MODEL=voyage-3.5
   PORT=4001
   ```

4. **Build TypeScript code**:
   ```bash
   npm run build
   ```

---

## 💻 Step 2: Client Integration Guides

### 1. 🟠 Claude Desktop (macOS / Windows)

In `stdio` mode, Claude Desktop launches the MCP server as a subprocess.

1. Open your Claude Desktop config file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add `careloop` to `mcpServers`:
   ```json
   {
     "mcpServers": {
       "careloop": {
         "command": "node",
         "args": [
           "/absolute/path/to/ai-solution-sprint/mcp/dist/local.js",
           "--stdio"
         ],
         "env": {
           "SUPABASE_URL": "https://your-project.supabase.co",
           "SUPABASE_SERVICE_KEY": "your-supabase-service-key",
           "VOYAGE_API_KEY": "your-voyage-api-key"
         }
       }
     }
   }
   ```
3. Restart Claude Desktop.

---

### 2. 💻 Claude Code CLI

Add CareLoop directly to your terminal CLI:

```bash
claude mcp add careloop node /absolute/path/to/ai-solution-sprint/mcp/dist/local.js --stdio -e SUPABASE_URL=https://your-project.supabase.co -e SUPABASE_SERVICE_KEY=your-supabase-service-key -e VOYAGE_API_KEY=your-voyage-api-key
```

---

### 3. ♊ Gemini / Antigravity CLI

For Antigravity CLI and Gemini-powered agents:

1. Add server definition in `mcp_servers` configuration (e.g. in `~/.gemini/antigravity-cli/mcp/careloop/` or workspace `.gemini/settings.json`):
   ```json
   {
     "mcpServers": {
       "careloop": {
         "command": "node",
         "args": ["/absolute/path/to/ai-solution-sprint/mcp/dist/local.js", "--stdio"],
         "env": {
           "SUPABASE_URL": "https://your-project.supabase.co",
           "SUPABASE_SERVICE_KEY": "your-supabase-service-key",
           "VOYAGE_API_KEY": "your-voyage-api-key"
         }
       }
     }
   }
   ```
2. Alternatively, for HTTP/SSE mode, register the SSE endpoint:
   `http://localhost:4001/sse` or `https://your-mcp-app.vercel.app/sse`.

---

### 4. ⚡ Cursor / Windsurf / Codex / VS Code (Continue & Roo Code)

#### **Cursor IDE**
1. Open **Cursor Settings** -> **Features** -> **MCP**.
2. Click **+ Add New MCP Server**.
3. Set Type to `command` (stdio) or `sse`:
   - **Command**: `node /absolute/path/to/ai-solution-sprint/mcp/dist/local.js --stdio`
   - **SSE URL**: `http://localhost:4001/sse`

#### **Continue.dev (VS Code & JetBrains)**
Add to `~/.continue/config.json`:
```json
{
  "mcpServers": [
    {
      "name": "careloop",
      "command": "node",
      "args": ["/absolute/path/to/ai-solution-sprint/mcp/dist/local.js", "--stdio"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_KEY": "your-supabase-service-key",
        "VOYAGE_API_KEY": "your-voyage-api-key"
      }
    }
  ]
}
```

#### **Roo Code (VS Code Extension)**
Add to `.vscode/mcp.json` or global Roo settings:
```json
{
  "mcpServers": {
    "careloop": {
      "command": "node",
      "args": ["/absolute/path/to/ai-solution-sprint/mcp/dist/local.js", "--stdio"],
      "env": {
        "SUPABASE_URL": "https://your-project.supabase.co",
        "SUPABASE_SERVICE_KEY": "your-supabase-service-key",
        "VOYAGE_API_KEY": "your-voyage-api-key"
      }
    }
  }
}
```

---

## 🌐 Step 3: Running Local SSE Server or Vercel Deployment

### Local SSE Server
```bash
cd mcp
npm run dev
# Endpoint: http://localhost:4001/sse
```

### Remote Vercel Serverless Deployment
```bash
cd mcp
npx vercel --prod
# Endpoint: https://your-mcp-app.vercel.app/sse
```

---

## 🧰 Available CareLoop MCP Tools

| Tool | Description | Example Arguments |
|---|---|---|
| `searchProducts` | Vector similarity search for catalog items via Voyage AI. | `{"query": "backpack"}` |
| `addCareLog` | Log routine care (`clean`, `store`, `rotate`, `service`). | `{"productId": "123", "type": "clean"}` |
| `addRepairRequest` | File a repair ticket for broken or damaged items. | `{"productId": "123", "issue": "zipper broken"}` |
| `addNextLifeRoute` | Route item to next life (`reuse`, `resell`, `donate`, `refurbish`, `recycle`). | `{"productId": "123", "route": "resell"}` |

---

## 🧪 Testing & Verification

- **Stdio test**: Run `npm run start:stdio` in terminal to verify JSON-RPC initialization.
- **Claude / Gemini / Codex test query**: Ask your assistant: *"Search for products related to hiking and log a cleaning action."*
