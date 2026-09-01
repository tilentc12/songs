"use client";

import { useEffect, useState } from "react";
import { Flame, X, RotateCcw } from "lucide-react";

interface StreakLossOverlayProps {
  lostStreak: number;
  onFinished?: () => void;
}

export function StreakLossOverlay({ lostStreak, onFinished }: StreakLossOverlayProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Graceful auto-dismiss after 2.8 seconds
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 2800);

    const finishTimer = setTimeout(() => {
      setIsVisible(false);
      onFinished?.();
    }, 3200);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinished]);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      onFinished?.();
    }, 300);
  };

  if (!isVisible || lostStreak <= 0) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3.5 rounded-2xl border border-rose-500/40 bg-card/95 px-5 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
        isExiting
          ? "opacity-0 -translate-y-4 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-toast-slide-in"
      }`}
    >
      {/* Extinguishing Flame Icon */}
      <div className="relative flex size-11 shrink-0 items-center justify-center rounded-xl bg-rose-500/20 border border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
        <Flame className="size-6 fill-rose-500 text-rose-500 animate-flame-extinguish" />
        <span className="absolute -top-1 -right-1 flex size-3">
          <span className="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping" />
          <span className="relative inline-flex size-3 rounded-full bg-rose-500" />
        </span>
      </div>

      {/* Message Text */}
      <div className="flex flex-col pr-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black uppercase tracking-wider text-rose-400">
            Streak Lost
          </span>
          <span className="rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-mono font-bold text-rose-300">
            {lostStreak}x
          </span>
        </div>
        <span className="text-sm font-black text-foreground tracking-tight">
          Streak of {lostStreak} lost!
        </span>
        <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
          <RotateCcw className="size-3 text-primary inline" />
          Start a new streak now.
        </span>
      </div>

      {/* Close button */}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        className="ml-2 grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
