'use client';

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card";
import { Spotlight } from "./ui/spotlight";
 
export function SplineSceneBasic() {
  return (
    <Card className="w-full h-[500px] bg-black/[0.96] relative overflow-hidden z-0">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 z-0" />
      
      <div className="flex h-full">
        {/* Left content */}
        <div className="flex-1 p-8 relative z-10 flex flex-col justify-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
            Debug Programming Club
          </h1>
          <p className="mt-4 text-neutral-300 max-w-lg">
            Join a community of passionate developers and innovators. Explore coding, problem-solving, and real-world projects while collaborating with like-minded peers. Unlock your potential with hands-on experience and creative challenges.
          </p>
        </div>

        {/* Right content */}
        <div className="flex-1 relative z-0">
          <SplineScene 
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />
        </div>
      </div>
    </Card>
  );
}
