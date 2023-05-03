import { app } from '@/app';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('Fetch user check ins (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to fetch user check ins', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const createGymUseCase = makeCreateGymUseCase()

        const { gym } = await createGymUseCase.execute({
            title: "Nearby gym",
            description: "Nearby gym",
            latitude: -8.306933,
            longitude: -35.958334,
            phone: "123456789",
        })

        await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -8.306933,
                longitude: -35.958334,
            })

        const response = await request(app.server)
            .get('/check-ins')
            .set('Authorization', `Bearer ${token}`)
            .query({
                page: 1,
            })


        expect(response.status).toBe(200);
        expect(response.body.checkIns).toHaveLength(1);
        expect(response.body.checkIns).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user_id: expect.any(String),
                    gym_id: expect.any(String),
                    validated_at: null,
                })
            ])
        )
    });

    it('should not be able to fetch user check ins without jwt token', async () => {
        const response = await request(app.server)
            .get('/check-ins')
            .query({
                page: 1,
            })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized',
        })
    })
});