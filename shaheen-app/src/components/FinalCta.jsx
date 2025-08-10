import { Button } from "@/components/ui/button"
import CurvedBand from "./CurvedRect";
import Link from "next/link";


export default function FinalCta() {
  return (
    <div className="relative flex flex-col items-center justify-center border border-gray-400 min-h-[500px] bg-black text-white md:p-8 rounded-2xl overflow-hidden shadow-lg mx-auto w-[350px] md:w-[800px] lg:w-[1300px] backdrop-blur-lg mt-20 mb-20">

        {/* Heading */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center space-y-6">
        <div className="flex flex-col items-center gap-4">
            <h1 className="text-3xl md:text-6xl satoshi-bold max-sm:w-[300px]  leading-tight max-w-3xl">You Could've Posted by Now Let's Go</h1>
            <p className="text-base md:text-lg max-sm:w-[250px] font-normal text-gray-300 ">
              Let our AI do the writing while you focus on growing your brand
            </p>
        </div>
        <Link href="/Signup" className="w-full max-w-md">
            <Button variant="secondary" className="cursor-pointer  font-semibold py-3 px-6 rounded-md transition-all duration-200">
              Get Started
            </Button>
        </Link>
      </div>

        {/* Curved Banner Background BOTTOM */}
    <div className="absolute bottom-[-200px]  w-[2000px]">
      <svg
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
          <filter id="bannerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
            {/* stdDeviation="40" for an 80px blur */}
          </filter>
        </defs>
        {/* The path element applies the filter and blend mode *to itself* */}
        <path
          d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
          fill="#B3A4FF"
          style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
        />
      </svg>
    </div>
               
        {/* Curved Banner Background BOTTOM */}
    <div className="absolute bottom-[-200px]  w-[2000px]">
      <svg
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
          <filter id="bannerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
            {/* stdDeviation="40" for an 80px blur */}
          </filter>
        </defs>
        {/* The path element applies the filter and blend mode *to itself* */}
        <path
          d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
          fill="#5E2FE8"
          style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
        />
      </svg>
    </div>

        {/* Curved Banner Background TOP */}
    <div className="absolute top-[-250px] rotate-180  w-[2000px]">
      <svg
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
          <filter id="bannerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
            {/* stdDeviation="40" for an 80px blur */}
          </filter>
        </defs>
        {/* The path element applies the filter and blend mode *to itself* */}
        <path
          d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
          fill="#5E2FE8"
          style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
        />
      </svg>
    </div>

        {/* Curved Banner Background TOP */}
    <div className="absolute top-[-300px] rotate-180  w-[2000px]">
      <svg
        viewBox="0 0 1000 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        <defs>
          {/* This filter is defined *inside* the SVG and is only applied when referenced by an SVG element */}
          <filter id="bannerBlur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" />{" "}
            {/* stdDeviation="40" for an 80px blur */}
          </filter>
        </defs>
        {/* The path element applies the filter and blend mode *to itself* */}
        <path
          d="M 50 100 C 300 180 700 180 950 100 L 950 200 C 700 280 300 280 50 200 Z"
          fill="#B3A4FF"
          style={{ filter: "url(#bannerBlur)", mixBlendMode: "lighten" }}
        />
      </svg>
    </div>


    </div>
  )
}

