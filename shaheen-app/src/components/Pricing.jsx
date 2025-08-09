import { Button } from "@/components/ui/button"
import { User, Cloud, Check } from "lucide-react"
import Image from "next/image"

export default function Pricing() {
  return (
    <div className="min-h-screen w-full text-white flex flex-col items-center justify mt-25 md:mt-51  gap-20 p-4 sm:p-6 lg:p-8">

        {/* Header Section */}
      <div className="flex flex-col items-center text-center  gap-4">
          <h2 className="text-2xl lg:text-5xl font-bold satoshi-bold leading-tight max-sm:w-[300px]  max-w-[500px]  capitalize ">
            Plan made for teams of all sizes
          </h2>
          <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">From startup to enterprise, choose the right plan to elevate your business</p>
      </div>
      

      <div className="flex flex-col lg:flex-row gap-8  w-full justify-center items-center">

        {/*  Card 1 */}
        <div className="relative overflow-hidden rounded-xl border-1  border-gray-400 bg-black backdrop-blur-lg  w-[400px] h-[600px] pt-4 pb-12 shadow-[inset_-48px_44px_84px_-48px_#B52CFF,inset_-32px_68px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
        
       
          

          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">

            <h2 className="text-2xl satoshi-bold  mb-2">Startup</h2>

            <div className="flex flex-col gap-2 ">
                <div className="flex items-baseline ">
                    <div className="flex items-center justify-center gap-2">
                            <Image  src="/Logo/saudi-riyal-symbol.svg" alt="Logo" width={18} height={18} className="inline-block mr-1" />
                        <h1 className=" text-4xl"> 350</h1>
                    </div>
                  <span className="text-white ml-2 font-normal text-lg">/ month</span>
                </div>
                <p className="font-normal text-base mb-8 capitalize"> For freelancers and small teams </p>
            </div>

            <Button className="w-full bg-[#5514B0] hover:bg-[#712ecd] cursor-pointer text-white font-semibold py-6 rounded-md transition-all duration-200">
              Choose this plan
            </Button>

                {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">

              <h3 className="text-base font-semibold mb-4">All free plan features plus :</h3>

              <ul className="space-y-3 text-white">

                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">20 free seats available</span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">12GB of cloud storage</span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">Supercharged tools</span>
                </li>

              </ul>


            </div>


          </div>
        </div>


        {/*  Card 2 */}
        <div className="relative overflow-hidden rounded-xl border-1 border-gray-400 bg-black backdrop-blur-lg  w-[400px] h-[600px] pt-4 pb-12  shadow-[inset_102px_-46px_84px_-48px_#B52CFF,inset_108px_-32px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
        
       
          

          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">

            <h2 className="text-2xl satoshi-bold  mb-2">Business</h2>

            <div className="flex flex-col gap-2 ">
                <div className="flex items-baseline ">
                    <div className="flex items-center justify-center gap-2">
                            <Image  src="/Logo/saudi-riyal-symbol.svg" alt="Logo" width={18} height={18} className="inline-block mr-1" />
                        <h1 className=" text-4xl"> 750</h1>
                    </div>
                  <span className="text-white ml-2 font-normal text-lg">/ month</span>
                </div>
                <p className="font-normal text-base mb-8">Perfect for growing businesses</p>
            </div>

            <Button className="w-full bg-[#5514B0] hover:bg-[#712ecd] cursor-pointer text-white font-semibold py-6 rounded-md transition-all duration-200">
              Choose this plan
            </Button>

                {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">

              <h3 className="text-base font-semibold mb-4">All free plan features plus :</h3>

              <ul className="space-y-3 text-white">

                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">20 free seats available</span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">12GB of cloud storage</span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">Supercharged tools</span>
                </li>

              </ul>


            </div>


          </div>
        </div>


        {/*  Card 3 */}
        <div className="relative overflow-hidden rounded-xl border-1 border-gray-400 bg-black backdrop-blur-lg  w-[400px] h-[600px] pt-4 pb-12  shadow-[inset_-88px_-60px_84px_-48px_#B52CFF,inset_-88px_-60px_84px_-32px_#826CFF,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten">
        
       
          

          <div className="relative z-10 p-6 sm:p-8 flex flex-col gap-4 ">

            <h2 className="text-2xl satoshi-bold  mb-2">Enterprise</h2>

            <div className="flex flex-col gap-2 ">
                <div className="flex items-baseline ">
                    <div className="flex items-center justify-center gap-2">
                            <Image  src="/Logo/saudi-riyal-symbol.svg" alt="Logo" width={18} height={18} className="inline-block mr-1" />
                        <h1 className=" text-4xl"> 1,800</h1>
                    </div>
                  <span className="text-white ml-2 font-normal text-lg">/ month</span>
                </div>
                <p className="font-normal text-base mb-8">Best for high volume marketing teams</p>
            </div>

            <Button className="w-full bg-[#5514B0] hover:bg-[#712ecd] cursor-pointer text-white font-semibold py-6 rounded-md transition-all duration-200">
              Choose this plan
            </Button>

                {/* Features List */}
            <div className="mt-2 pt-8 border-t border-gray-800">

              <h3 className="text-base font-semibold mb-4">All free plan features plus :</h3>

              <ul className="space-y-3 text-white">

                <li className="flex items-center gap-3">
                  <User className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">20 free seats available</span>
                </li>

                <li className="flex items-center gap-3">
                  <Cloud className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">12GB of cloud storage</span>
                </li>

                <li className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-purple-400" />
                  <span className="text-base font-normal">Supercharged tools</span>
                </li>

              </ul>


            </div>


          </div>
        </div>

      


      </div>
    </div>
  )
}
