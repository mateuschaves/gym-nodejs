import { GymsRepository } from "@/repositories/gyms-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { Gym } from "@prisma/client";

interface FetchNearbyGymsUseCaseRequest {
    userLatitude: number
    userLongitude: number
}

interface FetchNearbyGymsUseCaseResponse {
    gyms: Gym[]
}

export class FetchNearbyGymsUseCase {
    constructor(
        private gymRepository: GymsRepository = new PrismaGymsRepository()
    ) { }

    async execute({ userLatitude, userLongitude }: FetchNearbyGymsUseCaseRequest): Promise<FetchNearbyGymsUseCaseResponse> {
        const gyms = await this.gymRepository.findManyNearby({
            latitude: userLatitude,
            longitude: userLongitude,
        })

        return { gyms }
    }
}
