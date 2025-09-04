"use client";

import React, { useState } from "react";
import { EnhancedTransitionBackground } from "./enhanced-transition-background";
import { Button } from "./button";
import { BlurFade } from "./blur-fade";

export function EnhancedTransitionBackgroundDemo() {
  const [showOverlay, setShowOverlay] = useState(true);
  const [intensity, setIntensity] = useState<"subtle" | "medium" | "strong">("medium");

  return (
    <EnhancedTransitionBackground 
      intensity={intensity}
      showCanvasOverlay={showOverlay}
    >
      <div className="text-center space-y-8 p-8">
        <BlurFade delay={0.2}>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            Enhanced Background
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            BeamsBackground with CanvasRevealEffect overlay creating a stunning visual experience
          </p>
        </BlurFade>

        <BlurFade delay={0.4}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Button 
              onClick={() => setShowOverlay(!showOverlay)}
              variant={showOverlay ? "default" : "outline"}
            >
              {showOverlay ? "Hide" : "Show"} Canvas Overlay
            </Button>
            
            <div className="flex gap-2">
              {(["subtle", "medium", "strong"] as const).map((level) => (
                <Button
                  key={level}
                  onClick={() => setIntensity(level)}
                  variant={intensity === level ? "default" : "outline"}
                  size="sm"
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        </BlurFade>

        <BlurFade delay={0.6}>
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-2">Current Settings</h3>
            <div className="text-sm text-gray-300 space-y-1">
              <div>Canvas Overlay: <span className="text-purple-300">{showOverlay ? "Enabled" : "Disabled"}</span></div>
              <div>Beam Intensity: <span className="text-purple-300">{intensity}</span></div>
              <div>Blend Mode: <span className="text-purple-300">mix-blend-overlay</span></div>
            </div>
          </div>
        </BlurFade>
      </div>
    </EnhancedTransitionBackground>
  );
}