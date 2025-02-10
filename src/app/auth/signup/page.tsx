"use client";

import { register } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    const result = await register(email, password, name);

    if (result?.error) {
      alert(result.error);
    } else {
      alert("Registration successful! Please log in.");
      router.push("/auth/signin"); // Redirect to the sign-in page
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-600 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="John Doe"
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-purple-400"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-purple-600 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="john.doe@example.com"
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-purple-400"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-purple-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-purple-400"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
            >
              Register
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600">
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/signin")}
                className="text-purple-700 hover:text-purple-800 font-semibold focus:outline-none"
              >
                Sign In
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}