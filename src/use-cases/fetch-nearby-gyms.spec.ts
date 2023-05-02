import { describe, expect, it, beforeEach } from "vitest";
import InMemoryGymsRepository from "@/repositories/in-memory/in-memory-gyms-repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase;

describe("Fetch nearby gyms use case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new FetchNearbyGymsUseCase(gymsRepository);
    });
    it("shoud be able to fetch gyms with less than 10km distance", async () => {
        await gymsRepository.create({
            title: "Nearby gym",
            description: "Nearby gym",
            latitude: -8.306933,
            longitude: -35.958334,
        })

        await gymsRepository.create({
            title: "Far away gym",
            description: "Far away gym",
            latitude: -8.449174,
            longitude: -35.982632
        })

        const { gyms } = await sut.execute({ userLatitude: -8.2773493, userLongitude: -35.9695217 });
        expect(gyms).toHaveLength(1);
        expect(gyms).toEqual([
            expect.objectContaining({
                title: "Nearby gym",
            })
        ])
    });
});
