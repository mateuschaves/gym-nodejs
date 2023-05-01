import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

import InMemoryCheckInsRepository from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let sut: CheckInUseCase

describe("Check In use case", () => {
    beforeEach(() => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
        sut = new CheckInUseCase(inMemoryCheckInsRepository);

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should be able to check in", async () => {
        const { checkIn } = await sut.execute({ userId: "user-id", gymId: "gym-id" });

        expect(checkIn).toMatchObject({
            id: expect.any(String),
        })
    });

    it("should no be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({ userId: "user-id", gymId: "gym-id" });

        await expect(sut.execute({ userId: "user-id", gymId: "gym-id" })).rejects.toBeInstanceOf(Error);
    });

    it("should be able to check in again after 24 hours", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

        await sut.execute({ userId: "user-id", gymId: "gym-id" });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

        const { checkIn } = await sut.execute({ userId: "user-id", gymId: "gym-id" });

        expect(checkIn).toMatchObject({
            id: expect.any(String),
        })
    })
});
