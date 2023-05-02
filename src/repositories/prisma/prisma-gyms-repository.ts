import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client'
import { GymsRepository } from "../gyms-repository";

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
}