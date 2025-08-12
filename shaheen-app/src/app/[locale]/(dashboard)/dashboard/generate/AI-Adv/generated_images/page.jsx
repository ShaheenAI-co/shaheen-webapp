import { Button } from '@/components/ui/button'
import React from 'react'


const image = ["img1","img2","img3","img4"]
const page = () => {
  return (
    <div className='w-full h-screen flex flex-col gap-20 py-10 px-20'>

        <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold capitalize'>generated images</h1>
            <p>choose the one of the images below </p>
        </div>

        <div className='border border-white/20 flex gap-8 justify-center p-10 items-center w-full h-fit'>

                {/*IMAGE CARDS   */}

         {image.map((img, index) => (
            <div key={index} className='w-[300px] h-[300px] bg-white/10 flex items-center justify-center p-4 flex-col gap-2'>
              <div className='flex-1 flex items-center justify-center w-full'>
                <span className='text-white/70'>{img}</span>
              </div>
              <Button className='cursor-pointer '>
                select
              </Button>
            </div>
          ))}


        </div>


    </div>
  )
}

export default page