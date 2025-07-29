import React from "react";

const GlowEclipse = () => {
  return (
    <div className="absolute md:bottom-[-770px] bottom-[-600px] left-1/2 transform -translate-x-1/2 md:w-[2200px] w-[1200px]  h-full z-0 bg-[#000000] glow-ellipse animate-glow-eclipse [clip-path:ellipse(50%_50%_at_50%_50%)] overflow-hidden"></div>
  );
};

export default GlowEclipse;
