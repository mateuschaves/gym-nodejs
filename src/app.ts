import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from './env'
import fastifyJwt from '@fastify/jwt'
import fastifyCookie from '@fastify/cookie'

import { usersRoutes } from './http/controllers/users/routes'
import { gymsRoutes } from './http/controllers/gyms/routes'
import { checkInRoutes } from './http/controllers/checkIns/routes'

export const app = fastify()

app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie: {
        cookieName: 'refreshToken',
        signed: false,
    },
    sign: {
        expiresIn: '10m',
    }
})

app.register(fastifyCookie)

app.register(usersRoutes)
app.register(gymsRoutes)
app.register(checkInRoutes)

app.get('/', async () => {
    return { ok: '🚀 🏋️‍♀️ 💪 Gym Fastify API' }
})

app.setErrorHandler((error, _, reply) => {
    if (error instanceof ZodError) {
        reply.status(400).send({ message: 'Validation error', issues: error.format() })
    }

    if (env.NODE_ENV !== 'production') {
        console.error(error)
    } else {

    }

    reply.status(500).send({ message: 'Internal server error' })
})