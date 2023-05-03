import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserCheckInsHistoryUseCase } from "@/use-cases/factories/make-fetch-user-check-ins-history-use-case";

export async function history(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInQuerySchema = z.object({
        page: z.coerce.number().nullable().default(1),
    });

    const { page } = createCheckInQuerySchema.parse(request.query);

    const fetchCheckInHistoryUseCase = makeFetchUserCheckInsHistoryUseCase();
    const { checkIns } = await fetchCheckInHistoryUseCase.execute({
        userId: request.user.sub,
        page: page as number,
    });

    return reply.status(200).send({
        checkIns,
    });
}
