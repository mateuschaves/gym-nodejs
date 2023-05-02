import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";
import { FetchUsersCheckInHistoryUseCase } from "../fetch-user-check-ins-history";

export function makeFetchUserCheckInsHistoryUseCase() {
    const prismaCheckInRepository = new PrismaCheckInsRepository()
    const useCase = new FetchUsersCheckInHistoryUseCase(prismaCheckInRepository)
    return useCase;
}