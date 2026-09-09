# CareLoop MCP Server Setup Guide

This guide details how to install, configure, and run the **CareLoop Model Context Protocol (MCP)** server for **Claude Desktop**, **Claude Code CLI**, and remote MCP clients over **stdio** or **Server-Sent Events (SSE)**.

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

## 🛠️ Step 1: Local Installation & Build

1. **Navigate to the MCP directory**:
   ```bash
   cd mcp
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file inside the `mcp/` folder (or copy `.env.example`):
   ```bash
   cp .env.example .env
   ```
   Fill in your API credentials:
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

## 💻 Step 2: Integrating with Claude Desktop (`stdio` Mode)

In `stdio` mode, Claude Desktop launches the MCP server directly as a subprocess via standard input/output.

1. Open your Claude Desktop configuration file:
   - **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   - **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

2. Add `careloop` under `mcpServers` (replace paths and keys with your own):
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
           "SUPABASE_SCHEMA": "careloop",
           "VOYAGE_API_KEY": "your-voyage-api-key"
         }
       }
     }
   }
   ```

3. Restart Claude Desktop. The CareLoop tools icon will appear in the input chat area.

---

## 💻 Step 3: Integrating with Claude Code CLI

To use CareLoop MCP tools directly inside your terminal with **Claude Code**:

```bash
claude mcp add careloop node /absolute/path/to/ai-solution-sprint/mcp/dist/local.js --stdio -e SUPABASE_URL=https://your-project.supabase.co -e SUPABASE_SERVICE_KEY=your-supabase-service-key -e VOYAGE_API_KEY=your-voyage-api-key
```

---

## 🌐 Step 4: Running as Local SSE Server

If you prefer HTTP Server-Sent Events (SSE) for remote clients or debugging:

1. Start the SSE server:
   ```bash
   cd mcp
   npm run dev
   ```
2. The SSE endpoint will be available at:
   `http://localhost:4001/sse`

---

## ☁️ Step 5: Vercel Remote Deployment

Deploy the serverless MCP server directly to Vercel:

1. **Deploy via CLI**:
   ```bash
   cd mcp
   npx vercel --prod
   ```
2. **Environment Variables on Vercel**:
   Add `SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, and `VOYAGE_API_KEY` in your Vercel project settings.
3. **SSE Connection URL**:
   `https://your-mcp-app.vercel.app/sse`

---

## 🧰 Available CareLoop MCP Tools

Once connected, the AI model gains access to the following 4 tools:

| Tool | Description | Example Arguments |
|---|---|---|
| `searchProducts` | Vector similarity search for catalog items via Voyage AI. | `{"query": "backpack"}` |
| `addCareLog` | Log routine care (`clean`, `store`, `rotate`, `service`). | `{"productId": "123", "type": "clean"}` |
| `addRepairRequest` | File a repair ticket for broken or damaged items. | `{"productId": "123", "issue": "zipper broken"}` |
| `addNextLifeRoute` | Route item to next life (`reuse`, `resell`, `donate`, `refurbish`, `recycle`). | `{"productId": "123", "route": "resell"}` |

---

## 🧪 Testing & Verification

- **Stdio test**: Run `npm run start:stdio` in terminal to verify JSON-RPC initialization.
- **Claude test query**: Try asking Claude: *"Search for products related to hiking and log a cleaning action."*
