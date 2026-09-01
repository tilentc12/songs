"use client";

import { useState } from "react";
import { Flame, Trophy, Share2, Link2, Check, Zap, Sparkles, Rocket } from "lucide-react";

interface GameStatsSidebarProps {
  sessionStreak: number;
  bestSessionStreak: number;
  careerMaxStreak: number;
  sessionScore: number;
  roundsPlayed: number;
  challengeSeed?: string | null;
  accentColor?: string;
  noHintsMode?: boolean;
  isCasual?: boolean;
  stages?: number[];
}

export function GameStatsSidebar({
  sessionStreak,
  bestSessionStreak,
  careerMaxStreak,
  sessionScore,
  roundsPlayed,
  challengeSeed,
  accentColor = "#10b981",
  noHintsMode = false,
  isCasual = false,
  stages = [0.1, 0.5, 2.0, 8.0, 15.0],
}: GameStatsSidebarProps) {
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  const handleCopyChallenge = async () => {
    if (!challengeSeed) return;
    try {
      const url = `${window.location.origin}/challenge/${challengeSeed}`;
      await navigator.clipboard.writeText(url);
      setCopiedChallenge(true);
      setTimeout(() => setCopiedChallenge(false), 2500);
    } catch {}
  };

  const streakBadge =
    sessionStreak >= 5
      ? "Super Streak ⚡"
      : sessionStreak >= 3
      ? "Hot Streak 🔥"
      : "Active Run";

  // Calculate live combined % bonus rates for the active session
  const isProMode = stages && stages.length > 0 ? stages[0] <= 0.2 : !isCasual;
  const noHintsBonus = noHintsMode ? 25 : 0;
  const proSpeedBonus = isProMode ? 5 : 0;
  const totalCombinedBonus = noHintsBonus + proSpeedBonus;

  return (
    <aside className="flex flex-col gap-4 w-full select-none">
      {/* 1. Dual Streak HUD */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-3">
          Dual Streak Tracker
        </span>

        <div className="grid grid-cols-2 gap-3">
          {/* Current Session Streak */}
          <div
            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
              sessionStreak > 0
                ? "bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-sm"
                : "bg-surface/50 border-border/60 text-muted-foreground"
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Flame className={`size-4 ${sessionStreak > 0 ? "fill-amber-400 animate-pulse" : ""}`} />
              <span className="text-[10px] font-black uppercase tracking-wider">Session</span>
            </div>
            <span className="font-mono text-2xl font-black text-foreground">{sessionStreak}</span>
            <span
              className={`mt-1 rounded-full px-2 py-0.5 text-[9px] font-bold ${
                sessionStreak > 0
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-muted-foreground"
              }`}
            >
              {streakBadge}
            </span>
          </div>

          {/* Career Record Max Streak */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/60 bg-surface/50 text-muted-foreground">
            <div className="flex items-center gap-1.5 mb-1">
              <Trophy className="size-4 text-cyan-400" />
              <span className="text-[10px] font-black uppercase tracking-wider">Record</span>
            </div>
            <span className="font-mono text-2xl font-black text-foreground">
              {Math.max(careerMaxStreak, bestSessionStreak)}
            </span>
            <span className="mt-1 text-[9px] font-bold text-muted-foreground">Career Peak</span>
          </div>
        </div>
      </div>

      {/* 2. Session Metrics with Live Combined % Bonus Display */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-3">
          Session Metrics
        </span>

        <div className="flex items-center justify-between pb-2.5 border-b border-border/60">
          <span className="text-xs font-semibold text-muted-foreground">Total Points</span>
          <span className="font-mono text-base font-black text-primary">{sessionScore} pts</span>
        </div>

        <div className="flex items-center justify-between py-2.5 border-b border-border/60">
          <span className="text-xs font-semibold text-muted-foreground">Rounds Completed</span>
          <span className="font-mono text-sm font-bold text-foreground">#{roundsPlayed}</span>
        </div>

        {/* Live Active Combined % Multiplier HUD */}
        <div className="pt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
              <Zap className="size-3.5 text-amber-400 fill-amber-400" />
              <span>Combined Bonus</span>
            </span>
            <span
              style={{
                color: totalCombinedBonus > 0 ? "#facc15" : undefined,
              }}
              className={`font-mono text-xs font-black ${
                totalCombinedBonus > 0 ? "text-amber-400" : "text-muted-foreground"
              }`}
            >
              +{totalCombinedBonus}% Total
            </span>
          </div>

          {/* Detailed Sub-Bonuses Breakdown */}
          <div className="flex flex-wrap items-center gap-1.5 mt-1">
            {noHintsMode && (
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                <Sparkles className="size-2.5" />
                <span>+25% No Hints</span>
              </span>
            )}
            {isProMode && (
              <span className="inline-flex items-center gap-1 rounded-md bg-cyan-500/15 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
                <Rocket className="size-2.5" />
                <span>+5% Pro Speed (≤2s)</span>
              </span>
            )}
            {!noHintsMode && !isProMode && (
              <span className="text-[10px] text-muted-foreground/80">
                Standard Scoring (No active modifiers)
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Challenge a Friend Card */}
      <div className="rounded-3xl border border-cyan-500/30 bg-cyan-500/5 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-400">
            <Share2 className="size-3.5" />
          </div>
          <span className="text-xs font-black text-foreground">Challenge a Friend</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Think your friends can guess this mystery song in 0.1s?
        </p>

        <button
          onClick={handleCopyChallenge}
          disabled={!challengeSeed}
          className="mt-3 flex h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/15 text-xs font-bold text-cyan-300 transition-all hover:bg-cyan-500/25 active:scale-95 disabled:opacity-40"
        >
          {copiedChallenge ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
          <span>{copiedChallenge ? "Link Copied!" : "Copy Challenge Link"}</span>
        </button>
      </div>

      {/* 4. Quick Milestones */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground block mb-2.5">
          Milestones
        </span>
        <div className="grid grid-cols-2 gap-2">
          <div
            className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold ${
              sessionScore >= 50
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-surface/40 border-border/40 text-muted-foreground/50 opacity-60"
            }`}
          >
            <Zap className="size-3.5 shrink-0" />
            <span className="truncate">50+ Points</span>
          </div>

          <div
            className={`flex items-center gap-1.5 p-2 rounded-xl border text-[11px] font-bold ${
              sessionStreak >= 3
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                : "bg-surface/40 border-border/40 text-muted-foreground/50 opacity-60"
            }`}
          >
            <Flame className="size-3.5 shrink-0" />
            <span className="truncate">Hot Streak</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
