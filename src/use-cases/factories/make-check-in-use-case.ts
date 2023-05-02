import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { CheckInUseCase } from "../check-in";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

export function makeCheckInUseCase() {
    const prismaCheckInRepository = new PrismaCheckInsRepository()
    const prismaGymsRepository = new PrismaGymsRepository()
    const useCase = new CheckInUseCase(prismaCheckInRepository, prismaGymsRepository)
    return useCase;
}