import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ValidateCheckInUseCase } from './validate-check-in';
import InMemoryCheckInsRepository from '@/repositories/in-memory/in-memory-check-ins-repository';
import dayjs from 'dayjs';
import { ResourceNotFoundError } from './erros/resource-not-found-error';
import { LateCheckInValidationError } from './erros/late-check-in-validation-error';

let checkInsRepository: InMemoryCheckInsRepository
let sut: ValidateCheckInUseCase;
describe('Validate check-in use case', () => {
    beforeEach(() => {
        checkInsRepository = new InMemoryCheckInsRepository();
        sut = new ValidateCheckInUseCase(checkInsRepository);

        vi.useFakeTimers();
    })

    it('should be able to validate a check-in', async () => {
        const mockDate = new Date(2023, 0, 20, 8, 0, 0);
        vi.setSystemTime(mockDate);

        const { id } = await checkInsRepository.create({
            gym_id: 'any_gym_id',
            user_id: 'any_user_id',
        });

        const { checkIn } = await sut.execute({
            checkInId: id,
        });

        expect(checkIn).toMatchObject({
            id: expect.any(String),
            gym_id: 'any_gym_id',
            user_id: 'any_user_id',
        })
        expect(dayjs(checkIn.validated_at).isSame(mockDate)).toBe(true);
    })

    it('should not be able to validate a check-in that does not exist', async () => {
        await expect(sut.execute({
            checkInId: 'non-existing-check-in-id',
        })).rejects.toBeInstanceOf(ResourceNotFoundError);
    })

    it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
        vi.setSystemTime(new Date(2023, 0, 20, 8, 0, 0));

        const { id } = await checkInsRepository.create({
            gym_id: 'any_gym_id',
            user_id: 'any_user_id',
        });

        const TWENTY_ONE_MINUTES_IN_MS = 1000 * 60 * 21;

        vi.advanceTimersByTime(TWENTY_ONE_MINUTES_IN_MS);

        await expect(sut.execute({
            checkInId: id,
        })).rejects.toBeInstanceOf(LateCheckInValidationError);
    })
});