import { FastifyInstance } from 'fastify'
import { register } from '@/http/controllers/register'
import { authenticate } from '@/http/controllers/authenticate'
import { profile } from './controllers/profile'
import { verifyJWT } from './middlewares/verify-jwt'

export async function appRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated routes

  app.get('/me', { onRequest: [verifyJWT] }, profile)
}
