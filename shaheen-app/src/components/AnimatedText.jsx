import React from "react";
import ScrollRevealText from "./Scroll-revel-text";

const AnimatedText = () => {
  return (
    <section className="px-4 lg:px-34">
      <ScrollRevealText
        text="Introducing shaheen AI"
        splitBy="word"
        className="text-xl lg:text-5xl font-bold satoshi-bold capitalize mb-4 md:mb-8 "
      />
      <div className="hidden md:block">
          <ScrollRevealText
            text={`Supercharge your product marketing with the power of AI.
                Just upload your product image and our platform will instantly generate eye catching ready to post social media content tailored to your brand from captions to visuals everything is crafted to boost engagement , drive sales and make your product stand out no design or writing skills needed`}
            splitBy="line"
            delay={0.2}
            duration={0.8}
            className="text-xl md:text-2xl lg:text-5xl font-bold"
          />
      </div>
      <div className="block md:hidden">
          <ScrollRevealText
            text={`Supercharge your product marketing with the power of AI.Just upload your product imageand our platform will instantly generateeye-catching ready to post social media content tailored to your brand.From captions to visuals everything is craftedto boost engagement ,drive salesand make your product stand outno design or writing skills needed`}
            splitBy="line"
            delay={0.2}
            duration={0.8}
            className="text-base font-bold"
          />
      </div>
    </section>
  );
};

export default AnimatedText;
