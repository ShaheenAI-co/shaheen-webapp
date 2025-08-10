import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Github,
  DropletIcon as Dropbox,
  MessageSquare,
  Settings,
  Globe,
  Zap,
} from "lucide-react";

export default function FeaturesBento() {
  return (
    <div className="min-h-screen flex flex-col items-center gap-15 mt-25 md:mt-54 p-6">

       <div className="flex flex-col items-center text-center  gap-4">
          <h2 className="text-2xl lg:text-5xl font-bold satoshi-bold leading-tight max-sm:w-[300px]  max-w-[500px]  capitalize ">
            what makes Shaheen special
          </h2>
          <p className=" max-w-[500px] max-sm:w-[300px] text-base md:text-lg font-normal text-muted-foreground ">why you should use shaheen for your business</p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Feature 1 */}
          <Card className="bg-black border-white p-6">
            <CardContent className="p-0">
              <div className="mb-4">
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-black rounded-full"></div>
                    <div className="text-sm text-black">Your dashboard</div>
                    <div className="ml-auto flex gap-1">
                      <div className="w-6 h-4 bg-black rounded"></div>
                      <div className="w-6 h-4 bg-black rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 bg-black rounded w-full"></div>
                    <div className="h-2 bg-black rounded w-3/4"></div>
                    <div className="h-2 bg-black rounded w-1/2"></div>
                  </div>
                  <div className="mt-4 bg-black rounded h-20"></div>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Easy Dashboard
              </h3>
              <p className="text-white text-base font-normal">
                Simplify blog management with our intuitive dashboard.
                Effortlessly create, customize, and track your content.
              </p>
            </CardContent>
          </Card>

          {/* Feature 2 */}
          <Card className="bg-black border-white p-6 relative overflow-hidden">
            <CardContent className="p-0">
              <div className="mb-4 flex flex-col  justify-center">
                <div className="mb-4 w-full flex justify-center h-[250px]">
                  <div className="w-full bg-white flex items-center justify-center rounded-lg shadow-lg">
                    image
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure, Fast & Reliable
                </h3>
                <p className="text-white text-base font-normal">
                  Streamlined Blog Control: Swift, Reliable, and Effortless Web
                  Construction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Feature 3 */}
          <Card className="bg-black border-white p-6">
            <CardContent className="p-0 flex flex-col  justify-between">
              <div className="mb-4 w-full flex justify-center h-[250px]">
                <div className="w-full bg-white flex items-center justify-center rounded-lg shadow-lg">
                  image
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Explore Integrations
              </h3>
              <p className="text-white font-normal text-base">
                Our integrations make it easy to work with the applications your
                teams already love
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature 4 */}
          <Card className="bg-black border-white p-6">
            <CardContent className="p-0">
              <div className="mb-4 flex flex-col  justify-center">
                <div className="mb-4 w-full flex justify-center h-[250px]">
                  <div className="w-full bg-white flex items-center justify-center rounded-lg shadow-lg">
                    image
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure, Fast & Reliable
                </h3>
                <p className="text-white text-base font-normal">
                  Streamlined Blog Control: Swift, Reliable, and Effortless Web
                  Construction.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Right Column */}
          <div className="space-y-6">

            {/* Feature 5 */}
            <Card className="bg-black border-white p-6">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                </div>
                <p className="text-sm text-gray-400 mb-1">Powered by</p>
                <h3 className="text-lg font-semibold text-white">
                  OpenAI Chatbox
                </h3>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="bg-black border-white p-6 h-[230px]">
              <CardContent className="p-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                    <Globe className="w-4 h-4 text-white" />
                  </div>
                  <Button className="ml-auto bg-gray-700 hover:bg-black text-white text-sm">
                    Publish
                  </Button>
                </div>
                <h3 className="text-lg font-semibold text-white">
                  Publish and get your domain
                </h3>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
