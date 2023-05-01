import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { CheckInsRepository } from "../check-ins-repository";

export default class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const checkInOnSameDate = this.items.find(
            (checkIn) =>
                checkIn.user_id === userId &&
                checkIn.created_at.getDate() === date.getDate()
        );

        if (!checkInOnSameDate) {
            return null;
        }

        return checkInOnSameDate;
    }

    async create(data: Prisma.CheckInUncheckedCreateInput): Promise<CheckIn> {
        const checkIn = {
            id: randomUUID(),
            gym_id: data.gym_id,
            user_id: data.user_id,
            validated_at: data.validated_at ? new Date(data.validated_at) : null,
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(checkIn);

        return checkIn;
    }
}
