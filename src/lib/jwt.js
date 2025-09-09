import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function generateToken(userId) {
  return jwt.sign({ id: userId }, config.JWT_SECRET, { expiresIn: "7d" });
}
