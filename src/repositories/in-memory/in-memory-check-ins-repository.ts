import { CheckIn, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { CheckInsRepository } from "../check-ins-repository";
import dayjs from "dayjs";

export default class InMemoryCheckInsRepository implements CheckInsRepository {
    public items: CheckIn[] = [];

    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf("date");
        const endOfTheDay = dayjs(date).endOf("date");

        const checkInOnSameDate = this.items.find(
            (checkIn) => {
                const checkInDate = dayjs(checkIn.created_at);
                const isOnSameDate = checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endOfTheDay);

                return checkIn.user_id === userId && isOnSameDate;
            }
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

    async findManyByUserId(userId: string, page: number): Promise<CheckIn[]> {
        const items = this.items.filter((checkIn) => checkIn.user_id === userId)

        if (page) {
            const pageSize = 20;
            const offset = (page - 1) * pageSize;

            return items.slice(offset, page * pageSize);
        }

        return items
    }

    async countByUserId(userId: string): Promise<number> {
        return this.items.filter((checkIn) => checkIn.user_id === userId).length;
    }
}
