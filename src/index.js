import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { routes } from './routes.js';

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigins,
    credentials: true,
  })
);

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));
app.use('/api', routes);

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
