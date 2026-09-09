import { Router } from 'express';
import { getById, getRecentLogs, list } from '../controllers/products.controller.js';
import {
  addCareLog,
  addNextLifeRoute,
  addRepairRequest,
  getCareLogs,
  getNextLifeRoutes,
  getRepairRequests,
} from '../controllers/logs.controller.js';

export const productsRouter = Router();

productsRouter.get('/', list);
productsRouter.get('/logs/recent', getRecentLogs);
productsRouter.get('/:id', getById);

productsRouter.get('/:id/care-logs', getCareLogs);
productsRouter.post('/:id/care-logs', addCareLog);

productsRouter.get('/:id/repair-requests', getRepairRequests);
productsRouter.post('/:id/repair-requests', addRepairRequest);

productsRouter.get('/:id/next-life-routes', getNextLifeRoutes);
productsRouter.post('/:id/next-life-routes', addNextLifeRoute);
