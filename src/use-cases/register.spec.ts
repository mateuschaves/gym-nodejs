import { describe, expect, it } from "vitest";
import { RegisterUseCase } from "./register";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";

import { compare } from "bcryptjs";
import { UserAlreadyExists } from "./erros/user-already-exists-error";

describe("Register use case", () => {
  it("should hash user password upon registration", async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    const { user } = await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    const isPasswordCorrectlyHashed = await compare(
      "123456",
      user.password_hash
    );
    expect(isPasswordCorrectlyHashed).toBe(true);
  });

  it("should not allow two users with the same email", async () => {
    const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

    await registerUseCase.execute({
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    });

    expect(() =>
      registerUseCase.execute({
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(UserAlreadyExists);
  });

    it("should be able to create a user", async () => {
        const registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());

        const userToCreate = {
            name: "John Doe",
            email: "johndoe@gmail.com",
            password: "123456",
        }

        const { user } = await registerUseCase.execute(userToCreate);

        expect(user).toMatchObject({
            name: userToCreate.name,
            email: userToCreate.email,
            password_hash: expect.any(String),
        })
    })
});
