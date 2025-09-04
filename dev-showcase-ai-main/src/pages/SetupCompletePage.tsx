import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { BlurFade } from '../components/ui/blur-fade';

interface SetupCompletePageProps {
  userName?: string;
}

export default function SetupCompletePage({ userName = "Developer" }: SetupCompletePageProps) {
  const navigate = useNavigate();

  useEffect(() => {
    // Automatic redirection after 4 seconds
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center space-y-8">
        {/* Main Heading */}
        <BlurFade delay={0.25}>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100">
            All Set, {userName}!
          </h1>
        </BlurFade>

        {/* Subheading */}
        <BlurFade delay={0.50}>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            We're personalizing your dashboard...
          </p>
        </BlurFade>

        {/* Loading Spinner */}
        <BlurFade delay={0.75}>
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500 dark:text-slate-400" />
          </div>
        </BlurFade>
      </div>
    </div>
  );
}