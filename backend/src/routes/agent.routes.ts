import { Router } from 'express';
import { chat } from '../controllers/agent.controller';

export const agentRouter = Router();

agentRouter.post('/chat', chat);
