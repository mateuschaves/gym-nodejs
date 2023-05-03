import { FastifyReply, FastifyRequest } from "fastify";
import { makeFetchUserMetricsUseCase } from "@/use-cases/factories/make-fetch-user-metrics-use-case";

export async function metrics(request: FastifyRequest, reply: FastifyReply) {

    const fetchUserMetricsUseCase = makeFetchUserMetricsUseCase();
    const { checkInsCount } = await fetchUserMetricsUseCase.execute({
        userId: request.user.sub,
    });

    return reply.status(200).send({
        checkInsCount,
    });
}
