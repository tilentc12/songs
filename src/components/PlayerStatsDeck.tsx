"use client";

import { Flame, Trophy, Target, Zap, Share2, Sparkles, AlertTriangle } from "lucide-react";
import { useState } from "react";

interface PlayerStatsDeckProps {
  sessionStreak: number;
  careerBestStreak: number;
  sessionScore: number;
  songsPlayed: number;
  wasStreakLost?: boolean;
  accentColor?: string;
  onShareChallenge?: () => void;
}

export function PlayerStatsDeck({
  sessionStreak,
  careerBestStreak,
  sessionScore,
  songsPlayed,
  wasStreakLost = false,
  accentColor = "#10b981",
  onShareChallenge,
}: PlayerStatsDeckProps) {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    if (onShareChallenge) {
      onShareChallenge();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const accuracy = songsPlayed > 0 ? Math.round((sessionStreak / songsPlayed) * 100) : 100;

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Streak Loss Alert Banner */}
      {wasStreakLost && (
        <div className="rounded-3xl border border-rose-500/50 bg-rose-500/15 p-4 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-2xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="size-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-400 uppercase tracking-wider">
                Streak Extinguished!
              </h4>
              <p className="text-[11px] text-rose-300/80">
                Session streak reset to 0. Bounce back!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dual Streak Command HUD */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Flame className="size-3.5 text-amber-400 fill-amber-400" />
            Dual Streak HUD
          </span>
          <span className="font-mono text-[10px] text-muted-foreground">
            Async Sync
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2.5">
          {/* Streak 1: Active Session Run */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-center transition-all">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
              Session Run
            </span>
            <div className="mt-1 flex items-center gap-1">
              <Flame className={`size-4 ${sessionStreak > 0 ? "fill-amber-400 text-amber-400 animate-pulse" : "text-muted-foreground"}`} />
              <span className="font-mono text-2xl font-black text-foreground">
                {sessionStreak}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              Current streak
            </span>
          </div>

          {/* Streak 2: All-Time Career Best */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-surface/80 p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Career Best
            </span>
            <div className="mt-1 flex items-center gap-1">
              <Trophy className="size-4 text-primary" />
              <span className="font-mono text-2xl font-black text-foreground">
                {careerBestStreak}
              </span>
            </div>
            <span className="text-[10px] text-muted-foreground mt-0.5">
              All-time record
            </span>
          </div>
        </div>
      </div>

      {/* Session Progress Card */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-2.5 border-b border-border/40">
          <span className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <Target className="size-3.5 text-primary" />
            Session Metrics
          </span>
          <span className="font-mono text-xs font-bold text-primary">
            {sessionScore} pts
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">Songs Played</span>
            <span className="font-mono font-bold text-foreground">{songsPlayed}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground text-[11px]">Session Score</span>
            <span className="font-mono font-bold text-foreground">{sessionScore} pts</span>
          </div>
        </div>
      </div>

      {/* Challenge a Friend Card */}
      {onShareChallenge && (
        <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="size-3.5 text-amber-400" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Challenge A Friend
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mb-3">
            Share this exact mystery song seed with friends and compare solve stages!
          </p>

          <button
            onClick={handleShareClick}
            className="flex w-full h-10 items-center justify-center gap-1.5 rounded-xl border border-border bg-surface px-3 text-xs font-bold text-foreground hover:bg-card active:scale-95 transition-all"
          >
            <Share2 className="size-3.5" />
            <span>{copied ? "Seed Copied to Clipboard!" : "Copy Challenge Link"}</span>
          </button>
        </div>
      )}
    </div>
  );
}
