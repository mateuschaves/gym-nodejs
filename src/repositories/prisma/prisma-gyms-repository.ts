import { prisma } from "@/lib/prisma";
import { Gym, Prisma } from '@prisma/client'
import { FindManyNearbyParams, GymsRepository } from "../gyms-repository";

export class PrismaGymsRepository implements GymsRepository {
    async create(data: Prisma.GymCreateInput) {
        return prisma.gym.create({
            data,
        })
    }

    async findById(id: string) {
        return prisma.gym.findUnique({
            where: {
                id,
            },
        })
    }

    async searchByTitle(title: string, page: number): Promise<Gym[]> {
        return prisma.gym.findMany({
            where: {
                title: {
                    contains: title,
                    mode: 'insensitive',
                },
            },
        })
    }

    async findManyNearby({ latitude, longitude }: FindManyNearbyParams): Promise<Gym[]> {
        return prisma.gym.findMany({
            where: {
                latitude: {
                    gte: latitude - 0.1,
                    lte: latitude + 0.1,
                },
                longitude: {
                    gte: longitude - 0.1,
                    lte: longitude + 0.1,
                },
            },
        })
    }
}