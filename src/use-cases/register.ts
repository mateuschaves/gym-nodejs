import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { PrismaUsersRepository } from "../repositories/prisma-users-repository";
import { UsersRepository } from "@/repositories/users-repository";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase<T> {
    constructor(
        private usersRepository: UsersRepository = new PrismaUsersRepository()
    ) { }

    async execute({ name, email, password }: RegisterUseCaseRequest) {
        const password_hash = await hash(password, 6);

        const userWithSameEmail = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (userWithSameEmail) {
            throw new Error("Email already exists");
        }

        await this.usersRepository.create({
            name,
            email,
            password_hash,
        });
    }
}
