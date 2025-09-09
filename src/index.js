import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import { routes } from './routes.js';
import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());

app.use(cors({
  origin: "http://vmetke.ru",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.use('/api', routes);

app.use("/auth", authRouter);

app.options("*", cors({
  origin: "http://vmetke.ru",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
}));

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
