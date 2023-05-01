import { beforeEach, describe, expect, it } from "vitest";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";

import { InvalidCredentialsError } from "./erros/invalid-credentials-error";

import { hash } from "bcryptjs";
import { AuthenticateUseCase } from "./authenticate";

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase

describe("Authenticate use case", () => {

    beforeEach(() => {
        inMemoryUsersRepository = new InMemoryUsersRepository();
        sut = new AuthenticateUseCase(inMemoryUsersRepository);
    })
   
    it("should be able to authenticate", async () => {

        const userToCreate = {
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        }

        await inMemoryUsersRepository.create({
            name: userToCreate.name,
            email: userToCreate.email,
            password_hash: await hash(userToCreate.password, 6),
        })

        const { user } = await sut.execute({
            email: userToCreate.email,
            password: userToCreate.password,
        })

        expect(user).toMatchObject({
            id: expect.any(String),
            name: userToCreate.name,
            email: userToCreate.email,
        })
    });

    it("should not be able to authenticate with wrong email", async () => {
        expect(sut.execute({
            email: "johndoe@example.com",
            password: "123456",
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
    it("should not be able to authenticate with wrong password", async () => {
        const userToCreate = {
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
        }

        await inMemoryUsersRepository.create({
            name: userToCreate.name,
            email: userToCreate.email,
            password_hash: await hash(userToCreate.password, 6),
        })

        expect(sut.execute({
            email: "johndoe@example.com",
            password: "wrong-password",
        })).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
});
