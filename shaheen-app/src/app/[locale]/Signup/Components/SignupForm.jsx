import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const SignupForm = () => {
  return (
    <div className="flex-1 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-md space-y-4 md:space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Create An Account
          </h2>
          <p className="text-gray-400 text-sm md:text-base">
            enter your personal details to create an account
          </p>
        </div>

        <form className="space-y-3 md:space-y-4">
          {/* Google Sign Up Button */}
          <Button
            variant="outline"
            className="w-full bg-white border-none cursor-pointer text-black  h-10 md:h-12"
          >
            <svg className="w-4 h-4 md:w-5 md:h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm md:text-base">Google</span>
          </Button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white" />
            </div>
            <div className="relative flex justify-center text-xs ">
              <span className="bg-black px-2 text-gray-400">Or</span>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="firstName"
                className="text-white text-sm md:text-base"
              >
                First Name
              </Label>
              <Input
                id="firstName"
                placeholder="eg. Ahmad"
                className="bg-[#1A1A1A] text-base  text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 md:text-base"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="lastName"
                className="text-white text-sm md:text-base"
              >
                Last Name
              </Label>
              <Input
                id="lastName"
                placeholder="eg. Mohamed"
                className="bg-[#1A1A1A]  text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2 mt-6">
            <Label htmlFor="email" className="text-white text-sm md:text-base">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="eg. unknow@gmail.com"
              className="bg-[#1A1A1A]  text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2 mb-6">
            <Label
              htmlFor="password"
              className="text-white text-sm md:text-base"
            >
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="must be 8 characters"
              className="bg-[#1A1A1A]  text-white border-none placeholder:text-[#615F5F] h-10 md:h-12 text-base md:text-base"
            />
          </div>

          {/* Sign Up Button */}
          <Button className="w-full bg-white text-black cursor-pointer hover:bg-white h-10 md:h-12 font-semibold text-sm md:text-base">
            Sign Up
          </Button>

          {/* Login Link */}
          <p className="text-center text-gray-400 text-sm md:text-base">
            Already have an account ?{" "}
            <Link href="/Login" className="text-blue-500 hover:underline">
              Login up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
