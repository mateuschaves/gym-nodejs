import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('Search Gym (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to search a gym', async () => {
        const { token } = await createAndAuthenticateUser(app, true)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Nearby gym",
                description: "Nearby gym",
                latitude: -8.306933,
                longitude: -35.958334,
            })

        const response = await request(app.server)
            .get('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .query({
                query: 'Nearby gym',
            })

        expect(response.status).toBe(200);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Nearby gym',
                description: 'Nearby gym',
            })
        ])
    });

    it('should not be able to search a gym without jwt token', async () => {
        const response = await request(app.server)
            .get('/gyms')
            .query({
                query: 'Nearby gym',
            })

        expect(response.status).toBe(401);
        expect(response.body).toEqual({
            message: 'Unauthorized',
        })
    })
});