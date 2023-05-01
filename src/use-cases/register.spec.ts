import { describe, expect, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import InMemoryUsersRepository from "@/repositories/in-memory/in-memory-users-repository";

import { compare } from "bcryptjs";
import { UserAlreadyExists } from "./erros/user-already-exists-error";

let registerUseCase: RegisterUseCase;

describe("Register use case", () => {
  beforeEach(() => {
    registerUseCase = new RegisterUseCase(new InMemoryUsersRepository());
  });
  it("should hash user password upon registration", async () => {
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
    const userToCreate = {
      name: "John Doe",
      email: "johndoe@gmail.com",
      password: "123456",
    };

    const { user } = await registerUseCase.execute(userToCreate);

    expect(user).toMatchObject({
      name: userToCreate.name,
      email: userToCreate.email,
      password_hash: expect.any(String),
    });
  });
});
