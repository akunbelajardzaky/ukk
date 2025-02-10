"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FaSearch, FaUpload, FaUserCircle } from "react-icons/fa";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import Image from "next/image";

export  function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession(); // Ambil session dan status
  const [searchQuery, setSearchQuery] = useState("");

  // Debounce search function
  const debouncedSearch = debounce((query: string) => {
    if (query.trim()) {
      router.push(`/?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/"); // Jika query kosong, kembali ke halaman utama
    }
  }, 300); // 300ms delay

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Cleanup debounce on component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  // Handle upload button click
  const handleUpload = () => {
    if (!session) {
      router.push("/auth/signup"); // Redirect ke halaman sign up jika belum login
    } else {
      router.push("/upload"); // Redirect ke halaman upload jika sudah login
    }
  };

  return (
    <nav className="bg-green-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div
            className="flex-shrink-0 flex items-center cursor-pointer"
            onClick={() => router.push("/")}
          >
            <span className="text-xl font-bold text-green-100">Naturescape</span>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-4 pr-10 py-2 rounded-lg bg-green-600 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <div className="absolute right-0 top-0 h-full px-3 flex items-center text-green-300">
                <FaSearch />
              </div>
            </div>
          </div>

          {/* Right Side (Upload & Profile) */}
          <div className="flex items-center space-x-4">
            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={!session} // Nonaktifkan tombol jika belum login
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                session
                  ? "bg-green-600 hover:bg-green-500"
                  : "bg-green-400 cursor-not-allowed"
              }`}
            >
              <FaUpload />
              <span>Upload</span>
            </button>

            {/* Profile Avatar */}
            <div className="relative">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={32}
                  height={32}
                  className="rounded-full cursor-pointer"
                  onClick={() => router.push("/profile")}
                />
              ) : (
                <FaUserCircle
                  className="w-8 h-8 text-green-200 hover:text-green-100 cursor-pointer"
                  onClick={() => router.push("/profile")}
                />
              )}
            </div>
          </div>

          {/* Mobile Menu Button (Hamburger) */}
          <div className="md:hidden flex items-center">
            <button
              className="inline-flex items-center justify-center p-2 rounded-md text-green-200 hover:text-green-100 focus:outline-none"
              onClick={() => {
                // Tambahkan logika untuk toggle mobile menu di sini
              }}
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden mt-2">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-4 pr-10 py-2 rounded-lg bg-green-600 text-white placeholder-green-300 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="absolute right-0 top-0 h-full px-3 flex items-center text-green-300">
              <FaSearch />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}