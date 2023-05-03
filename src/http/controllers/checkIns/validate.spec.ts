import { app } from '@/app';
import { prisma } from '@/lib/prisma';
import { makeCheckInUseCase } from '@/use-cases/factories/make-check-in-use-case';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('Valitade user check in (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to validate user check ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const createGymUseCase = makeCreateGymUseCase()
        const checkInUseCase = makeCheckInUseCase()

        const user = await prisma.user.findFirstOrThrow()

        const { gym } = await createGymUseCase.execute({
            title: "Nearby gym",
            description: "Nearby gym",
            latitude: -8.306933,
            longitude: -35.958334,
            phone: "123456789",
        })


        const { checkIn } = await checkInUseCase.execute({
            userLatitude: -8.306933,
            userLongitude: -35.958334,
            gymId: gym.id,
            userId: user.id,
        })

        const response = await request(app.server)
            .patch(`/check-ins/${checkIn.id}/validate`)
            .set('Authorization', `Bearer ${token}`)

        expect(response.status).toBe(200);
        expect(response.body.checkIn).toMatchObject({
            id: expect.any(String),
            user_id: user.id,
            gym_id: gym.id,
            validated_at: expect.any(String),
        });
    });

    it('should not be able to validate user check ins without jwt token', async () => {
        const response = await request(app.server)
            .patch(`/check-ins/fake-check-in-id/validate`)

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized',
        })
    })
});