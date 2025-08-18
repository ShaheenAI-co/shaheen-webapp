export default function Home() {
  return (
    <div
      id="features-section"
      className="min-h-screen flex flex-col gap-20 mt-25 md:mt-51  p-4 md:p-8"
    >
      <div className="flex flex-col items-center text-center  gap-4">
        <h2 className="text-2xl lg:text-5xl font-bold satoshi-bold leading-tight max-sm:w-[300px]  max-w-[500px]  capitalize ">
          what makes shaheen unique
        </h2>
        <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">
          Supercharge your brand with AI-powered content creation, social media
          integration, and multilingual support
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-auto lg:grid-rows-3 gap-4 max-w-6xl mx-auto min-h-[600px]">
        {/* Large card - AI Advertisement Generation */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-2 lg:row-span-2 bg-black border border-white/25 shadow-[inset_0px_-246px_64px_-48px_#432C81,inset_0px_-308px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col justify-between p-8 min-h-[400px] md:min-h-[500px] ">
          <div>
            <h1 className="text-white text-2xl md:text-3xl lg:text-2xl font-semibold leading-tight mb-3">
              AI Advertisement Generation
            </h1>
            <p className="text-gray-300 font-normal text-sm leading-relaxed">
              Upload your product image and let our AI craft high-converting
              marketing posts complete with headlines, descriptions, and visuals
              ready to share across all platforms.
            </p>
          </div>

          <div>
            <h2 className="text-white text-xl font-medium">
              Smart Content Creation
            </h2>
          </div>
        </div>

        {/* Card 2 - Social Media Integration */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2 className="text-white text-lg font-semibold mb-2">
            Social Media Integration
          </h2>
          <p className="text-gray-300 font-normal text-base">
            Direct posting to Instagram, Twitter, and TikTok with optimized
            content for each platform
          </p>
        </div>

        {/* Card 3 - Post Scheduling */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2 className="text-white text-lg font-semibold mb-2">
            Smart Scheduling
          </h2>
          <p className="text-gray-300 font-normal text-base">
            Schedule posts in advance with calendar view and automated
            publishing
          </p>
        </div>

        {/* Card 4 - Image Editing */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2 className="text-white text-lg font-semibold mb-2">
            Advanced Image Editor
          </h2>
          <p className="text-gray-300 font-normal text-base">
            Professional editing tools with text overlays, filters, and
            adjustments
          </p>
        </div>

        {/* Card 5 - AI Retouching */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2 className="text-white text-lg font-semibold mb-2">
            AI Image Retouching
          </h2>
          <p className="text-gray-300 font-normal text-base">
            Automatic image enhancement with before/after comparison and
            professional filters
          </p>
        </div>

        {/* Card 6 - Multilingual Support */}
        <div className="md:col-span-2 lg:col-span-2 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#432C81,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex  p-6 min-h-[150px]">
          <div>
            <h3 className="text-white text-lg font-bold mb-2">
              Arabic Language Support
            </h3>
            <p className="text-gray-300 text-sm">
              Full Arabic language interface with RTL support and localized
              content generation
            </p>
          </div>
        </div>

        {/* Card 7 - Video Ads */}
        <div className="md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-1  bg-black border border-white/25 shadow-[inset_0px_-126px_64px_-48px_#a43dee85,inset_0px_-126px_64px_-32px_#7c67f3,inset_20px_-20px_50px_-10px_rgba(0,0,0,0.5)] mix-blend-lighten rounded-sm relative overflow-hidden flex flex-col  p-6 min-h-[200px]">
          <h2 className="text-white text-lg font-semibold mb-2">
            Video Ad Creation
          </h2>
          <p className="text-gray-300 font-normal text-base">
            Transform images into scroll-stopping video ads with animations and
            text overlays
          </p>
        </div>
      </div>
    </div>
  );
}
