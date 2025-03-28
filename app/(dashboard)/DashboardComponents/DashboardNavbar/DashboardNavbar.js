"use client";

import { useState } from "react";
import Link from "next/link";

const DashboardNavbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/dashboard">Dashboard</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <Link href="/dashboard" className="hover:text-gray-300">
            Home
          </Link>
          <Link href="/dashboard/profile" className="hover:text-gray-300">
            Profile
          </Link>
          <Link href="/dashboard/users" className="hover:text-gray-300">
            Users
          </Link>
          <button className="hover:text-gray-300" onClick={() => alert("Logging out...")}>
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <Link href="/dashboard" className="block px-4 py-2 hover:bg-blue-500">
            Home
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 hover:bg-blue-500">
            Profile
          </Link>
          <Link href="/dashboard/Users" className="block px-4 py-2 hover:bg-blue-500">
            User
          </Link>
          <button
            className="block px-4 py-2 hover:bg-blue-500 w-full text-left"
            onClick={() => alert("Logging out...")}
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;