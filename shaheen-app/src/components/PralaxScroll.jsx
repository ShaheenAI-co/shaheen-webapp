// components/ParallaxSection.js
"use client";
import { useScroll } from "framer-motion";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import Slide from "./Slide";
import Picture1 from '../../public/images/bg.jpg'


export default function ParallaxSection() {
  const container = useRef();

  // Track scroll progress of this container
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"], // When to start/end tracking
  });

  return (
    <main className=" flex items-start md:items-center   overflow-hidden ">
      {/* Spacer div for scroll distance */}
      {/* <div className="h-[100vh]" /> */}

      {/* Main parallax container */}
      <div ref={container}>
        <Slide
          src={Picture1}
          direction={"left"}
          left={"-40%"}
          progress={scrollYProgress}
        />
        <Slide
          src={Picture1}
          direction={"right"}
          left={"-25%"}
          progress={scrollYProgress}
        />
        <Slide
          src={Picture1}
          direction={"left"}
          left={"-55%"}
          progress={scrollYProgress}
        />
      </div>

      {/* Another spacer for more scroll distance */}
      {/* <div className="h-[100vh]" /> */}
    </main>
  );
}
