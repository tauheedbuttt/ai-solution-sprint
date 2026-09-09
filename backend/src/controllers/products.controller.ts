import { Request, Response } from 'express';
import { getProductById, listProducts, listRecentLogs } from '../services/products.service';

export async function list(req: Request, res: Response) {
  const search = typeof req.query.q === 'string' ? req.query.q : undefined;
  try {
    const products = await listProducts(search);
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getRecentLogs(req: Request, res: Response) {
  const limit = Number(req.query.limit) || 5;
  try {
    const logs = await listRecentLogs(limit);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getById(req: Request, res: Response) {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
