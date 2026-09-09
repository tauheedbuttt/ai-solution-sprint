import { Router } from 'express';
import { getById, list } from '../controllers/products.controller';

export const productsRouter = Router();

productsRouter.get('/', list);
productsRouter.get('/:id', getById);
