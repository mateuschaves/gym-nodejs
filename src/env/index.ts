import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3000),
})

const _env = envSchema.safeParse(process.env)

if (!_env.success) {
  console.error('❌ Env validation error', _env.error)

  throw new Error('Invalid environment variables.')
}

export const env = _env.data
