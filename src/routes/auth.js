import { Router } from "express";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../lib/jwt.js";

const prisma = new PrismaClient();
const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, login, password } = req.body;

    if (!name || !login || !password) {
      return res.status(400).json({ message: "Все поля обязательны" });
    }

    const existing = await prisma.user.findUnique({ where: { login } });
    if (existing) return res.status(400).json({ message: "Пользователь существует" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, login, password: hashed },
    });

    const token = generateToken(user.id);

    res.status(201).json({ token, user: { id: user.id, name: user.name, login: user.login } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

export default router;
