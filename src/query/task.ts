"use server"

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function getAllTasks() {
  return await prisma.task.findMany()
}