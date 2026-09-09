import { Router } from 'express';
import { chat } from '../controllers/agent.controller.js';

export const agentRouter = Router();

agentRouter.post('/chat', chat);
