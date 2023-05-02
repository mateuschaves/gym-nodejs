import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";
import { UserAlreadyExists } from "./erros/user-already-exists-error";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(
        private usersRepository: UsersRepository = new PrismaUsersRepository()
    ) { }

    async execute({ name, email, password }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail) {
            throw new UserAlreadyExists();
        }

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash,
        });

        return {
            user
        }
    }
}
