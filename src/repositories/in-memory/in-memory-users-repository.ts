import { Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";

export default class InMemoryUsersRepository implements UsersRepository {
    public items: User[] = []

    async findByEmail(email: string): Promise<User | null> {
        const user = this.items.find(user => user.email === email)

        return user || null
    }

    async create(data: Prisma.UserCreateInput): Promise<User> {
        const user: User = {
            id: 'any_id',
            name: data.name,
            email: data.email,
            password_hash: data.password_hash,
            created_at: new Date(),
            updated_at: new Date()
        }


        this.items.push(user)

        return user
    }

    async findById(id: string): Promise<User | null> {
        const user = this.items.find(user => user.id === id)

        return user || null
    }
}
