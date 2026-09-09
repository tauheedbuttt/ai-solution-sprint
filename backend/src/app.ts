import cors from 'cors';
import express from 'express';
import { productsRouter } from './routes/products.routes';

export const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productsRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

export default app;
