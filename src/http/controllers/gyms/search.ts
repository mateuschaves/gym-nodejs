import { z } from 'zod'
import { FastifyReply, FastifyRequest } from 'fastify'
import { makeSearchGymUseCase } from '@/use-cases/factories/make-search-gym-use-case';

export async function searchGyms(request: FastifyRequest, reply: FastifyReply) {
    const searchGymParamSchema = z.object({
        query: z.string().nullable().default(''),
        page: z.coerce.number().default(1),
    })

    const { page, query } = searchGymParamSchema.parse(request.query)

    const searchGymUseCase = makeSearchGymUseCase()
    const response = await searchGymUseCase.execute({ query, page })

    return reply.status(200).send({
        gyms: response.gyms,
    })
}
