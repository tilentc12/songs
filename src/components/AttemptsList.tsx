"use client";

import { Check, X, SkipForward, Target } from "lucide-react";
import { GuessAttempt } from "@/lib/types";

interface AttemptsListProps {
  attempts: GuessAttempt[];
  maxAttempts?: number;
  stages: number[];
}

export function AttemptsList({
  attempts,
  maxAttempts = 5,
  stages,
}: AttemptsListProps) {
  const slots = Array.from({ length: maxAttempts }, (_, i) => attempts[i] || null);

  return (
    <ol aria-label="Guess attempts" className="flex w-full flex-col gap-2">
      {slots.map((attempt, idx) => {
        if (!attempt) {
          return (
            <li
              key={idx}
              className="flex h-11 items-center gap-3 rounded-xl border border-dashed border-border/60 bg-surface/30 px-3.5 text-xs text-muted-foreground/40 font-mono transition-colors"
            >
              <span className="grid size-5 place-items-center rounded-full bg-border/40 text-[10px] font-bold">
                {idx + 1}
              </span>
              <span>—</span>
            </li>
          );
        }

        if (attempt.isCorrect) {
          const durationStr = stages[attempt.stageUnlocked] ? `${stages[attempt.stageUnlocked]}s` : "0.1s";

          if (attempt.isFranchiseMatch) {
            return (
              <li
                key={idx}
                className="flex h-11 items-center justify-between gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3.5 text-xs font-bold text-amber-400 shadow-sm animate-in fade-in zoom-in-95 duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="grid size-5 place-items-center rounded-full bg-amber-500 text-black text-[10px] font-black">
                    <Target className="size-3 stroke-[3]" />
                  </span>
                  <span className="truncate">{attempt.guessText} (Franchise Match)</span>
                </div>
                <span className="shrink-0 font-mono text-[11px] rounded-md bg-amber-500/20 px-2 py-0.5">
                  +50% Pts • {durationStr}
                </span>
              </li>
            );
          }

          return (
            <li
              key={idx}
              className="flex h-11 items-center justify-between gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 text-xs font-bold text-emerald-400 shadow-sm animate-in fade-in zoom-in-95 duration-200"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="grid size-5 place-items-center rounded-full bg-emerald-500 text-black text-[10px]">
                  <Check className="size-3 stroke-[3]" />
                </span>
                <span className="truncate">{attempt.guessText}</span>
              </div>
              <span className="shrink-0 font-mono text-[11px] rounded-md bg-emerald-500/20 px-2 py-0.5">
                {durationStr}
              </span>
            </li>
          );
        }

        if (attempt.isSkipped) {
          return (
            <li
              key={idx}
              className="flex h-11 items-center justify-between gap-3 rounded-xl border border-border/80 bg-card px-3.5 text-xs font-medium text-muted-foreground animate-in fade-in duration-150"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid size-5 place-items-center rounded-full bg-border text-muted-foreground text-[10px]">
                  <SkipForward className="size-3" />
                </span>
                <span className="italic">Skipped</span>
              </div>
            </li>
          );
        }

        // Wrong Guess
        return (
          <li
            key={idx}
            className="flex h-11 items-center justify-between gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 text-xs font-medium text-rose-300 animate-in fade-in duration-150"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid size-5 place-items-center rounded-full bg-rose-500/20 text-rose-400 text-[10px]">
                <X className="size-3 stroke-[3]" />
              </span>
              <span className="truncate">{attempt.guessText}</span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
