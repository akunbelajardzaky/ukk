"use client";

import { loginWithCredentials, login } from "@/lib/actions/auth";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

export default function SignInForm() {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await loginWithCredentials(email, password);

    if (result?.error) {
      alert(result.error);
    } else {
      router.push("/"); // Redirect to the home page after successful login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-purple-200">
        <h1 className="text-3xl font-bold text-purple-700 text-center mb-4">Naturescape</h1>
        <h2 className="text-xl font-semibold text-center mb-6 text-purple-600">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
              Sign In
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-purple-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/auth/register")}
                className="text-purple-700 hover:text-purple-800 font-semibold focus:outline-none"
              >
                Register here
              </button>
            </p>
          </div>
        </form>

        {/* Divider */}
        <div className="my-4 relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-purple-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-purple-500">Or continue with</span>
          </div>
        </div>

        {/* Tombol Google */}
        <button
          onClick={async () => {
            await login(); // Google OAuth login
          }}
          className="w-full flex items-center justify-center px-4 py-2 border border-purple-300 rounded-md shadow-sm text-sm font-medium text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
        >
          <FcGoogle className="w-5 h-5 mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}