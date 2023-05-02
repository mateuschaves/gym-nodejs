import { prisma } from "@/lib/prisma";
import { Gym, Prisma } from "@prisma/client";
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymCreateInput) {
        return prisma.gym.create({
            data,
        });
    }

    async findById(id: string) {
        return prisma.gym.findUnique({
            where: {
                id,
            },
        });
    }

    async searchByTitle(title: string, page: number): Promise<Gym[]> {
        return prisma.gym.findMany({
            where: {
                title: {
                    contains: title,
                    mode: "insensitive",
                },
            },
            take: 20,
            skip: page ? (page - 1) * 20 : 0,
        });
    }

    async findManyNearby({
        latitude,
        longitude,
    }: FindManyNearbyParams): Promise<Gym[]> {
        const gyms = await prisma.$queryRaw<Gym[]>`
            SELECT * from gyms
            WHERE ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin( radians( latitude ) ) ) ) <= 10
        `;

        return gyms;
    }
}
