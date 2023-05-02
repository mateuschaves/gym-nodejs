import { Gym, Prisma } from "@prisma/client";
import { randomUUID } from "node:crypto";

import { Decimal } from "@prisma/client/runtime";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";
import { getDistanceBetweenCoordinatesInKm } from '../../utils/get-distance-between-coordinates';

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

    async searchByTitle(query: string, page: number): Promise<Gym[]> {
        const gyms = this.items.filter((gym) => gym.title.toLowerCase().includes(query.toLowerCase()));

        if (page) {
            const pageSize = 20;
            const offset = (page - 1) * pageSize;

            return gyms.slice(offset, page * pageSize);
        }

        return gyms;
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]> {
        return this.items.filter((gym) => {
            const distance = getDistanceBetweenCoordinatesInKm({ latitude, longitude }, { latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber() });
            return distance < 10;
        });
    }
}
