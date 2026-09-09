import { Request, Response } from 'express';
import {
  createCareLog,
  createNextLifeRoute,
  createRepairRequest,
  listCareLogs,
  listNextLifeRoutes,
  listRepairRequests,
} from '../services/logs.service';

export async function addCareLog(req: Request, res: Response) {
  try {
    const log = await createCareLog(req.params.id, req.body);
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getCareLogs(req: Request, res: Response) {
  try {
    res.json(await listCareLogs(req.params.id));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function addRepairRequest(req: Request, res: Response) {
  try {
    const request = await createRepairRequest(req.params.id, req.body);
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getRepairRequests(req: Request, res: Response) {
  try {
    res.json(await listRepairRequests(req.params.id));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function addNextLifeRoute(req: Request, res: Response) {
  try {
    const route = await createNextLifeRoute(req.params.id, req.body);
    res.status(201).json(route);
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}

export async function getNextLifeRoutes(req: Request, res: Response) {
  try {
    res.json(await listNextLifeRoutes(req.params.id));
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
}
