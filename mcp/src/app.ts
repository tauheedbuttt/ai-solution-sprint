import express, { Request, Response } from 'express';
import cors from 'cors';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createCareLoopMcpServer } from './mcp/server.js';

const app = express();
app.use(cors());
app.use(express.json());

const transports = new Map<string, SSEServerTransport>();

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'careloop-mcp' });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', server: 'careloop-mcp' });
});

async function handleSseRequest(req: Request, res: Response, messageEndpoint: string) {
  const transport = new SSEServerTransport(messageEndpoint, res);
  const sessionId = transport.sessionId;
  transports.set(sessionId, transport);

  const server = createCareLoopMcpServer();

  req.on('close', () => {
    transports.delete(sessionId);
  });

  await server.connect(transport);
}

async function handlePostMessage(req: Request, res: Response) {
  const sessionId = req.query.sessionId as string;
  if (!sessionId) {
    res.status(400).json({ error: 'Missing sessionId query parameter' });
    return;
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    res.status(404).json({ error: 'Session not found or expired' });
    return;
  }

  await transport.handlePostMessage(req, res, req.body);
}

app.get('/sse', (req: Request, res: Response) => handleSseRequest(req, res, '/message'));
app.post('/message', (req: Request, res: Response) => handlePostMessage(req, res));

app.get('/api/sse', (req: Request, res: Response) => handleSseRequest(req, res, '/api/message'));
app.post('/api/message', (req: Request, res: Response) => handlePostMessage(req, res));

async function handleStreamableHttp(req: Request, res: Response) {
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  const server = createCareLoopMcpServer();
  res.on('close', () => {
    transport.close();
    server.close();
  });
  await server.connect(transport);
  await transport.handleRequest(req, res, req.body);
}

app.post('/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));
app.get('/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));
app.delete('/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));

app.post('/api/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));
app.get('/api/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));
app.delete('/api/mcp', (req: Request, res: Response) => handleStreamableHttp(req, res));

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'CareLoop MCP Server',
    status: 'running',
    endpoints: {
      mcp: '/mcp or /api/mcp',
      sse: '/sse or /api/sse',
      message: '/message or /api/message',
      health: '/health',
    },
  });
});

export default app;
