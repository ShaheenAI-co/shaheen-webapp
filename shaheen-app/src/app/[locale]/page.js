import Image from "next/image";
import HeroSection from "@/components/HeroSection"; 
import FeaturesSection from "@/components/Features";
import ParallaxSection from "@/components/PralaxScroll";
import Content from "@/components/Content";

export default function Home() {
  return (
   <div>
      <HeroSection/>
      <ParallaxSection/>
      <Content/>

      
   </div>
  );
}
