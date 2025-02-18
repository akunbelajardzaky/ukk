"use server"

import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client'
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

const prisma = new PrismaClient()

export async function getAllTasks(date: Date, view: any, searchQuery: string) {
  const user = await auth();
  
  let startDate, endDate;

  if (view === "day") {
    startDate = new Date(date.setHours(0, 0, 0, 0));
    endDate = new Date(date.setHours(23, 59, 59, 999));
  } else if (view === "week") {
    startDate = startOfWeek(date);
    endDate = endOfWeek(date);
  } else if (view === "month") {
    startDate = startOfMonth(date);
    endDate = endOfMonth(date);
  } else if (view === "year") {
    startDate = startOfYear(date);
    endDate = endOfYear(date);
  }

  return await prisma.task.findMany({
    where: {
      user_id: user?.user?.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
       OR: [
        { text: { contains: searchQuery } },
      ],
    }
  });
}