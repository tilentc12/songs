"use client";

import { Sparkles, Calendar, Music2, UserCheck, ShieldAlert } from "lucide-react";

interface ProgressiveHintCardProps {
  currentStage: number; // 0..4
  genre?: string;
  decade?: string;
  releaseYear?: number;
  artistMasked?: string;
  accentColor?: string;
  isGameOver?: boolean;
  noHintsMode?: boolean;
}

export function ProgressiveHintCard({
  currentStage,
  genre,
  decade,
  releaseYear,
  artistMasked,
  accentColor = "#10b981",
  isGameOver = false,
  noHintsMode = false,
}: ProgressiveHintCardProps) {
  if (isGameOver) return null;

  if (noHintsMode) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-2 text-xs font-black text-rose-400 shadow-md backdrop-blur-md animate-in fade-in duration-200">
        <ShieldAlert className="size-4" />
        <span>NO HINTS MODE ACTIVE • HARDCORE (+25% BONUS PTS)</span>
      </div>
    );
  }

  if (currentStage === 0) {
    return (
      <div className="flex items-center justify-center gap-2 rounded-2xl border border-border/50 bg-card/40 px-4 py-2 text-xs font-semibold text-muted-foreground/80 backdrop-blur-md">
        <Sparkles className="size-3.5 text-amber-400" />
        <span>Stage 1: Solve in 0.1s for a Perfect 5x Score!</span>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
      {/* Hint 1: Era / Decade */}
      {currentStage >= 1 && (decade || releaseYear) && (
        <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md">
          <Calendar className="size-3.5" style={{ color: accentColor }} />
          <span>{releaseYear ? `Released ${releaseYear}` : `${decade?.toUpperCase()} Era`}</span>
        </div>
      )}

      {/* Hint 2: Genre */}
      {currentStage >= 2 && genre && (
        <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur-md capitalize">
          <Music2 className="size-3.5" style={{ color: accentColor }} />
          <span>{genre}</span>
        </div>
      )}

      {/* Hint 3: Masked Artist Name */}
      {currentStage >= 3 && artistMasked && (
        <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-3 py-1.5 text-xs font-mono font-bold text-foreground shadow-sm backdrop-blur-md">
          <UserCheck className="size-3.5 text-cyan-400" />
          <span>Artist: {artistMasked}</span>
        </div>
      )}
    </div>
  );
}
