"use client";

import Link from "next/link";
import { Check, ArrowRight, Play, Flame, Trophy } from "lucide-react";
import { DifficultyTier, TIER_CONFIG } from "@/lib/types";
import { DailySolveRecord } from "@/lib/stats";

interface DailyTierCardProps {
  tier: DifficultyTier;
  dateStr: string;
  solveRecord?: DailySolveRecord;
}

export function DailyTierCard({
  tier,
  dateStr,
  solveRecord,
}: DailyTierCardProps) {
  const config = TIER_CONFIG[tier];
  const isSolved = solveRecord?.isWin;
  const isPlayed = !!solveRecord;

  return (
    <Link
      href={`/daily/${tier}`}
      style={{
        borderColor: isSolved ? `${config.color}60` : undefined,
      }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-5 sm:p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-xl hover:scale-[1.01]"
    >
      {/* Top tier pill & status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            style={{ backgroundColor: `${config.color}20`, color: config.color }}
            className="rounded-full px-3 py-1 font-sans text-xs font-black uppercase tracking-wider"
          >
            {config.label}
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {config.multiplier}x Multiplier
          </span>
        </div>

        {isSolved ? (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
            <Check className="size-3 stroke-[3]" />
            <span>Solved</span>
          </span>
        ) : isPlayed ? (
          <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-[11px] font-bold text-rose-400">
            Finished
          </span>
        ) : (
          <span className="rounded-full bg-surface border border-border px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
            Ready
          </span>
        )}
      </div>

      {/* Description / Solved Info */}
      <div className="my-4">
        {isSolved ? (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground truncate">
              {solveRecord.songTitle}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {solveRecord.artist}
            </span>
            <span className="mt-1 font-mono text-[11px] text-emerald-400">
              +{solveRecord.points} points earned
            </span>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground line-clamp-2">
            {config.description}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-border/40">
        <span className="text-[11px] font-mono text-muted-foreground/60">
          {dateStr}
        </span>

        <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
          {isPlayed ? "View Result" : "Play Today"}
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
