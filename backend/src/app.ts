import './instrumentation';
import cors from 'cors';
import express from 'express';
import { agentRouter } from './routes/agent.routes';
import { productsRouter } from './routes/products.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productsRouter);
app.use('/agent', agentRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
