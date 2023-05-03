import { app } from '@/app';
import { makeCreateGymUseCase } from '@/use-cases/factories/make-create-gym-use-case';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('Create CheckIn (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to create a check in on a nearby gym', async () => {
        const { token } = await createAndAuthenticateUser(app)

        const createGymUseCase = makeCreateGymUseCase()

        const { gym } = await createGymUseCase.execute({
            title: "Nearby gym",
            description: "Nearby gym",
            latitude: -8.306933,
            longitude: -35.958334,
            phone: "123456789",
        })

        const response = await request(app.server)
            .post(`/gyms/${gym.id}/check-ins`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                latitude: -8.306933,
                longitude: -35.958334,
            })

        expect(response.status).toBe(201);
    });

    it('should not be able to check in without jwt token', async () => {
        const response = await request(app.server)
            .post('/gyms/fake-gym/check-ins')
            .send({
                latitude: -8.306933,
                longitude: -35.958334,
            })
        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized',
        })
    })
});