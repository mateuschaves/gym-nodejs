import { describe, expect, it, beforeEach } from "vitest";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";

let getUserProfileUseCase: GetUserProfileUseCase;
let usersRepository: InMemoryUsersRepository

describe("Get user profile use case", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        getUserProfileUseCase = new GetUserProfileUseCase(usersRepository);
    });
    it("should be able to get user profile", async () => {
        const createdUser = await usersRepository.create({
            name: "Mateus",
            email: "mateus@gmail.com",
            password_hash: await hash("123456", 6)
        })

        const { user } = await getUserProfileUseCase.execute({ id: createdUser.id });
        expect(user).toBeDefined();
        expect(user).toMatchObject({
            id: createdUser.id,
            name: "Mateus",
            email: "mateus@gmail.com"
        })
    });

    it("should not be able to get user profile with invalid id", async () => {
        await expect(getUserProfileUseCase.execute({ id: "invalid_id" })).rejects.toBeInstanceOf(ResourceNotFoundError);
    })
});
