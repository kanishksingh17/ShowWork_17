"use client";
import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  /**
   * 0.1 - slower
   * 1.0 - faster
   */
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    updateCanvasSize();
    window.addEventListener("resize", updateCanvasSize);

    let animationFrame: number;
    const startTime = Date.now();

    const animate = () => {
      if (!canvas || !ctx) return;

      const currentTime = Date.now();
      const elapsed = (currentTime - startTime) * animationSpeed * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create animated dot matrix effect with ripple animation
      const dotSpacing = dotSize || 25;
      const cols = Math.ceil(canvas.width / dotSpacing);
      const rows = Math.ceil(canvas.height / dotSpacing);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * dotSpacing;
          const y = j * dotSpacing;

          // Ripple wave animation from center
          const centerX = cols / 2;
          const centerY = rows / 2;
          const distance = Math.sqrt((i - centerX) ** 2 + (j - centerY) ** 2);
          const wave = Math.sin(elapsed * 2 + distance * 0.3) * 0.5 + 0.5;
          const fadeIn = Math.max(0, 1 - (distance * 0.05 - elapsed * 1.5));

          if (fadeIn > 0) {
            const opacity =
              wave *
              fadeIn *
              (opacities[Math.floor(distance) % opacities.length] || 0.5) *
              0.8;
            const colorIndex = Math.floor(distance) % colors.length;
            const [r, g, b] = colors[colorIndex] || [147, 51, 234];

            ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
            ctx.beginPath();
            ctx.arc(x, y, (dotSize || 2) * (0.5 + wave * 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", updateCanvasSize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [animationSpeed, colors, dotSize, opacities]);

  return (
    <div className={cn("h-full relative bg-white w-full", containerClassName)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ filter: "blur(1px)" }}
      />
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 to-[84%]" />
      )}
    </div>
  );
};
