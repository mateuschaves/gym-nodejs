import { GymsRepository } from "@/repositories/gyms-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { Gym } from "@prisma/client";

interface SearchGymUseCaseRequest {
    query: string | null
    page?: number
}

interface SearchGymUseCaseResponse {
    gyms: Gym[]
}

export class SearchGymUseCase {
    constructor(
        private gymRepository: GymsRepository = new PrismaGymsRepository()
    ) { }

    async execute({ query, page }: SearchGymUseCaseRequest): Promise<SearchGymUseCaseResponse> {
        const gyms = await this.gymRepository.searchByTitle(query, page)

        return { gyms }
    }
}
