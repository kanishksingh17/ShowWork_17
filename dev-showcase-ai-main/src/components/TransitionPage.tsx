import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BlurFade } from './ui/blur-fade';
import { EnhancedTransitionBackground } from './ui/enhanced-transition-background';
import { ShowWorkWelcomeOverlay } from './ui/welcome-overlay';
import { CheckCircle, Sparkles, Star, Zap, Trophy, ArrowRight } from 'lucide-react';
import ShowWorkLogo from './ShowWorkLogo';

interface TransitionPageProps {
  user: any;
  selectedPlatforms: string[];
  profileData: any;
  onComplete?: () => void;
}

export default function TransitionPage({ user, selectedPlatforms, profileData, onComplete }: TransitionPageProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [showMainTransition, setShowMainTransition] = useState(false);

  const transitionSteps = [
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Profile Setup Complete",
      description: "Your professional profile has been created successfully",
      color: "text-green-400"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Platforms Connected",
      description: `${selectedPlatforms.length} platform${selectedPlatforms.length !== 1 ? 's' : ''} ready for your content`,
      color: "text-blue-400"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Skills Assessed",
      description: "Your technical expertise has been evaluated and documented",
      color: "text-purple-400"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Portfolio Generated",
      description: "Your personalized showcase is now live and ready to impress",
      color: "text-yellow-400"
    }
  ];

  useEffect(() => {
    // Start main transition after welcome completes
    if (!showMainTransition) return;

    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < transitionSteps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(() => {
              if (onComplete) {
                onComplete();
              } else {
                navigate('/dashboard');
              }
            }, 1500);
          }, 1000);
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [navigate, onComplete, showMainTransition]);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    setShowMainTransition(true);
  };

  return (
    <>
      {/* Enhanced Background - Always visible */}
      <EnhancedTransitionBackground 
        className="min-h-screen overflow-hidden" 
        intensity="medium"
        showCanvasOverlay={showMainTransition}
      >
        {/* Welcome Overlay */}
        <ShowWorkWelcomeOverlay 
          userName={user?.name?.split(' ')[0] || 'Developer'}
          show={showWelcome}
          onComplete={handleWelcomeComplete}
        />

        {/* Main Transition Content */}
        <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-8 text-center">
          {/* Logo */}
          {showMainTransition && (
            <BlurFade delay={0.1} inView>
              <div className="mb-12">
                <ShowWorkLogo size="lg" variant="full" />
              </div>
            </BlurFade>
          )}

          {/* Main Content */}
          {showMainTransition && (
            <div className="max-w-2xl mx-auto">
          {!isComplete ? (
            <>
              {/* Progress Steps */}
              <BlurFade delay={0.3} inView>
                <div className="mb-12">
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Almost There!
                  </h1>
                  <p className="text-xl text-gray-300 mb-8">
                    We're finalizing your professional showcase...
                  </p>
                </div>
              </BlurFade>

              {/* Transition Steps */}
              <div className="space-y-6 mb-12">
                {transitionSteps.map((step, index) => (
                  <BlurFade key={index} delay={0.5 + index * 0.2} inView>
                    <div className={`flex items-center justify-center space-x-4 p-4 rounded-xl transition-all duration-500 ${
                      index <= currentStep 
                        ? 'bg-white/10 backdrop-blur-sm border border-white/20' 
                        : 'bg-gray-800/20'
                    }`}>
                      <div className={`p-3 rounded-full transition-all duration-500 ${
                        index <= currentStep 
                          ? 'bg-white/20' 
                          : 'bg-gray-700/50'
                      }`}>
                        <div className={`transition-all duration-500 ${
                          index <= currentStep ? step.color : 'text-gray-500'
                        }`}>
                          {index <= currentStep ? (
                            step.icon
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-600"></div>
                          )}
                        </div>
                      </div>
                      <div className="text-left flex-1">
                        <h3 className={`font-semibold transition-all duration-500 ${
                          index <= currentStep ? 'text-white' : 'text-gray-500'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm transition-all duration-500 ${
                          index <= currentStep ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {index <= currentStep && (
                        <div className="text-green-400">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                  </BlurFade>
                ))}
              </div>

              {/* Progress Bar */}
              <BlurFade delay={0.7} inView>
                <div className="w-full max-w-md mx-auto">
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
                      style={{ width: `${((currentStep + 1) / transitionSteps.length) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {Math.round(((currentStep + 1) / transitionSteps.length) * 100)}% Complete
                  </p>
                </div>
              </BlurFade>
            </>
          ) : (
            /* Completion State */
            <BlurFade delay={0.2} inView>
              <div className="text-center">
                <div className="mb-8">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
                    <Trophy className="w-10 h-10 text-white" />
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                    Welcome to Your
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                      Professional Dashboard
                    </span>
                  </h1>
                  <p className="text-xl text-gray-300 mb-8">
                    Your showcase is ready to make an impact!
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 text-blue-400">
                  <span className="text-lg font-medium">Taking you there</span>
                  <ArrowRight className="w-5 h-5 animate-bounce" style={{animationDelay: '0.5s'}} />
                </div>
              </div>
            </BlurFade>
          )}
            </div>
          )}
        </div>

        {/* User Info */}
        {user && showMainTransition && (
          <BlurFade delay={1.0} inView>
            <div className="absolute bottom-8 left-8 text-left">
              <p className="text-gray-400 text-sm">Welcome,</p>
              <p className="text-white font-semibold">{user.name}</p>
            </div>
          </BlurFade>
        )}
      </EnhancedTransitionBackground>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}