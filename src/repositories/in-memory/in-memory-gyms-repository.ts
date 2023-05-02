import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { Decimal } from "@prisma/client/runtime";
import { GymsRepository } from "../gyms-repository";

export default class InMemoryGymsRepository implements GymsRepository {
    public items: Gym[] = [];

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym: Gym = {
            id: data.id ?? randomUUID(),
            title: data.title,
            description: data.description ?? null,
            phone: data.phone ?? null,
            latitude: new Decimal(data.latitude.toString()),
            longitude: new Decimal(data.longitude.toString()),
            created_at: new Date(),
            updated_at: new Date(),
        };

        this.items.push(gym);

        return gym;
    }

    async findById(id: string): Promise<Gym | null> {
        const gym = this.items.find((gym) => gym.id === id);

        if (!gym) {
            return null;
        }

        return gym;
    }
}
