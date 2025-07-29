import React from "react";
import Image from "next/image";
const LeftPanel = ({phrase}) => {
  return (
    <div className="flex-1 relative  rounded-2xl">
      <div className="absolute inset-0 flex flex-col justify-center items-center gap-6  bg-gradient-radial-to-bottom rounded-2xl md:rounded-4xl">
      <div className="flex  justify-center items-center gap-2">
        <Image src="/Logo/logo-light.png" alt="Logo" width={20} height={20} className="max-sm:w-[20px] max-sm:h-[30px]" />
          <h2 className="text-xl satoshi-bold ">Shaheen AI</h2>
        </div>
        <h1 className=" hidden md:block text-4xl font-bold capitalize">{phrase}</h1>
      </div>
    </div>
  );
};

export default LeftPanel;
