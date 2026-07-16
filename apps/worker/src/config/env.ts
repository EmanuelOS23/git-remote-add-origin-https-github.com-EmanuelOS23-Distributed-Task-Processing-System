import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  RABBITMQ_URL: z.string().default('amqp://guest:guest@localhost:5672'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Configuração de ambiente inválida', parsed.error.format());
  process.exit(1);
}

export const config = parsed.data;
