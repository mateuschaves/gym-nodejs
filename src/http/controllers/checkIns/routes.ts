import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { history } from './history'
import { validate } from './validate'
import { metrics } from './metric'

export async function checkInRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/gyms/:gymId/check-ins', create)
    app.get('/check-ins', history)
    app.patch('/check-ins/:checkInId/validate', validate)
    app.get('/check-ins/metrics', metrics)
}
