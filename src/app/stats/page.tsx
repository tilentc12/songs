"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BarChart3,
  Flame,
  Trophy,
  Zap,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Download,
  Upload,
  Trash2,
  Clock,
  Music,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Disc3,
  ChevronRight,
} from "lucide-react";
import {
  getLocalStats,
  clearPlayedHistory,
  getDailyHistory,
  exportStatsToJson,
  importStatsFromJson,
  resetAllStats,
} from "@/lib/stats";
import { UserCareerStats, DifficultyTier, TIER_CONFIG } from "@/lib/types";
import { PLAYLISTS } from "@/lib/constants";
import { CoverArtwork } from "@/components/CoverArtwork";

const TIERS_ORDER: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return "Recently";
  try {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export default function CareerStatsPage() {
  const [stats, setStats] = useState<UserCareerStats | null>(null);
  const [dailyCount, setDailyCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const refreshStats = () => {
    const currentStats = getLocalStats();
    setStats(currentStats);
    const dailyHistory = getDailyHistory();
    setDailyCount(Object.values(dailyHistory).filter((v) => v.isWin).length);
  };

  useEffect(() => {
    refreshStats();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExport = () => {
    try {
      const jsonStr = exportStatsToJson();
      const blob = new Blob([jsonStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const today = new Date().toISOString().split("T")[0];
      const link = document.createElement("a");
      link.href = url;
      link.download = `better_song_guess_stats_${today}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast("Statistics JSON exported successfully!");
    } catch {
      showToast("Failed to export statistics.");
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importStatsFromJson(content);
      if (res.success) {
        refreshStats();
        showToast("Statistics imported successfully!");
      } else {
        showToast(`Import Error: ${res.error || "Invalid file format"}`);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsText(file);
  };

  const handleClearSongBuffer = () => {
    clearPlayedHistory();
    showToast("Song buffer reset! All previously heard songs can now replay.");
  };

  const handleConfirmResetAll = () => {
    resetAllStats();
    refreshStats();
    setShowResetConfirm(false);
    showToast("All career statistics and match history have been reset.");
  };

  if (!stats) return null;

  // Key Calculations
  const winRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
  const gamesLost = Math.max(0, stats.gamesPlayed - stats.gamesWon);
  const maxBarValue = Math.max(1, ...stats.distribution);
  const stageLabels = ["0.1s", "0.5s", "2.0s", "8.0s", "15.0s", "Failed"];
  const stageWeights = [0.1, 0.5, 2.0, 8.0, 15.0];

  // Average solve duration & average stage calculations
  let avgSecondsStr = "--";
  let avgStageStr = "--";
  if (stats.gamesWon > 0) {
    const totalSeconds =
      stats.totalSecondsSolved && stats.totalSecondsSolved > 0
        ? stats.totalSecondsSolved
        : stats.distribution.slice(0, 5).reduce((acc, count, i) => acc + count * stageWeights[i], 0);

    const avgSec = totalSeconds / stats.gamesWon;
    avgSecondsStr = avgSec < 1 ? `${avgSec.toFixed(2)}s` : `${avgSec.toFixed(1)}s`;

    const totalStages =
      stats.totalStageIndexWon && stats.totalStageIndexWon > 0
        ? stats.totalStageIndexWon
        : stats.distribution.slice(0, 5).reduce((acc, count, i) => acc + count * (i + 1), 0);

    const avgStage = totalStages / stats.gamesWon;
    avgStageStr = `Stage ${avgStage.toFixed(1)}`;
  }

  const recentMatches = stats.recentMatches || [];

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:py-12">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-primary/40 bg-card/95 px-4 py-3 text-sm font-bold text-foreground shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <Sparkles className="size-4 text-primary shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Stats Import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileImport}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
        <div className="flex items-center gap-3">
          <Link
            href="/play"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            <span>Back to Game</span>
          </Link>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <BarChart3 className="size-6 text-primary" />
              <span>Career Analytics</span>
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              All-time lifetime performance, streaks, mastery & match archives
            </p>
          </div>
        </div>

        {/* Action Buttons: Export / Import / Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            title="Export Career Statistics JSON"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface transition-all active:scale-95"
          >
            <Download className="size-3.5 text-primary" />
            <span>Export</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            title="Import Career Statistics JSON"
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface transition-all active:scale-95"
          >
            <Upload className="size-3.5 text-cyan-400" />
            <span>Import</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset All Career Statistics"
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/20 transition-all active:scale-95"
          >
            <Trash2 className="size-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* 1. Core Lifetime Stats Grid (Top HUD) */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3 text-center">
        {/* Total Points */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-5 border border-border/80 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 size-16 rounded-full bg-amber-500/5 blur-xl group-hover:bg-amber-500/10 transition-all" />
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Career Score</span>
            <Trophy className="size-4 text-amber-400" />
          </div>
          <div className="font-mono text-3xl font-black text-amber-400">
            {stats.totalPoints.toLocaleString()}
          </div>
          <div className="text-[11px] font-medium text-muted-foreground mt-1">
            All-Time Points Earned
          </div>
        </div>

        {/* Win Rate */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-5 border border-border/80 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 size-16 rounded-full bg-emerald-500/5 blur-xl group-hover:bg-emerald-500/10 transition-all" />
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Win Rate</span>
            <TrendingUp className="size-4 text-emerald-400" />
          </div>
          <div className="font-mono text-3xl font-black text-emerald-400">
            {winRate}%
          </div>
          <div className="text-[11px] font-medium text-muted-foreground mt-1">
            {stats.gamesWon} Wins · {gamesLost} Losses
          </div>
        </div>

        {/* Streaks */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-5 border border-border/80 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 size-16 rounded-full bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/10 transition-all" />
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Streaks</span>
            <Flame className="size-4 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-center justify-center gap-3 font-mono">
            <div>
              <span className="text-2xl font-black text-amber-400">{stats.currentStreak}</span>
              <span className="block text-[9px] font-bold text-muted-foreground uppercase">Active</span>
            </div>
            <div className="h-7 w-[1px] bg-border/80" />
            <div>
              <span className="text-2xl font-black text-cyan-400">{stats.maxStreak}</span>
              <span className="block text-[9px] font-bold text-muted-foreground uppercase">Peak</span>
            </div>
          </div>
          <div className="text-[11px] font-medium text-muted-foreground mt-1">
            Current vs Career Peak
          </div>
        </div>

        {/* Solve Speed */}
        <div className="flex flex-col justify-between rounded-3xl bg-card p-5 border border-border/80 shadow-lg relative overflow-hidden group">
          <div className="absolute -right-3 -top-3 size-16 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all" />
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
            <span>Avg Solve Speed</span>
            <Clock className="size-4 text-primary" />
          </div>
          <div className="font-mono text-3xl font-black text-primary">
            {avgSecondsStr}
          </div>
          <div className="text-[11px] font-medium text-muted-foreground mt-1">
            {avgStageStr} Average
          </div>
        </div>
      </div>

      {/* 2. Secondary Badges / Highlights */}
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center justify-between rounded-2xl bg-surface/80 p-4 border border-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-primary">
            <Zap className="size-4" />
            <span>Perfect 0.1s Solves</span>
          </div>
          <span className="font-mono text-lg font-black text-foreground">
            {stats.perfectGuesses}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-surface/80 p-4 border border-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Disc3 className="size-4" />
            <span>Total Games Played</span>
          </div>
          <span className="font-mono text-lg font-black text-foreground">
            {stats.gamesPlayed}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-surface/80 p-4 border border-border/60">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <CheckCircle2 className="size-4" />
            <span>Daily Solves Won</span>
          </div>
          <span className="font-mono text-lg font-black text-foreground">
            {dailyCount}
          </span>
        </div>
      </div>

      {/* 3. Guess Speed Distribution Histogram */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Solve Speed Distribution
            </h2>
            <p className="text-xs text-muted-foreground">
              Stage duration breakdown across all winning solves & conceded rounds
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-muted-foreground">
            {stats.gamesPlayed} Total Rounds
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {stats.distribution.map((count, idx) => {
            const label = stageLabels[idx];
            const isFailed = idx === 5;
            const percentOfMax = Math.max(6, Math.round((count / maxBarValue) * 100));
            const roundPercent = stats.gamesPlayed > 0 ? Math.round((count / stats.gamesPlayed) * 100) : 0;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                <span className="w-14 font-bold text-muted-foreground text-right shrink-0">
                  {label}
                </span>

                <div className="h-8 flex-1 overflow-hidden rounded-xl bg-surface border border-border/40 relative">
                  <div
                    style={{ width: count > 0 ? `${percentOfMax}%` : "0%" }}
                    className={`h-full flex items-center justify-between px-3 font-bold transition-all duration-500 ${
                      isFailed
                        ? "bg-rose-500/25 border-r border-rose-500/40 text-rose-300"
                        : idx === 0
                        ? "bg-primary text-black font-black"
                        : "bg-primary/30 border-r border-primary/50 text-foreground"
                    }`}
                  >
                    {count > 0 && <span>{count}</span>}
                    {count > 0 && <span className="text-[10px] opacity-80">{roundPercent}%</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Per-Difficulty Tier Mastery Grid */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Difficulty Tier Mastery
          </h2>
          <p className="text-xs text-muted-foreground">
            Win rate and points accumulated across all 5 difficulty levels
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {TIERS_ORDER.map((tier) => {
            const config = TIER_CONFIG[tier];
            const tierStat = stats.tierStats?.[tier] || { played: 0, won: 0, points: 0 };
            const tierWinRate =
              tierStat.played > 0 ? Math.round((tierStat.won / tierStat.played) * 100) : 0;

            return (
              <div
                key={tier}
                className="flex flex-col justify-between rounded-2xl bg-surface/80 p-4 border border-border/60 transition-all hover:border-border"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      style={{ color: config.color }}
                      className="text-xs font-black uppercase tracking-wider"
                    >
                      {config.label}
                    </span>
                    <span className="rounded-md bg-card px-1.5 py-0.5 text-[9px] font-mono font-bold text-muted-foreground">
                      {config.multiplier}x Pts
                    </span>
                  </div>

                  <div className="mt-2 flex items-baseline justify-between">
                    <span className="text-xs text-muted-foreground">Win Rate</span>
                    <span className="font-mono text-base font-black text-foreground">
                      {tierWinRate}%
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-card">
                    <div
                      style={{
                        width: `${tierWinRate}%`,
                        backgroundColor: config.color,
                      }}
                      className="h-full rounded-full transition-all duration-500"
                    />
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                  <span>{tierStat.won}/{tierStat.played} Won</span>
                  <span className="font-bold text-foreground">{tierStat.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Curated Playlists Performance */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4">
          <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
            Playlist Performance
          </h2>
          <p className="text-xs text-muted-foreground">
            Track-by-track success across era-based and genre playlists
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PLAYLISTS.map((playlist) => {
            const pStat = stats.playlistStats?.[playlist.slug] || { played: 0, won: 0, points: 0 };
            const pWinRate = pStat.played > 0 ? Math.round((pStat.won / pStat.played) * 100) : 0;

            return (
              <div
                key={playlist.slug}
                className="flex flex-col justify-between rounded-2xl bg-surface/80 p-4 border border-border/60 hover:border-border transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{playlist.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-foreground group-hover:text-primary transition-colors">
                        {playlist.title}
                      </h4>
                      <span className="text-[10px] text-muted-foreground">
                        {pStat.played} rounds played
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/playlists/${playlist.slug}`}
                    title="Play this playlist"
                    className="grid size-7 place-items-center rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-surface transition-all"
                  >
                    <ChevronRight className="size-4" />
                  </Link>
                </div>

                <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/40 text-[11px] font-mono">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Win Rate:</span>
                    <span className="font-bold text-emerald-400">{pWinRate}%</span>
                  </div>
                  <span className="font-bold text-foreground">{pStat.points} pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Recent Match History Archive Table */}
      <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-black uppercase tracking-wider text-foreground">
              Recent Match History
            </h2>
            <p className="text-xs text-muted-foreground">
              Last {recentMatches.length > 0 ? Math.min(recentMatches.length, 15) : 0} mystery songs played in this browser
            </p>
          </div>
          <span className="text-xs font-mono text-muted-foreground">
            {recentMatches.length} Recorded
          </span>
        </div>

        {recentMatches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
            <Music className="size-8 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-semibold">No recent songs recorded yet.</p>
            <p className="text-[11px] text-muted-foreground/70 mt-0.5">
              Jump into Unlimited or Playlist mode and play your first track!
            </p>
            <Link
              href="/play"
              className="mt-4 rounded-xl bg-primary px-4 py-2 text-xs font-black text-black hover:bg-primary/90 transition-all active:scale-95"
            >
              Start Playing Now
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {recentMatches.slice(0, 15).map((match) => {
              const tierColor = match.difficulty ? TIER_CONFIG[match.difficulty]?.color : "#10b981";

              return (
                <div
                  key={match.id}
                  className="flex items-center justify-between gap-3 rounded-2xl bg-surface/60 p-3 border border-border/40 hover:bg-surface/90 transition-all"
                >
                  {/* Track Artwork & Details */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="size-10 shrink-0 overflow-hidden rounded-xl border border-border/60 bg-card">
                      {match.coverUrl ? (
                        <CoverArtwork
                          coverUrl={match.coverUrl}
                          title={match.title}
                          artist={match.artist}
                          className="size-full"
                          roundedClassName="rounded-xl"
                        />
                      ) : (
                        <div className="grid size-full place-items-center text-muted-foreground">
                          <Music className="size-4" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="truncate text-xs font-black text-foreground">
                          {match.title}
                        </span>
                        {match.difficulty && (
                          <span
                            style={{ borderColor: `${tierColor}40`, color: tierColor }}
                            className="rounded-md border bg-card px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider shrink-0"
                          >
                            {match.difficulty}
                          </span>
                        )}
                        {match.playlist && (
                          <span className="rounded-md border border-border bg-card px-1.5 py-0.2 text-[9px] font-bold text-muted-foreground uppercase shrink-0">
                            {match.playlist}
                          </span>
                        )}
                      </div>
                      <p className="truncate text-[11px] text-muted-foreground">
                        {match.artist}
                      </p>
                    </div>
                  </div>

                  {/* Result, Points & Timestamp */}
                  <div className="flex items-center gap-3 shrink-0 text-right font-mono">
                    <div className="flex flex-col items-end">
                      {match.isWin ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black text-emerald-400">
                          <Zap className="size-3" />
                          <span>{match.durationLabel || "Solved"}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 text-[10px] font-black text-rose-400">
                          <XCircle className="size-3" />
                          <span>Failed</span>
                        </span>
                      )}
                      <span className="text-[10px] text-muted-foreground mt-0.5">
                        {formatRelativeTime(match.playedAt)}
                      </span>
                    </div>

                    <div className="w-14 text-right">
                      <span
                        className={`text-xs font-black ${
                          match.points > 0 ? "text-amber-400" : "text-muted-foreground"
                        }`}
                      >
                        +{match.points}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 7. Data Management Controls */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Reset Song Buffer */}
        <div className="flex items-center justify-between rounded-2xl bg-surface/80 p-4 border border-border/60">
          <div>
            <span className="text-xs font-black text-foreground block">
              No-Repeat Song Buffer
            </span>
            <span className="text-[11px] text-muted-foreground">
              Allow all previously heard songs to replay in shuffle
            </span>
          </div>
          <button
            onClick={handleClearSongBuffer}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-surface transition-colors shrink-0"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset Buffer</span>
          </button>
        </div>

        {/* Reset All Data Trigger */}
        <div className="flex items-center justify-between rounded-2xl bg-rose-500/5 p-4 border border-rose-500/20">
          <div>
            <span className="text-xs font-black text-rose-400 block">
              Reset All Career Data
            </span>
            <span className="text-[11px] text-muted-foreground">
              Wipe streaks, solve distribution and match history
            </span>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 rounded-xl border border-rose-500/40 bg-rose-500/15 px-3 py-1.5 text-xs font-bold text-rose-400 hover:bg-rose-500/25 transition-colors shrink-0"
          >
            <Trash2 className="size-3.5" />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-rose-500/40 bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-rose-400 mb-3">
              <div className="grid size-10 place-items-center rounded-2xl bg-rose-500/20">
                <ShieldAlert className="size-5" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-foreground">
                Reset All Statistics?
              </h3>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              This action will permanently wipe all lifetime points, current & peak streaks, solve speed distributions, tier mastery scores, and your entire match history.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-xl border border-border bg-surface px-4 py-2 text-xs font-bold text-foreground hover:bg-card transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmResetAll}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-black text-white hover:bg-rose-600 transition-colors"
              >
                <Trash2 className="size-3.5" />
                <span>Confirm Reset</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
