import React from "react";
import { Nav } from "./Nav";
import Link from "next/link";
import GlowEllipse from "./GlowEllipse";
const HeroSection = () => {
  return (
    <div className="flex flex-col  bg-gradient-radial-to-bottom h-screen px-[64px] py-6  relative ">
      <Nav />
      <main className="flex flex-col z-10 items-center justify-center gap-12 px-6 py-26 lg:py-54 text-center w-full">
        <div className="flex flex-col gap-[24px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight max-w-6xl ">
            Supercharge Your Brand With <br className="hidden sm:block" />
            AI Powered Content Creation
          </h1>

          <p className="text-lg md:text-xl text-gray-300  mx-auto  leading-relaxed">
            Everything you need to grow online designed, scheduled and delivered
            by AI
          </p>
        </div>

        {/* Call to Action Button */}
        <Link href="/login">
          <button className="bg-white text-black hover:bg-gray-100 transition-colors px-4 py-2 rounded-md text-lg font-medium">
            Get Started
          </button>
        </Link>
      </main>
    </div>
  );
};

export default HeroSection;
