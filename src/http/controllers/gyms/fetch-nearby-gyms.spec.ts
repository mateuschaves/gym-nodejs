import { app } from '@/app';
import { createAndAuthenticateUser } from '@/utils/test/create-and-authenticate-user';
import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
describe('Fetch nearby gyms (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to fetch nearby gyms', async () => {
        const { token } = await createAndAuthenticateUser(app)

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Nearby gym",
                description: "Nearby gym",
                latitude: -8.306933,
                longitude: -35.958334,
            })

        await request(app.server)
            .post('/gyms')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Far away gym",
                description: "Far away gym",
                latitude: -8.449174,
                longitude: -35.982632
            })

        const response = await request(app.server)
            .get('/gyms/nearby')
            .set('Authorization', `Bearer ${token}`)
            .query({
                userLatitude: -8.2773493,
                userLongitude: -35.9695217
            })

        expect(response.status).toBe(200);
        expect(response.body.gyms).toEqual([
            expect.objectContaining({
                title: 'Nearby gym',
                description: 'Nearby gym',
            })
        ])
    });
});