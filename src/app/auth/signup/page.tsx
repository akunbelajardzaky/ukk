"use client";

import React, { useState } from "react"; // Import useState
import { motion } from "framer-motion";
import { register } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ChevronRight } from "lucide-react";
import { toast } from "sonner"; // Import toast dari Sonner

export default function RegisterForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false); // State untuk loading

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true); // Set loading ke true saat form di-submit

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    try {
      const result = await register(email, password, name);

      if (result?.error) {
        toast.error(result.error); // Ganti alert dengan toast.error
      } else {
        toast.success("Registration successful! Please log in."); // Tampilkan toast sukses
        router.push("/auth/signin"); // Redirect ke halaman sign-in
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration"); // Tampilkan toast error
    } finally {
      setIsLoading(false); // Set loading ke false setelah proses selesai
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-gray-900 dark:to-indigo-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg w-full max-w-md border border-gray-200 dark:border-gray-700"
      >
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                id="name"
                placeholder="John Doe"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="john.doe@example.com"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isLoading} // Nonaktifkan tombol saat loading
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center justify-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Loading..." : "Register"} {/* Tampilkan teks berbeda saat loading */}
              {!isLoading && <ChevronRight className="ml-2" size={18} />}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}