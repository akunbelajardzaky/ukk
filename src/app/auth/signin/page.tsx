"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { loginWithCredentials, login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { toast } from "sonner"; // Import toast dari Sonner

export default function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await loginWithCredentials(email, password);

      if (result?.error) {
        toast.error(result.error); // Ganti alert dengan toast.error
      } else {
        toast.success("Login successful!"); // Tampilkan toast sukses
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An error occurred during login"); // Ganti alert dengan toast.error
    } finally {
      setIsLoading(false);
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
        <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 text-center mb-2">Quickly</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-gray-700 dark:text-gray-300">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              disabled={isLoading}
              className={`w-full bg-indigo-600 text-white py-2 px-4 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center justify-center ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Loading..." : "Sign In"}
              {!isLoading && <ChevronRight className="ml-2" size={18} />}
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/signup")}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold focus:outline-none"
              >
                Register here
              </button>
            </p>
          </div>
        </form>

        {/* Divider */}
        <div className="my-6 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
          </div>
        </div>

        {/* Google Button */}
        <button
          onClick={async () => {
            setIsLoading(true);
            try {
              await login();
              toast.success("Google login successful!"); // Tampilkan toast sukses
            } catch (error) {
              toast.error("Google login failed"); // Tampilkan toast error
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className={`w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-600 transition-all ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
      </motion.div>
    </div>
  );
}