"use client";

import React, { useState } from "react";
import { ShowWorkWelcomeOverlay } from "./welcome-overlay";
import { Button } from "./button";

export function WelcomeOverlayDemo() {
  const [showWelcome, setShowWelcome] = useState(false);

  const handleStart = () => {
    setShowWelcome(true);
  };

  const handleComplete = () => {
    setShowWelcome(false);
    console.log("Welcome sequence completed!");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">
          ShowWork Welcome Overlay Demo
        </h1>
        <p className="text-gray-600 max-w-md">
          Click the button below to experience the ShowWork welcome sequence that will overlay your transition page.
        </p>
        <Button onClick={handleStart} size="lg">
          Start Welcome Sequence
        </Button>
      </div>

      <ShowWorkWelcomeOverlay 
        userName="Alex"
        show={showWelcome}
        onComplete={handleComplete}
      />
    </div>
  );
}