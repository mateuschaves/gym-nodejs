import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeValitadeCheckIn } from "@/use-cases/factories/make-validate-check-in";
import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { LateCheckInValidationError } from "@/use-cases/erros/late-check-in-validation-error";

export async function validate(request: FastifyRequest, reply: FastifyReply) {
    const validateCheckInParamsSchema = z.object({
        checkInId: z.string().uuid(),
    });

    const { checkInId } = validateCheckInParamsSchema.parse(request.params);

    const validateCheckInUseCase = makeValitadeCheckIn();
    try {
        const { checkIn } = await validateCheckInUseCase.execute({
            checkInId,
        });

        return reply.status(200).send({
            checkIn,
        });
    } catch (error) {
        if (error instanceof ResourceNotFoundError || error instanceof LateCheckInValidationError) {
            return reply.status(400).send({
                message: error.message,
            });
        }
    }
}
