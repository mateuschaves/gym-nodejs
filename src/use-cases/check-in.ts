import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { GymsRepository } from "@/repositories/gyms-repository";
import { AlreadyCheckedInToday } from "./erros/already-checked-in-today";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { getDistanceBetweenCoordinatesInKm } from "../utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./erros/max-distance-error";

interface CheckInRequest {
    userId: string;
    gymId: string;
    userLatitude: number;
    userLongitude: number;
}

interface CheckInResponse {
    checkIn: CheckIn;
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) { }

    async execute({
        userId,
        gymId,
        userLatitude,
        userLongitude,
    }: CheckInRequest): Promise<CheckInResponse> {
        const checkInOnSameDate = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date()
        );

        const gym = await this.gymsRepository.findById(gymId);

        if (!gym) {
            throw new ResourceNotFoundError();
        }

        const distance = getDistanceBetweenCoordinatesInKm(
            {
                latitude: gym.latitude.toNumber(),
                longitude: gym.longitude.toNumber(),
            },
            { latitude: userLatitude, longitude: userLongitude }
        );

        const MAX_DISTANCE_IN_KM = 0.1;

        if (distance > MAX_DISTANCE_IN_KM) {
            throw new MaxDistanceError();
        }

        if (checkInOnSameDate) {
            throw new AlreadyCheckedInToday();
        }

        const checkIn = await this.checkInsRepository.create({
            gym_id: gymId,
            user_id: userId,
        });

        return {
            checkIn,
        };
    }
}
