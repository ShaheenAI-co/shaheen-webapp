import React from "react";
import { Nav } from "./Nav";
import Link from "next/link";
import GlowEclipse from "./GlowEclipse";
import { Button } from "./ui/button";
import HeroHeading from "./HeroHeading";
const HeroSection = () => {
  return (
    <div className="relative w-full flex flex-col  bg-gradient-radial-to-bottom h-[1000px] md:h-[1100px] px-6 md:px-[64px] py-6 overflow-hidden   ">
      <Nav />
      <HeroHeading />

      <GlowEclipse />
    </div>
  );
};

export default HeroSection;
