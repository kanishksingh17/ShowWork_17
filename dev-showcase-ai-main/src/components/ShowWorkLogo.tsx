import React from "react";

interface ShowWorkLogoProps {
  size?: "sm" | "md" | "lg";
  variant?: "icon" | "full" | "text";
  className?: string;
}

export default function ShowWorkLogo({
  size = "md",
  variant = "full",
  className = "",
}: ShowWorkLogoProps) {
  const sizeClasses = {
    sm: "w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px]",
    md: "w-8 h-8 min-w-[32px] min-h-[32px] max-w-[32px] max-h-[32px]",
    lg: "w-12 h-12 min-w-[48px] min-h-[48px] max-w-[48px] max-h-[48px]",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
  };

  if (variant === "icon") {
    return (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <div className="code-logo-container">
          <div className="code-logo">
            <span className="code-symbol">&lt; / &gt;</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <span
        className={`font-bold text-slate-700 ${textSizes[size]} ${className}`}
      >
        ShowWork
      </span>
    );
  }

  // Full logo (icon + text)
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative`}>
        <div className="code-logo-container">
          <div className="code-logo">
            <span className="code-symbol">&lt; / &gt;</span>
          </div>
        </div>
      </div>
      <span className={`font-bold text-slate-700 ${textSizes[size]}`}>
        ShowWork
      </span>
    </div>
  );
}
