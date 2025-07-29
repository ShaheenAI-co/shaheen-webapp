'use client'
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Phrase({ src , text }) {
  const pathname = usePathname(); // give you the url path
  const locale = pathname.split("/")[1] || "en"; // check the first part after /
  const isArabic = locale === "ar";
  return (
    <div className="md:px-5 flex md:gap-5 px-2 gap-2  md:mb-8 mb-4 items-center">
      {/* Large text */}
      <p className={` md:text-[7.5vw] text-[11.5vw] ${isArabic ? "alexandria-font " : " "} `}>{text}</p>
      
      {/* Circular image */}
      <span className="relative md:h-[7.5vw] h-[14.5vw]  aspect-[4/2]    rounded-md overflow-hidden">
        <Image 
          style={{ objectFit: "cover" }} 
          src={src} 
          alt="image" 
          fill 
        />
      </span>
    </div>
  )
}