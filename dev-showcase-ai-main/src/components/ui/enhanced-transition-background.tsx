"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BeamsBackground } from "./beams-background";
import { CanvasRevealEffect } from "./canvas-reveal-effect";

interface EnhancedTransitionBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: "subtle" | "medium" | "strong";
  showCanvasOverlay?: boolean;
}

export function EnhancedTransitionBackground({
  className,
  children,
  intensity = "medium",
  showCanvasOverlay = true,
}: EnhancedTransitionBackgroundProps) {
  return (
    <div className={cn("relative min-h-screen w-full overflow-hidden", className)}>
      {/* Base BeamsBackground */}
      <BeamsBackground 
        className="absolute inset-0" 
        intensity={intensity}
      />

      {/* Canvas Reveal Effect Overlay */}
      {showCanvasOverlay && (
        <div className="absolute inset-0 z-10 opacity-30 mix-blend-overlay">
          <CanvasRevealEffect
            animationSpeed={2}
            containerClassName="bg-transparent"
            colors={[
              [147, 51, 234], // purple-600
              [59, 130, 246],  // blue-500
              [139, 92, 246],  // violet-500
            ]}
            opacities={[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
            dotSize={2}
            showGradient={false}
          />
        </div>
      )}

      {/* Additional overlay for better blending */}
      <motion.div
        className="absolute inset-0 z-20 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          ease: "easeInOut",
          repeat: Number.POSITIVE_INFINITY,
        }}
      />

      {/* Content overlay */}
      {children && (
        <div className="relative z-30 flex min-h-screen w-full items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}