import { z } from "zod";
import { FastifyReply, FastifyRequest } from "fastify";
import { makeCheckInUseCase } from "@/use-cases/factories/make-check-in-use-case";
import { MaxDistanceError } from "@/use-cases/erros/max-distance-error";
import { ResourceNotFoundError } from "@/use-cases/erros/resource-not-found-error";
import { AlreadyCheckedInToday } from "@/use-cases/erros/already-checked-in-today";

export async function create(request: FastifyRequest, reply: FastifyReply) {
    const createCheckInParamsSchema = z.object({
        gymId: z.string().uuid(),
    });

    const createCheckInBodySchema = z.object({
        latitude: z.number().refine((value) => {
            return Math.abs(value) <= 90;
        }),
        longitude: z.number().refine((value) => {
            return Math.abs(value) <= 180;
        }),
    });

    const { latitude, longitude } = createCheckInBodySchema.parse(request.body);
    const { gymId } = createCheckInParamsSchema.parse(request.params);

    const createCheckInUseCase = makeCheckInUseCase();

    try {
        await createCheckInUseCase.execute({
            gymId,
            userId: request.user.sub,
            userLatitude: latitude,
            userLongitude: longitude,
        });

        return reply.status(201).send();
    } catch (error) {
        if (error instanceof MaxDistanceError || error instanceof ResourceNotFoundError || error instanceof AlreadyCheckedInToday) {
            return reply.status(400).send({ message: error.message });
        }
    }

}
