import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymUseCase } from "../search-gym";

export function makeSearchGymUseCase() {
    const prismaGymsRepository = new PrismaGymsRepository()
    const useCase = new SearchGymUseCase(prismaGymsRepository)
    return useCase;
}