import React from 'react'
import AnimatedText from './AnimatedText'
import HowItWork from './HowItWork'

const Content = () => {
  return (
    <div className="w-full  flex flex-col  gap-8 px-6 md:px-[64px] lg:py-54 py-20  text-2xl font-bold">
        <AnimatedText/>
        <HowItWork/>
      </div>
  )
}

export default Content