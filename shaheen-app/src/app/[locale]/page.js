import Image from "next/image";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/Features";
import ParallaxSection from "@/components/PralaxScroll";
import Content from "@/components/Content";
import Footer from "@/components/Footer";



export default function Home() {
  return (
    <div className="bg-[#06040D]">
      <HeroSection />
      <ParallaxSection />
      <Content />

    <Footer/>
    </div>
  );
}
