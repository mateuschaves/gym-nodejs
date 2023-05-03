import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetUserMetricsUseCase } from '../get-user-metrics';

let checkInsRepository: InMemoryCheckInsRepository
let sut: GetUserMetricsUseCase

describe('Get user metrics use case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new GetUserMetricsUseCase(checkInsRepository);
    })

    it('should be able to get check-ins count from metrics', async () => {
        const userId = 'valid_user_id'

        await checkInsRepository.create({
            gym_id: 'valid_gym_id',
            user_id: userId
        })

        await checkInsRepository.create({
            gym_id: 'valid_gym_id',
            user_id: userId
        })

        const { checkInsCount } = await sut.execute({ userId });

        expect(checkInsCount).toBe(2);
    })
})