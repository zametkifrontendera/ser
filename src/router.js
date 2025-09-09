import express from 'express';
import { authRouter } from './features/auth/register.js';

export const routes = express.Router();

routes.use('/auth', authRouter);
