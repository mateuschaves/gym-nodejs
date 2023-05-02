import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeFetchNearbyGymsUseCase } from '@/use-cases/factories/make-fetch-nearby-gyms-use-case';

export async function fetchNearbyGyms(request: FastifyRequest, reply: FastifyReply) {
    const fetchNearbyGymsParamsSchema = z.object({
        userLatitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 90
        }),
        userLongitude: z.coerce.number().refine(value => {
            return Math.abs(value) <= 180
        }),
    })

    const { userLatitude, userLongitude } = fetchNearbyGymsParamsSchema.parse(request.query)

    const fetchNearbyGymsUseCase = makeFetchNearbyGymsUseCase()
    const response = await fetchNearbyGymsUseCase.execute({ userLatitude, userLongitude })

    return reply.status(200).send({
        gyms: response.gyms,
    })
}
