import Image from "next/image";
import HeroSection from "@/components/HeroSection"; 
import FeaturesSection from "@/components/Features";
import ParallaxSection from "@/components/PralaxScroll";

export default function Home() {
  return (
   <div>
      <HeroSection/>
      <ParallaxSection/>

      <div className="w-full h-screen flex justify-center items-start text-2xl font-bold">
        hello 
      </div>
   </div>
  );
}
