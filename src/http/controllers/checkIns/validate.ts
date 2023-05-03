import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeValitadeCheckIn } from "@/use-cases/factories/make-validate-check-in";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const validateCheckInUseCase = makeValitadeCheckIn();
    const { checkIn } = await validateCheckInUseCase.execute({
        checkInId,
    });

    return reply.status(200).send({
        checkIn,
    });
}
