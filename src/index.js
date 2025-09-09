import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import authRouter from "./routes/auth.js";

const app = express();

app.use(cors({
  origin: config.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

app.use("/auth", authRouter);

app.get("/", (req, res) => res.send("API vmetke работает"));

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});
