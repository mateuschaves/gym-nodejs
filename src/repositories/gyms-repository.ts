import { Gym } from "@prisma/client";

export interface GymsRepository {
    create(data: Gym): Promise<Gym>;
    findById(id: string): Promise<Gym | null>;
}