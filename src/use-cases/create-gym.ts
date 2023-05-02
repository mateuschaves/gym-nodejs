import { GymsRepository } from "@/repositories/gyms-repository";
import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";

interface CreateGymUseCaseRequest {
    title: string
    description: string | null
    phone: string | null
    latitude: number
    longitude: number
}

export class CreateGymUseCase {
    constructor(
        private gymRepository: GymsRepository = new PrismaGymsRepository()
    ) { }

    async execute({ title, description, phone, latitude, longitude }: CreateGymUseCaseRequest) {
        const gym = await this.gymRepository.create({
            title,
            description,
            phone,
            latitude,
            longitude,
        })

        return { gym }
    }
}
