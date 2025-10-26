"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Move,
  RotateCcw,
  Hand,
  MousePointer,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Navigation,
  Compass,
  Target,
  Crosshair,
} from "lucide-react";
import { usePreview } from "../../lib/preview/context";

interface PanControlsProps {
  className?: string;
}

export const PanControls: React.FC<PanControlsProps> = ({ className = "" }) => {
  const { state, actions } = usePreview();
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panAreaRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const panStep = 50;
  const maxPan = 500;

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left mouse button

    setIsDragging(true);
    setIsPanning(true);
    setDragStart({ x: e.clientX, y: e.clientY });

    if (panAreaRef.current) {
      panAreaRef.current.style.cursor = "grabbing";
    }
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      const newPan = {
        x: Math.max(-maxPan, Math.min(maxPan, state.pan.x + deltaX)),
        y: Math.max(-maxPan, Math.min(maxPan, state.pan.y + deltaY)),
      };

      actions.setPan(newPan);
      setDragStart({ x: e.clientX, y: e.clientY });
    },
    [isDragging, dragStart, state.pan, actions, maxPan],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);

    if (panAreaRef.current) {
      panAreaRef.current.style.cursor = "grab";
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;

    const touch = e.touches[0];
    if (!touch) return;
    setIsDragging(true);
    setIsPanning(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isDragging || e.touches.length !== 1) return;

      const touch = e.touches[0];
      if (!touch) return;
      const deltaX = touch.clientX - dragStart.x;
      const deltaY = touch.clientY - dragStart.y;

      const newPan = {
        x: Math.max(-maxPan, Math.min(maxPan, state.pan.x + deltaX)),
        y: Math.max(-maxPan, Math.min(maxPan, state.pan.y + deltaY)),
      };

      actions.setPan(newPan);
      setDragStart({ x: touch.clientX, y: touch.clientY });
    },
    [isDragging, dragStart, state.pan, actions, maxPan],
  );

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
  }, []);

  const handlePanUp = () => {
    const newPan = {
      x: state.pan.x,
      y: Math.max(-maxPan, state.pan.y - panStep),
    };
    actions.setPan(newPan);
  };

  const handlePanDown = () => {
    const newPan = {
      x: state.pan.x,
      y: Math.min(maxPan, state.pan.y + panStep),
    };
    actions.setPan(newPan);
  };

  const handlePanLeft = () => {
    const newPan = {
      x: Math.max(-maxPan, state.pan.x - panStep),
      y: state.pan.y,
    };
    actions.setPan(newPan);
  };

  const handlePanRight = () => {
    const newPan = {
      x: Math.min(maxPan, state.pan.x + panStep),
      y: state.pan.y,
    };
    actions.setPan(newPan);
  };

  const handleResetPan = () => {
    actions.resetPan();
  };

  const handlePanAreaClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Click on pan area to center
      actions.resetPan();
    }
  };

  // Event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [
    isDragging,
    handleMouseMove,
    handleMouseUp,
    handleTouchMove,
    handleTouchEnd,
  ]);

  // Cleanup
  useEffect(() => {
    const timeout = timeoutRef.current;
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);

  const isAtOrigin = state.pan.x === 0 && state.pan.y === 0;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Pan Area */}
      <div
        ref={panAreaRef}
        className="relative w-16 h-16 bg-gray-100 border border-gray-300 rounded-lg cursor-grab hover:bg-gray-200 transition-colors"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onClick={handlePanAreaClick}
      >
        {/* Pan Indicator */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            <Crosshair className="w-4 h-4 text-gray-600" />
            <div
              className="absolute w-2 h-2 bg-blue-500 rounded-full -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${50 + (state.pan.x / maxPan) * 25}%`,
                top: `${50 + (state.pan.y / maxPan) * 25}%`,
              }}
            />
          </div>
        </div>

        {/* Pan Boundaries */}
        <div className="absolute inset-1 border border-gray-300 border-dashed rounded opacity-50" />
      </div>

      {/* Pan Direction Buttons */}
      <div className="flex flex-col space-y-1">
        <button
          onClick={handlePanUp}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          title="Pan Up"
        >
          <ArrowUp className="w-3 h-3" />
        </button>
        <div className="flex space-x-1">
          <button
            onClick={handlePanLeft}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Pan Left"
          >
            <ArrowLeft className="w-3 h-3" />
          </button>
          <button
            onClick={handlePanRight}
            className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
            title="Pan Right"
          >
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <button
          onClick={handlePanDown}
          className="p-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded"
          title="Pan Down"
        >
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      {/* Reset Pan Button */}
      <button
        onClick={handleResetPan}
        disabled={isAtOrigin}
        className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        title="Reset Pan"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      {/* Pan Status */}
      <div className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded text-sm text-gray-700 min-w-[80px] justify-center">
        <Navigation className="w-3 h-3" />
        <span className="font-mono text-xs">
          {state.pan.x !== 0 || state.pan.y !== 0
            ? `${state.pan.x > 0 ? "+" : ""}${Math.round(state.pan.x)}, ${state.pan.y > 0 ? "+" : ""}${Math.round(state.pan.y)}`
            : "0, 0"}
        </span>
      </div>

      {/* Pan Mode Indicator */}
      <AnimatePresence>
        {isPanning && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs"
          >
            <Hand className="w-3 h-3" />
            <span>Panning</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pan Instructions */}
      <div className="hidden lg:flex items-center space-x-1 text-xs text-gray-500">
        <MousePointer className="w-3 h-3" />
        <span>Drag to pan</span>
      </div>
    </div>
  );
};

export default PanControls;
