import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUsersCheckInHistoryRequest {
    userId: string;
    page?: number
}

interface FetchUsersCheckInHistoryResponse {
    checkIns: CheckIn[];
}

export class FetchUsersCheckInHistoryUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) { }

    async execute({
        userId,
        page,
    }: FetchUsersCheckInHistoryRequest): Promise<FetchUsersCheckInHistoryResponse> {
        const checkIns = await this.checkInsRepository.findManyByUserId(userId, page);

        return {
            checkIns,
        };
    }
}
