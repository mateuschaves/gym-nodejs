import { it, describe, expect, beforeAll, afterAll } from "vitest";
import request from 'supertest';
import { app } from "@/app";

describe('Profile (e2e)', () => {
    beforeAll(async () => {
        await app.ready();
    })

    afterAll(async () => {
        await app.close();
    })

    it('should be able to get user profile ', async () => {
        await request(app.server)
            .post('/users')
            .send({
                name: 'John Doe',
                email: 'jhondoe@example.com',
                password: '123456'
            })

        const authResponse = await request(app.server)
            .post('/sessions')
            .send({
                email: 'jhondoe@example.com',
                password: '123456'
            })

        const { token } = authResponse.body;

        const profileResponse = await request(app.server)
            .get('/me')
            .set('Authorization', `Bearer ${token}`)
            .send();

        console.log(profileResponse.body)

        expect(profileResponse.status).toBe(200);
        expect(profileResponse.body.user).toEqual(
            expect.objectContaining({
                email: 'jhondoe@example.com',
                name: 'John Doe',
                id: expect.any(String),
            })
        )
    });

})