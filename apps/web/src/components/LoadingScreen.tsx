import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface LoadingScreenProps {
  onComplete: () => void;
  minDuration?: number;
}

export function LoadingScreen({ onComplete, minDuration = 1500 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / minDuration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setFadeOut(true);
        setTimeout(onComplete, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [minDuration, onComplete]);

  return (
    <div
      className={cn(
        'fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500',
        fadeOut && 'opacity-0 pointer-events-none'
      )}
    >
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-1000">
        {/* Logo */}
        <div className="relative group">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/5 p-2 shadow-2xl shadow-primary/10 transition-transform group-hover:scale-110">
            <img src="/logo.svg" alt="Medistore Logo" className="h-full w-full object-contain animate-pulse-subtle" />
          </div>
          {/* Decorative ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 animate-ping opacity-20" />
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tighter text-foreground uppercase">MEDISTORE</h2>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] opacity-60">HQ</p>
          </div>

          {/* Progress bar */}
          <div className="w-56 h-1 bg-muted/30 rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(var(--primary),0.5)]"
              style={{ width: `${progress}%` }}
            />
            {/* Wavy overlay effect */}
            <div className="absolute inset-0 wavy-pattern opacity-20" />
          </div>

          {/* Loading text */}
          <div className="flex items-center gap-2">
            <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <div className="h-1 w-1 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <div className="h-1 w-1 rounded-full bg-primary animate-bounce" />
            <p className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-widest ml-1">
              Initializing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
