import Image from 'next/image'
import React from 'react'


const Footer = () => {
  return (
    <footer className='w-full bg-[#4F21A1] text-white py-4 md:py-8 px-4 flex flex-col items-center justify-center'>
        <div className='flex md:flex-row flex-col gap-4 justify-between items-center w-full px-8 max-sm:flex-col-reverse flex-wrap'>
            <div className='text-sm flex items-center gap-2 mb-2 md:mb-0 '>
                <span>©</span>
                <p>Shaheen.ai 2025</p>
            </div>
            <div className='flex gap-6 capitalize text-sm flex-wrap'>
                <p>Terms of service</p>
                <p>Privacy Policy</p>
                <p>cookie policy</p>
            </div>
        </div>
    </footer>
  )
}

export default Footer