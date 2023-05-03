import { FastifyInstance } from 'fastify'
import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { create } from './create'
import { fetchNearbyGyms } from './fetch-nearby-gyms'
import { searchGyms } from './search'
import { verifyUserRole } from '@/http/middlewares/verify-user-role'

export async function gymsRoutes(app: FastifyInstance) {
    app.addHook('onRequest', verifyJWT)

    app.post('/gyms', { onRequest: [verifyUserRole('ADMIN')] }, create)
    app.get('/gyms/nearby', fetchNearbyGyms)
    app.get('/gyms', searchGyms)
}
