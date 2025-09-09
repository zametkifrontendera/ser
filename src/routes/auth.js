import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import prisma from "@/shared/lib/prisma.js";

const router = express.Router();

router.post("/login", async (req, res) => {
  const { emailOrPhone, password } = req.body;
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: emailOrPhone },
        { phone: emailOrPhone }
      ]
    }
  });

  if (!user) return res.status(400).json({ message: "Пользователь не найден" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Неверный пароль" });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token });
});

export default router;
