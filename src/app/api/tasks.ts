import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { date } = req.query;
    try {
      const tasks = await prisma.task.findMany({
        where: {
          date: new Date(date as string),
        },
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  } else if (req.method === 'POST') {
    const { text, description, priority, status, date } = req.body;

    try {
      const newTask = await prisma.task.create({
        data: {
          text,
          description,
          priority,
          status,
          date: new Date(date),
        },
      });
      res.status(200).json(newTask);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create task' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}