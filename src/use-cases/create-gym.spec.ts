import { describe, expect, it, beforeEach } from "vitest";

import InMemoryGymsRepository from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let gymsRepository: InMemoryGymsRepository;
let sut: CreateGymUseCase;

describe("Gyms use case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new CreateGymUseCase(gymsRepository);
    });
    it("should ble able to create gym", async () => {
        const gymToCreate = {
            title: "Academia",
            description: "Academia de musculação",
            phone: "123456789",
            latitude: -8.123456,
            longitude: 34.123456,
        };

        const { gym } = await sut.execute(gymToCreate);

        expect(gym).toMatchObject({
            id: expect.any(String),
            title: gymToCreate.title,
            description: gymToCreate.description,
            phone: gymToCreate.phone,
        });
    });
});
