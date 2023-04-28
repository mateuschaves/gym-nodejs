import { prisma } from "@/lib/prisma";
import { Prisma } from '@prisma/client'

export class PrismaUsersRepository {
    async create(data: Prisma.UserCreateInput) {
        return prisma.user.create({
            data,
          })
    }
}