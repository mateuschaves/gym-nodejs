import { Prisma, CheckIn } from '@prisma/client';
import { CheckInsRepository } from '../check-ins-repository';
import { prisma } from '@/lib/prisma';
import dayjs from 'dayjs';

export class PrismaCheckInsRepository implements CheckInsRepository {
    async create(data: Prisma.CheckInUncheckedCreateInput) {
        const checkIn = await prisma.checkIn.create({
            data,
        });
        return checkIn;
    }
    async findByUserIdOnDate(userId: string, date: Date) {
        const startOfTheDay = dayjs(date).startOf('date').toDate()
        const endOfTheDay = dayjs(date).endOf('date').toDate()

        const checkIn = await prisma.checkIn.findFirst({
            where: {
                user_id: userId,
                created_at: {
                    gte: startOfTheDay,
                    lt: endOfTheDay
                },
            },
        });
        return checkIn;
    }
    async findManyByUserId(userId: string, page?: number | undefined) {
        return prisma.checkIn.findMany({
            where: {
                user_id: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
            take: 20,
            skip: page ? (page - 1) * 20 : 0,
        })
    }
    async countByUserId(userId: string) {
        return prisma.checkIn.count({
            where: {
                user_id: userId,
            },
        });
    }
    async findById(id: string) {
        const checkIn = await prisma.checkIn.findUnique({
            where: {
                id,
            },
        });
        return checkIn;
    }
    async save(checkIn: CheckIn) {
        const savedCheckIn = await prisma.checkIn.update({
            where: {
                id: checkIn.id,
            },
            data: {
                ...checkIn,
            },
        });
        return savedCheckIn;
    }

}