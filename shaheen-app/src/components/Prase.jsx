// components/Phrase.js
import Image from 'next/image';

export default function Phrase({ src }) {
  return (
    <div className="px-5 flex gap-5  items-center">
      {/* Large text */}
      <p className="text-[7.5vw]  ">Elevate your brand</p>
      
      {/* Circular image */}
      <span className="relative h-[7.5vw] aspect-[4/2] rounded-full overflow-hidden">
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