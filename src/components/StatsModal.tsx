"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Trophy, Flame, Zap, BarChart3, RotateCcw, ExternalLink } from "lucide-react";
import { getLocalStats, clearPlayedHistory } from "@/lib/stats";
import { UserCareerStats } from "@/lib/types";

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StatsModal({ isOpen, onClose }: StatsModalProps) {
  const [stats, setStats] = useState<UserCareerStats | null>(null);
  const [clearedNotice, setClearedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStats(getLocalStats());
    }
  }, [isOpen]);

  if (!isOpen || !stats) return null;

  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const maxBarValue = Math.max(1, ...stats.distribution);
  const stageLabels = ["0.1s", "0.5s", "2.0s", "8.0s", "15.0s", "X"];

  const handleClearHistory = () => {
    if (confirm("Reset recent song history buffer? This allows all songs to replay in random shuffle.")) {
      clearPlayedHistory();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-4 top-4 grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 text-foreground">
          <BarChart3 className="size-5 text-primary" />
          <h2 className="text-lg font-black tracking-tight">Career Statistics</h2>
        </div>

        {/* 4-Box Key Metrics Grid */}
        <div className="mt-5 grid grid-cols-4 gap-2 text-center">
          <div className="rounded-2xl bg-surface p-3 border border-border/60">
            <span className="font-mono text-xl font-black text-foreground">{stats.gamesPlayed}</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Played
            </span>
          </div>

          <div className="rounded-2xl bg-surface p-3 border border-border/60">
            <span className="font-mono text-xl font-black text-emerald-400">{winRate}%</span>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Win Rate
            </span>
          </div>

          <div className="rounded-2xl bg-surface p-3 border border-border/60">
            <div className="flex items-center justify-center gap-0.5 font-mono text-xl font-black text-amber-400">
              <Flame className="size-4 fill-amber-400" />
              <span>{stats.currentStreak}</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Streak
            </span>
          </div>

          <div className="rounded-2xl bg-surface p-3 border border-border/60">
            <div className="flex items-center justify-center gap-0.5 font-mono text-xl font-black text-cyan-400">
              <Trophy className="size-4" />
              <span>{stats.maxStreak}</span>
            </div>
            <span className="mt-0.5 block text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Max Streak
            </span>
          </div>
        </div>

        {/* Lifetime Points Pill */}
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-primary/10 border border-primary/20 px-4 py-2.5">
          <span className="text-xs font-bold text-primary flex items-center gap-1.5">
            <Zap className="size-4" />
            All-Time Points
          </span>
          <span className="font-mono text-sm font-black text-foreground">
            {stats.totalPoints.toLocaleString()} pts
          </span>
        </div>

        {/* Guess Distribution Histogram */}
        <div className="mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Guess Distribution
          </h3>

          <div className="mt-3 flex flex-col gap-2">
            {stats.distribution.map((count, idx) => {
              const label = stageLabels[idx];
              const isFailed = idx === 5;
              const percent = Math.max(8, Math.round((count / maxBarValue) * 100));

              return (
                <div key={idx} className="flex items-center gap-2 text-xs font-mono">
                  <span className="w-9 font-bold text-muted-foreground text-right shrink-0">
                    {label}
                  </span>

                  <div className="h-6 flex-1 overflow-hidden rounded-md bg-surface border border-border/40">
                    <div
                      style={{ width: count > 0 ? `${percent}%` : "0%" }}
                      className={`h-full flex items-center justify-end px-2 font-bold transition-all duration-500 ${
                        isFailed
                          ? "bg-rose-500/30 text-rose-300"
                          : idx === 0
                          ? "bg-primary text-black font-black"
                          : "bg-primary/40 text-foreground"
                      }`}
                    >
                      {count > 0 && <span>{count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Link to Full Analytics Tab & Reset Cache */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
          <Link
            href="/stats"
            onClick={onClose}
            className="flex items-center gap-1 font-bold text-primary hover:underline"
          >
            <span>Full Analytics Hub</span>
            <ExternalLink className="size-3" />
          </Link>

          <button
            onClick={handleClearHistory}
            className="flex items-center gap-1 text-muted-foreground hover:text-rose-400 transition-colors"
          >
            <RotateCcw className="size-3" />
            <span>{clearedNotice ? "Buffer Reset!" : "Reset Buffer"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
