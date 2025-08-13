'use client'
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import { fetchImageUrlsByPostId } from '../../../../../../../../lib/supabase/generated_asset'



const page = () => {
    const [images, setImages] = useState([])

    useEffect(() => {

        // Simulate fetching images from an API or database
        const fetchImages = async () => {
            try {
                const fetchedImages = await fetchImageUrlsByPostId("feeb4fd2-b5a9-474e-8c82-10795416f33b");
                setImages(fetchedImages);
                console.log(`${images} images fetched successfully:`);
            } catch (error) {
                console.error("Error fetching images:", error);
            }
        };
        fetchImages();
    }, []);


  return (
    <div className='w-full h-screen flex flex-col gap-20 py-10 px-20'>

        <div className='flex flex-col gap-2'>
            <h1 className='text-xl font-bold capitalize'>generated images</h1>
            <p>choose the one of the images below </p>
        </div>

        <div className='border border-white/20 flex gap-8 justify-center p-10 items-center w-full h-fit'>

                {/*IMAGE CARDS   */}

         {images.map((image, index) => (
            <div key={index} className='w-[300px] h-[300px] bg-white/10 flex items-center justify-center p-4 flex-col gap-2'>
              <div className='flex-1 flex items-center justify-center w-full'>
               <img  src={image.image_url} className='w-full h-full object-cover rounded-lg' />
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