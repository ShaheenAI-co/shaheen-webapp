import React from "react";
import AnimatedText from "./AnimatedText";
import HowItWork from "./HowItWork";
import FeaturesBento from "./FeaturesBento";
import AccordionComponent from "./Accordion";
import PriceCards from "@/components/PriceCards";
import Pricing from "./Pricing";
import FinalCta from "./FinalCta";
import CompareTable from "./compareTable";
import ProductCarousel from "./productCarousel";


const Content = () => {
  return (
    <div className="w-full  flex flex-col  gap-8 px-6 md:px-[64px] lg:py-54 py-20 bg-[#06040D]  text-2xl font-bold">
      {/*<AnimatedText />*/}
      <HowItWork />
      <ProductCarousel />
      <FeaturesBento />
      <CompareTable />
     
      <Pricing />
      <AccordionComponent />
      <FinalCta />
    </div>
  );
};

export default Content;
