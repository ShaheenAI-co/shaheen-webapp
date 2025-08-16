import React from "react";
import Topbar from "../../components/Topbar";
import Image from "next/image";

const page = () => {
  return (
    <div className="py-6 bg-[#0f0f0f] min-h-screen">
      {/* TOPBAR */}
      <div className="px-12">
        <Topbar icon="/icons/Image_.svg" title="Final Image" />
      </div>

      <div className="w-full flex flex-col mt-6 px-12">
        {/* EXPORT BUTTON */}
        <div className="w-full flex justify-end ">
          <button className="bg-[#6123B8] font-bold capitalize text-white px-4 cursor-pointer py-3  rounded-lg">
            export
          </button>
        </div>

        <div className="w-full flex gap-6 items-center flex-col lg:flex-row border border-white/10 bg-white/5 rounded-lg p-4 h-[800px]    mt-6">
          {/* IMAGE */}
          <div className=" w-[50%] h-full flex items-center justify-center rounded-lg p-2">
            <Image
              width={450}
              height={450}
              src="/images/bagV2.png"
              alt="generated image"
              className="object-cover rounded-lg w-[450px] h-[490px]"
            />
          </div>

          {/* INFO */}
          <div className=" w-[50%] h-full  flex items-center justify-center rounded-lg p-2">
            <div className="w-[500px] h-[500px] bg-[#0F0F0F] rounded-lg flex flex-col items-center ">
              {/* HEADING */}
              <div className="flex flex-col gap-8 px-11 py-6 ">
                <h1 className="text-white text-5xl satoshi-bold capitalize text-center">
                  your product is ready to post
                </h1>
                <p className="text-white/50 text-center leading-5 px-12">
                  Need changes? You can go back or generate another version
                  anytime
                </p>
              </div>

              <div className="flex flex-col w-full  rounded-lg h-full items-center justify-center gap-8">
                {/* CAPTION */}
                <div className="flex flex-col gap-2 w-full justify-center items-center">
                  <p className="capitalize">post caption</p>
                  <textarea
                    name=""
                    id=""
                    cols="30"
                    rows="3"
                    className="bg-[#2E2042] rounded-lg p-4"
                    defaultValue={"This is a test caption"}
                  ></textarea>
                </div>

                {/* BUTTONS */}
                <div className="flex gap-6 w-full justify-center items-center">
                  <button className="bg-[#6123B8] font-semibold capitalize text-white px-4 cursor-pointer py-3  rounded-lg">
                    publish now
                  </button>
                  <button className="border border-[#6123B8] font-semibold capitalize text-white px-4 cursor-pointer py-3  rounded-lg">
                    regenerate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
