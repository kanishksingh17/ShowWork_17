"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Sparkles, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShowWorkWelcomeOverlayProps {
  userName?: string;
  show?: boolean;
  onComplete?: () => void;
  className?: string;
}

export function ShowWorkWelcomeOverlay({ 
  userName = "Developer", 
  show = true, 
  onComplete,
  className 
}: ShowWorkWelcomeOverlayProps) {
  const [currentPhase, setCurrentPhase] = useState(0);

  const welcomePhases = [
    {
      title: "Welcome to",
      subtitle: "ShowWork",
      description: "Your professional developer portfolio platform",
      icon: <Code2 className="w-12 h-12" />,
      color: "from-purple-600 to-blue-600"
    },
    {
      title: `Hello, ${userName}`,
      subtitle: "Ready to Showcase?",
      description: "Let's build something amazing together",
      icon: <Sparkles className="w-12 h-12" />,
      color: "from-blue-600 to-cyan-600"
    },
    {
      title: "Your Journey",
      subtitle: "Starts Here",
      description: "Discover, create, and share your best work",
      icon: <Star className="w-12 h-12" />,
      color: "from-cyan-600 to-purple-600"
    }
  ];

  useEffect(() => {
    if (!show) return;

    const phaseTimer = setTimeout(() => {
      if (currentPhase < welcomePhases.length - 1) {
        setCurrentPhase(prev => prev + 1);
      } else {
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 2000);
      }
    }, 2500);

    return () => clearTimeout(phaseTimer);
  }, [currentPhase, show, onComplete, welcomePhases.length]);

  if (!show) return null;

  const currentWelcome = welcomePhases[currentPhase];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          "fixed inset-0 z-50 flex items-center justify-center",
          "relative overflow-hidden",
          className
        )}
      >
        <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhase}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 1.05 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                className={`p-6 rounded-full bg-gradient-to-br ${currentWelcome.color} shadow-2xl`}
              >
                <div className="text-white">
                  {currentWelcome.icon}
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight"
                style={{ textShadow: '0 0 20px rgba(0,0,0,0.5), 0 0 40px rgba(0,0,0,0.3)' }}
              >
                {currentWelcome.title}
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className={`text-3xl md:text-5xl lg:text-6xl font-semibold bg-gradient-to-r ${currentWelcome.color} bg-clip-text text-transparent`}
                style={{ filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.3))' }}
              >
                {currentWelcome.subtitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="text-xl md:text-2xl text-gray-300 max-w-2xl leading-relaxed"
                style={{ textShadow: '0 0 15px rgba(0,0,0,0.7)' }}
              >
                {currentWelcome.description}
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="flex space-x-3 mt-8"
              >
                {welcomePhases.map((_, index) => (
                  <motion.div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index <= currentPhase 
                        ? 'bg-white shadow-lg' 
                        : 'bg-white/30'
                    }`}
                    animate={{
                      scale: index === currentPhase ? 1.3 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                  />
                ))}
              </motion.div>

              {currentPhase === welcomePhases.length - 1 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-8"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      opacity: [0.8, 1, 0.8]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="p-4 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 backdrop-blur-sm border border-white/10"
                  >
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}