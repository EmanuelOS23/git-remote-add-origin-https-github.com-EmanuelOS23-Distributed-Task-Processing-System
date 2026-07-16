import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  JWT_SECRET: z.string().default('super-secret-jwt-key'),
  JWT_EXPIRES_IN: z.string().default('1d'),
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Configuração de ambiente inválida', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
