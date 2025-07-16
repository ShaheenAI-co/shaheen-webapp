import React from "react";
import Link from "next/link";
export const Nav = () => {
  return (
    <nav className="flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
          <span className="text-black font-bold text-sm">k</span>
        </div>
        <span className="text-xl font-semibold">kontena AI</span>
      </div>

      {/* Navigation Links - Hidden on mobile */}
      <div className="hidden text-lg lg:flex items-center space-x-8">
        <Link href="#" className="hover:text-gray-300 transition-colors">
          Home
        </Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">
          Pricing
        </Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">
          features
        </Link>
        <Link href="#" className="hover:text-gray-300 transition-colors">
          About
        </Link>
      </div>

      {/* Right side CTA's */}
      <div className="hidden lg:flex items-center space-x-8">
        {/* Language selector - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-1 cursor-pointer hover:text-gray-300 transition-colors">
          <span className="text-sm">▼</span>
        </div>

        {/* Login link */}
        <Link href="/login">
          <button className="hover:text-gray-300 cursor-pointer transition-colors">
            Login
          </button>
        </Link>

        {/* Try for free button */}
        <Link href="/signup">
          <button className="bg-white text-black hover:bg-gray-100 px-4 py-2 cursor-pointer rounded-md transition-colors">
            Try for free
          </button>
        </Link>
      </div>
    </nav>
  );
};
