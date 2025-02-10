// app/actions.ts
"use server";

import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient()

export async function updateUser({ name, email }: { name: string; email: string }) {
  const session = await auth(); // Ambil session dari server
  if (!session?.user?.email) {
    throw new Error("User not authenticated");
  }

  // Update user data di database
  await prisma.user.update({
    where: { email: session.user.email },
    data: { name, email },
  });
}