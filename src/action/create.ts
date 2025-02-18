"use server";

// actions.ts
import { PrismaClient } from "@prisma/client";
import { getuser } from "@/query/auth";
import { taskSchema } from "./schema";
import { revalidatePath } from "next/cache";
// taskSchema.ts

const prisma = new PrismaClient();
export async function createTask(formData: FormData) {
  const parsedData = Object.fromEntries(formData.entries());

  // Validate the data using Zod
  const result = taskSchema.safeParse(parsedData);
  const user = await getuser();

  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }

  // Here you can handle the task creation logic, e.g., saving to a database
  const task = result.data;

  // Check if a task with the same name and date already exists
  const existingTask = await prisma.task.findFirst({
    where: {
      text: task.title,
      date: new Date(task.dueDate!),
      user_id: user?.user?.id,
    },
  });

  if (existingTask) {
    throw new Error("A task with the same name already exists on the same date.");
  }

  // If no existing task, create a new one
  const newTask = await prisma.task.create({
    data: {
      text: task.title,
      description: task.description,
      date: new Date(task.dueDate!),
      priority: task.priority,
      user_id: user?.user?.id as any,
      status: "NOT_STARTED",
    },
  });

  console.log("Task created:", newTask);
  revalidatePath("/", "page");
  return task;
}


// actions.ts
export async function updateTaskStatus(taskId: number, status: any) {
  const user = await getuser();

  if (!user) {
    throw new Error("User not found");
  }

  await prisma.task.update({
    where: { id: taskId },
    data: { status },
  });

  revalidatePath("/", "page");
}


// actions.ts
export async function updateTask(taskId: number, formData: FormData) {
  const parsedData = Object.fromEntries(formData.entries());
  const result = taskSchema.safeParse(parsedData);

  if (!result.success) {
    throw new Error(result.error.errors.map((e) => e.message).join(", "));
  }

  const task = result.data;

  // Ambil task yang sedang diupdate untuk mendapatkan user_id
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    throw new Error("Task not found.");
  }

  // Cek apakah ada task lain dengan nama yang sama pada tanggal yang sama
  const duplicateTask = await prisma.task.findFirst({
    where: {
      text: task.title,
      date: new Date(task.dueDate!),
      user_id: existingTask.user_id, // Pastikan hanya memeriksa task milik user yang sama
      NOT: {
        id: taskId, // Abaikan task yang sedang diupdate
      },
    },
  });

  if (duplicateTask) {
    throw new Error("A task with the same name already exists on the same date.");
  }

  // Jika tidak ada duplikat, lakukan update
  await prisma.task.update({
    where: { id: taskId },
    data: {
      text: task.title,
      description: task.description,
      date: new Date(task.dueDate!),
      priority: task.priority,
    },
  });

  revalidatePath("/", "page");
}

export async function deleteTask(taskId: number) {
  await prisma.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/", "page");
}