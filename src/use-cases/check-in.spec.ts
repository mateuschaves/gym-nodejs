import { beforeEach, describe, expect, it, vi, afterEach } from "vitest";

import InMemoryCheckInsRepository from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { Decimal } from "@prisma/client/runtime/library";
import InMemoryGymsRepository from "@/repositories/in-memory/in-memory-gyms-repository";
import { MaxDistanceError } from "./erros/max-distance-error";

let inMemoryCheckInsRepository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;

describe("Check In use case", () => {
    beforeEach(async () => {
        inMemoryCheckInsRepository = new InMemoryCheckInsRepository();
        gymsRepository = new InMemoryGymsRepository();
        sut = new CheckInUseCase(
            inMemoryCheckInsRepository,
            gymsRepository
        );

        await gymsRepository.create({
            id: "gym-id",
            title: "Gym",
            description: "Gym description",
            latitude: new Decimal(-8.277631),
            longitude: new Decimal(-35.969342),
            phone: "123456789",
        })

        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("should be able to check in", async () => {


        const { checkIn } = await sut.execute({
            userId: "user-id",
            gymId: "gym-id",
            userLatitude: -8.277631,
            userLongitude: -35.969342,
        });

        expect(checkIn).toMatchObject({
            id: expect.any(String),
        });
    });

    it("should no be able to check in twice in the same day", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: "user-id",
            gymId: "gym-id",
            userLatitude: -8.277631,
            userLongitude: -35.969342,
        });

        await expect(
            sut.execute({
                userId: "user-id",
                gymId: "gym-id",
                userLatitude: -8.277631,
                userLongitude: -35.969342,
            })
        ).rejects.toBeInstanceOf(Error);
    });

    it("should be able to check in again after 24 hours", async () => {
        vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0));

        await sut.execute({
            userId: "user-id", gymId: "gym-id", userLatitude: -8.277631,
            userLongitude: -35.969342,
        });

        vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0));

        const { checkIn } = await sut.execute({
            userId: "user-id",
            gymId: "gym-id",
            userLatitude: -8.277631,
            userLongitude: -35.969342,
        });

        expect(checkIn).toMatchObject({
            id: expect.any(String),
        });
    });

    it("should be able to check in on a near gym", async () => {
        await gymsRepository.create({
            id: "near-gym-id",
            title: "Near Gym",
            description: "Near Gym description",
            latitude: new Decimal(-8.2773337),
            longitude: new Decimal(-35.9697068),
            phone: "123456789",
        })

        const { checkIn } = await sut.execute({
            userId: "user-id",
            gymId: "near-gym-id",
            userLatitude: -8.277631,
            userLongitude: -35.969342,
        })

        expect(checkIn).toMatchObject({
            id: expect.any(String),
        })
    })
    it("should not be able to check in on a distant gym", async () => {
        await gymsRepository.create({
            id: "distant-gym-id",
            title: "Distant Gym",
            description: "Distant Gym description",
            latitude: new Decimal(-8.2698137),
            longitude: new Decimal(-36.0017393),
            phone: "123456789",
        })

        expect(sut.execute({
            userId: "user-id",
            gymId: "distant-gym-id",
            userLatitude: -8.277631,
            userLongitude: -35.969342,
        })).rejects.toBeInstanceOf(MaxDistanceError)
    })
});
