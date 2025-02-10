"use server";

import { signIn, signOut } from "@/auth";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// Google OAuth login
export const login = async () => {
  await signIn("google", { redirectTo: "/" });
};

// Logout
export const logout = async () => {
  await signOut({ redirectTo: "/" });
};

// Email/password login
export const loginWithCredentials = async (email: string, password: string) => {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    return { error: result.error };
  }

  return { success: true };
};

// User registration
export const register = async (email: string, password: string, name: string) => {
  try {
    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "User already exists" };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    return { success: true, user };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "An error occurred during registration" };
  }
};