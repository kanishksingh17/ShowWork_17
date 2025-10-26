import React from "react";
import EnhancedOnboardingFlow from "../components/EnhancedOnboardingFlow";

export default function TestOnboardingFlow() {
  const mockUser = {
    name: "Test User",
    email: "test@example.com",
  };

  const handleComplete = (data: any) => {
    console.log("Onboarding completed with data:", data);
    alert("Profile setup completed successfully! Check the console for data.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedOnboardingFlow user={mockUser} onComplete={handleComplete} />
    </div>
  );
}
