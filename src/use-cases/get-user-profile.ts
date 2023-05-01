import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";


interface GetUserProfileRequest {
    id: string;
}

interface GetUserProfileResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ id }: GetUserProfileRequest): Promise<GetUserProfileResponse> {
        const user = await this.usersRepository.findById(id)

        if (!user) {
            throw new ResourceNotFoundError()
        }

        return {
            user
        }
    }
}