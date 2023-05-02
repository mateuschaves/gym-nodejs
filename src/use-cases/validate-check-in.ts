import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";
import { AlreadyCheckedInToday } from "./erros/already-checked-in-today";
import { ResourceNotFoundError } from "./erros/resource-not-found-error";
import { getDistanceBetweenCoordinatesInKm } from "../utils/get-distance-between-coordinates";
import { MaxDistanceError } from "./erros/max-distance-error";
import dayjs from "dayjs";
import { LateCheckInValidationError } from "./erros/late-check-in-validation-error";

interface ValidateCheckInRequest {
    checkInId: string;
}

interface ValidateCheckInResponse {
    checkIn: CheckIn;
}

export class ValidateCheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
    ) { }

    async execute({
        checkInId
    }: ValidateCheckInRequest): Promise<ValidateCheckInResponse> {
        const checkIn = await this.checkInsRepository.findById(
            checkInId,
        );

        if (!checkIn) {
            throw new ResourceNotFoundError();
        }

        const distanceInMinutesFromCheckInCreation = dayjs(new Date()).diff(checkIn.created_at, 'minute');

        if (distanceInMinutesFromCheckInCreation > 20) {
            throw new LateCheckInValidationError();
        }

        checkIn.validated_at = new Date();

        await this.checkInsRepository.save(checkIn);

        return {
            checkIn,
        };
    }
}
