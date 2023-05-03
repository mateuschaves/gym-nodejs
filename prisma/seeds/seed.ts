import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
    await prisma.user.upsert({
        update: {},
        where: { email: 'admin@example.com' },
        create: {
            email: 'admin@example.com',
            name: 'Admin',
            role: 'ADMIN',
            password_hash: '$2a$06$4BUXJVVSmW5.Hspsg0qdJehnGj8sXjtypqpatJlL8s2P9fSvSuxgC', // 123456 using secret 'gym'
        },
    })
}
main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })