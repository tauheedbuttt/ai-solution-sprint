# CareLoop — Circular Product Lifecycle Platform

CareLoop is a circular product lifecycle platform that empowers users to track product care, request repairs, and route items to their next life stage (reuse, resell, donate, refurbish, recycle).

---

## 🚀 Key Built Components

### 1. 📱 Mobile App (`/mobile`)
- **Tech Stack:** React Native, Expo, TypeScript
- **Features:** 
  - Interactive UI for managing products and viewing care history.
  - Direct integration with CareLoop backend API.
  - Built-in AI Agent chat UI supporting real-time streaming responses and tool execution feedback.

### 2. ⚡ Backend API (`/backend`)
- **Tech Stack:** Node.js, Express, TypeScript, Supabase (Postgres)
- **Features:**
  - REST API endpoints for products, care logs, repair requests, and next-life routing.
  - Vercel Serverless deployment support (`@vercel/node`).
  - Langfuse telemetry instrumentation for AI tracing and observability.

### 3. 🤖 AI Agent & Tools (`/backend/src/services/agent.service.ts`)
- **Tech Stack:** Vercel AI SDK (`ai`), AWS Bedrock (`anthropic.claude-3-5-sonnet`)
- **Capabilities:**
  - Natural language task execution with streaming SSE response (`runAgentStream`).
  - Integrated agent tools:
    - `searchProducts`: Find products by name, category, brand, or vector similarity search.
    - `addCareLog`: Log routine maintenance (`clean`, `store`, `rotate`, `service`).
    - `addRepairRequest`: File repair request for broken/damaged items.
    - `addNextLifeRoute`: Route item to next lifecycle (`reuse`, `resell`, `donate`, `refurbish`, `recycle`).

### 4. 🔍 Embeddings & Vector Search
- **Tech Stack:** Voyage AI (`voyage-3.5`), Supabase Vector (`pgvector`)
- **Capabilities:**
  - Semantic vector search for product catalog discovery.
  - High-accuracy query match resolution within AI agent and MCP server tools.

### 5. 🔌 MCP Server (`/mcp`)
- **Tech Stack:** Model Context Protocol SDK, Express, Node.js
- **Capabilities:**
  - Standalone MCP server exposing the **exact same tools** (`searchProducts`, `addCareLog`, `addRepairRequest`, `addNextLifeRoute`) to AI clients.
  - Supports local `stdio` mode (for Claude Desktop / Claude Code CLI) and HTTP `SSE` mode (for remote MCP clients / Vercel deployment).

---

## 📁 Repository Structure

```
ai-solution-sprint/
├── mobile/      # Expo / React Native mobile application
├── backend/     # Express API server, Vercel AI SDK agent & Supabase integration
├── mcp/         # Standalone Model Context Protocol server exposing CareLoop tools
├── specs/       # System specs and challenge requirements
└── docs/        # Challenge documentation & partner briefs
```

---

## 🛠️ Quickstart

### Backend
```bash
cd backend
npm install
npm run dev
```

### MCP Server
```bash
cd mcp
npm install
npm run dev        # SSE server on port 4001
npm run dev:stdio  # stdio mode for Claude Desktop
```

### Mobile App
```bash
cd mobile
npm install
npm start
```
