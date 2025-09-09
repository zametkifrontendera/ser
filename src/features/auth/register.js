import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import { config } from '../../config/env.js';

export const authRouter = express.Router();

function detectLoginType(login) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  const phoneRegex = /^\+?\d{10,15}$/;
  if (emailRegex.test(login)) return 'email';
  if (phoneRegex.test(login)) return 'phone';
  return 'username';
}

function passwordStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[@$!%*?&#^()+\-_=./,;:]/.test(pw)) score++;
  return score; // 0..4
}

authRouter.post('/register', async (req, res) => {
  try {
    const { name, login, password } = req.body || {};

    if (!name || !login || !password) {
      return res.status(400).json({ message: 'name, login и password обязательны' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Пароль слишком короткий (мин. 6 символов)' });
    }

    const strength = passwordStrength(password);
    if (strength < 1) {
      return res.status(400).json({ message: 'Пароль не удовлетворяет базовым требованиям' });
    }

    const type = detectLoginType(login);

    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          type === 'email' ? { email: login } : undefined,
          type === 'phone' ? { phone: login } : undefined,
          type === 'username' ? { username: login } : undefined,
        ].filter(Boolean),
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'Пользователь с такими данными уже существует' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const data = {
      name,
      passwordHash,
      username: type === 'username' ? login : null,
      email: type === 'email' ? login : null,
      phone: type === 'phone' ? login : null,
    };

    const user = await prisma.user.create({ data });

    const token = jwt.sign(
      { sub: user.id, name: user.name, username: user.username, email: user.email, phone: user.phone },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn }
    );

    const { passwordHash: _ph, ...userSafe } = user;
    return res.status(201).json({ token, user: userSafe });
  } catch (e) {
    console.error('Register error:', e);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});
