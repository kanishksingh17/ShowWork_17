import React, { ReactNode } from 'react';

interface BlurFadeProps {
  children: ReactNode;
  delay?: number;
  inView?: boolean;
}

export const BlurFade: React.FC<BlurFadeProps> = ({ children, delay = 0, inView = true }) => {
  return (
    <div 
      className={`transition-all duration-500 ease-out ${
        inView 
          ? 'opacity-100 blur-0 translate-y-0' 
          : 'opacity-0 blur-sm translate-y-4'
      }`}
      style={{ 
        transitionDelay: `${delay * 100}ms` 
      }}
    >
      {children}
    </div>
  );
};
