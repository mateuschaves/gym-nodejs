import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { CheckInsRepository } from "../check-ins-repository";

export default class InMemoryGymsRepository implements CheckInsRepository {
    public items: Gym[] = [];

    async create(data: Prisma.GymCreateInput): Promise<Gym> {
        const gym: Gym = {
            id: randomUUID(),
            title: data.title,
            description: data.description,
            latitude: data.latitude,
            longitude: data.longitude,
            phone: data.phone,
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
