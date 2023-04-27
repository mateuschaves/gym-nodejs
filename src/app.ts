import fastify from 'fastify'
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient()

prisma.user.create({
  data: {
    name: 'Alice',
    email: 'mateus@gmail.com',
  },
})

export const app = fastify()
