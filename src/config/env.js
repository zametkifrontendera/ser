import dotenv from 'dotenv';
dotenv.config();

const parseOrigins = (s) =>
  (s || '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean);

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigins: parseOrigins(process.env.CORS_ORIGINS) || ['http://vmetke.ru', 'https://vmetke.ru'],
};
