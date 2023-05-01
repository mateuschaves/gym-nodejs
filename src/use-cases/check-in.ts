import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface CheckInRequest {
    userId: string
    gymId: string
}

interface CheckInResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(private checkInsRepository: CheckInsRepository) { }

    async execute({ userId, gymId }: CheckInRequest): Promise<CheckInResponse> {
        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(userId, new Date())

        if (checkInOnSameDate) {
            throw new Error("You already checked in today")
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId
        })

        return {
            checkIn
        }
    }
}