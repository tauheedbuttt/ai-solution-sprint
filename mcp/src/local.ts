import app from './app.js';
import { env } from './config/env.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createCareLoopMcpServer } from './mcp/server.js';

const useStdio = process.argv.includes('--stdio') || process.env.MCP_TRANSPORT === 'stdio';

if (useStdio) {
  const server = createCareLoopMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('CareLoop MCP Server running on stdio for Claude');
} else {
  app.listen(env.port, () => {
    console.log(`CareLoop MCP Server listening on port ${env.port}`);
    console.log(`SSE endpoint: http://localhost:${env.port}/sse`);
  });
}
