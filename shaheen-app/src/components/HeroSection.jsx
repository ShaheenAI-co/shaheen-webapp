import React from "react";
import { Nav } from "./Nav";
import Link from "next/link";
import GlowEclipse from "./GlowEclipse";
import { Button } from "./ui/button";
const HeroSection = () => {
  return (
    <div className="flex flex-col  bg-gradient-radial-to-bottom h-screen px-[64px] py-6   ">
      <Nav />
      <main className="flex flex-col z-10 items-center justify-center gap-12 px-6 py-26 lg:py-54 text-center w-full">
        <div className="flex flex-col gap-[24px]">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl satoshi-bold leading-tight max-w-6xl ">
            Supercharge Your Brand With <br className="hidden sm:block" />
            AI Powered Content Creation
          </h1>

          <p className="text-lg md:text-xl text-gray-300  mx-auto  leading-relaxed">
            Everything you need to grow online designed, scheduled and delivered
            by AI
          </p>
        </div>

        <Link href="/login">
          <Button variant="secondary" className="cursor-pointer">Get Started</Button>
        </Link>

        <GlowEclipse />
      </main>
    </div>
  );
};

export default HeroSection;
