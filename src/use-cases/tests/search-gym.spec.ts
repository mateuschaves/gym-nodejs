import { describe, expect, it, beforeEach } from "vitest";
import InMemoryGymsRepository from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymUseCase } from "../search-gym";

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase;

describe("Search gym by title use case", () => {
    beforeEach(() => {
        gymsRepository = new InMemoryGymsRepository();
        sut = new SearchGymUseCase(gymsRepository);
    });
    it("should be able to filter gyms by case insensitve", async () => {
        await gymsRepository.create({
            title: "Selfit",
            description: "Selfit",
            latitude: 0,
            longitude: 0,
        })

        await gymsRepository.create({
            title: "Smart Fit",
            description: "Smart Fit",
            latitude: 0,
            longitude: 0,
        })

        const { gyms } = await sut.execute({ query: "self", page: 1 });
        expect(gyms).toHaveLength(1);
    });

    it("should be able to filter gyms by case sensitive", async () => {
        await gymsRepository.create({
            title: "Selfit",
            description: "Selfit",
            latitude: 0,
            longitude: 0,
        })

        await gymsRepository.create({
            title: "Smart Fit",
            description: "Smart Fit",
            latitude: 0,
            longitude: 0,
        })

        const { gyms } = await sut.execute({ query: "Self", page: 1 });
        expect(gyms).toHaveLength(1);
    })

    it("should be able to search with multiple pages", async () => {
        for (let i = 1; i <= 22; i++) {
            await gymsRepository.create({
                title: `Selfit-${i}`,
                description: "Selfit",
                latitude: 0,
                longitude: 0,
            })
        }

        const { gyms } = await sut.execute({ query: "selfit", page: 2 });
        expect(gyms).toHaveLength(2);
    })
});
