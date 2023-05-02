import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { FetchUsersCheckInHistoryUseCase } from './fetch-user-check-ins-history';

let checkInsRepository: InMemoryCheckInsRepository
let sut: FetchUsersCheckInHistoryUseCase

describe('Fetch User Check-in History Use Case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new FetchUsersCheckInHistoryUseCase(checkInsRepository);
    })

    it('should be able to fetch check-in history', async () => {
        const userId = 'user-01'

        await checkInsRepository.create({
            gym_id: 'gym-01',
            user_id: userId,
        })

        await checkInsRepository.create({
            gym_id: 'gym-02',
            user_id: userId,
        })


        const { checkIns } = await sut.execute({ userId })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining({
                        gym_id: 'gym-01',
                        user_id: userId,
                    }),
                    expect.objectContaining({
                        gym_id: 'gym-02',
                        user_id: userId,
                    }),
                ]
            )
        )
    });

    it('should be able to fetch paginated check-ins history', async () => {
        const userId = 'user-01'

        for (let i = 1; i <= 22; i++) {
            await checkInsRepository.create({
                gym_id: `gym-${i}`,
                user_id: userId,
            })
        }

        const { checkIns } = await sut.execute({ userId, page: 2 })

        expect(checkIns).toHaveLength(2)
        expect(checkIns).toEqual(
            expect.arrayContaining(
                [
                    expect.objectContaining({
                        gym_id: 'gym-21',
                        user_id: userId,
                    }),
                    expect.objectContaining({
                        gym_id: 'gym-22',
                        user_id: userId,
                    }),
                ]
            )
        )
    })
})