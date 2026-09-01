"use client";

import { useState } from "react";
import {
  Play,
  Pause,
  ExternalLink,
  ArrowRight,
  Flame,
  Check,
  Zap,
  Link2,
  Target,
} from "lucide-react";
import { TrackSummary, GuessAttempt, DifficultyTier, GameMode, TIER_CONFIG } from "@/lib/types";
import { CoverArtwork } from "./CoverArtwork";

interface ResultModalProps {
  isOpen: boolean;
  isWin: boolean;
  stageWon: number | null;
  pointsEarned: number;
  revealedTrack: TrackSummary;
  attempts: GuessAttempt[];
  stages: number[];
  mode: GameMode;
  difficulty?: DifficultyTier;
  accentColor?: string;
  puzzleNumber?: number;
  currentStreak: number;
  challengeSeed?: string | null;
  noHintsMode?: boolean;
  isPlayingFullAudio: boolean;
  onToggleFullAudio: () => void;
  onNextSong: () => void;
}

export function ResultModal({
  isOpen,
  isWin,
  stageWon,
  pointsEarned,
  revealedTrack,
  attempts,
  stages,
  mode,
  difficulty,
  accentColor,
  puzzleNumber,
  currentStreak,
  challengeSeed,
  noHintsMode = false,
  isPlayingFullAudio,
  onToggleFullAudio,
  onNextSong,
}: ResultModalProps) {
  const [copiedChallenge, setCopiedChallenge] = useState(false);

  if (!isOpen) return null;

  const resolvedAccent =
    accentColor || (difficulty ? TIER_CONFIG[difficulty]?.color : undefined) || "#10b981";

  const durationStr = stageWon !== null ? `${stages[stageWon]}s` : "X";
  const challengeUrl = challengeSeed
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/challenge/${challengeSeed}`
    : undefined;

  const isFranchiseMatch = attempts.some((a) => a.isFranchiseMatch && a.isCorrect);

  // Pro mode speed bonus detection: stages[0] <= 0.2 means Pro mode (0.1s start)
  const isProMode = stages && stages.length > 0 ? stages[0] <= 0.2 : true;
  const hasSpeedBonus = isWin && isProMode && stageWon !== null && stageWon <= 2;
  const hasNoHintsBonus = isWin && Boolean(noHintsMode);
  const totalBonusPercent = (hasNoHintsBonus ? 25 : 0) + (hasSpeedBonus ? 5 : 0);

  const bonusParts: string[] = [];
  if (hasNoHintsBonus) bonusParts.push("⚡ +25% No Hints");
  if (hasSpeedBonus) bonusParts.push("🚀 +5% Pro Speed");

  const handleCopyChallenge = async () => {
    if (!challengeUrl) return;
    try {
      await navigator.clipboard.writeText(challengeUrl);
      setCopiedChallenge(true);
      setTimeout(() => setCopiedChallenge(false), 2500);
    } catch {}
  };

  return (
    <div className="w-full rounded-3xl border border-border bg-card/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
      {/* Header Banner */}
      <div className="flex flex-col items-center text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {isFranchiseMatch ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-3 py-1 text-xs font-black text-amber-400">
              <Target className="size-3.5" /> FRANCHISE MATCH (+50% PTS)
            </span>
          ) : isWin ? (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black text-emerald-400">
              <Check className="size-3.5" /> GUESSED IN {durationStr}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-black text-rose-400">
              OUT OF ATTEMPTS
            </span>
          )}

          {pointsEarned > 0 && (
            <span
              style={{
                backgroundColor: `${resolvedAccent}20`,
                borderColor: `${resolvedAccent}40`,
                color: resolvedAccent,
              }}
              className="rounded-full border px-3 py-1 font-mono text-xs font-black flex items-center gap-1"
            >
              +{pointsEarned} pts
            </span>
          )}
        </div>

        {/* Combined % Bonus Breakdown Pill */}
        {totalBonusPercent > 0 && !isFranchiseMatch && (
          <div className="mt-2.5 flex items-center justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 shadow-sm backdrop-blur-md animate-in fade-in duration-300">
              <Zap className="size-3.5 fill-amber-400" />
              <span>+{totalBonusPercent}% Bonus</span>
              {bonusParts.length > 0 && (
                <span className="text-[11px] font-medium text-amber-300/90 ml-0.5">
                  ({bonusParts.join(" • ")})
                </span>
              )}
            </span>
          </div>
        )}

        {currentStreak > 1 && (
          <div className="mt-2 flex items-center gap-1 text-xs font-bold text-amber-400">
            <Flame className="size-3.5 fill-amber-400" />
            <span>{currentStreak} Streak!</span>
          </div>
        )}
      </div>

      {/* Album Artwork & Details */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-5 rounded-2xl bg-surface/80 p-4 border border-border/60">
        {/* Cover Art Tile with Play Overlay & Robust Fallback */}
        <div className="relative group size-28 sm:size-32 shrink-0 overflow-hidden rounded-xl bg-card shadow-lg border border-border/60">
          <CoverArtwork
            coverUrl={revealedTrack.coverUrl}
            title={revealedTrack.title}
            artist={revealedTrack.artist}
            className="size-full transition-transform duration-300 group-hover:scale-105"
            roundedClassName="rounded-xl"
            priority
          />

          {/* Full Audio Play/Pause Button Overlay */}
          <button
            onClick={onToggleFullAudio}
            aria-label={isPlayingFullAudio ? "Pause preview" : "Play full 30s preview"}
            className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20"
          >
            <div
              style={{ backgroundColor: resolvedAccent }}
              className="grid size-12 place-items-center rounded-full text-black shadow-xl"
            >
              {isPlayingFullAudio ? <Pause className="size-5" /> : <Play className="size-5 ml-0.5" />}
            </div>
          </button>
        </div>

        {/* Song Info */}
        <div className="flex flex-col text-center sm:text-left min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug truncate">
            {revealedTrack.title}
          </h2>
          <p
            style={{ color: resolvedAccent }}
            className="text-base font-semibold truncate"
          >
            {revealedTrack.artist}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-[11px] text-muted-foreground">
            {revealedTrack.releaseYear && (
              <span className="rounded-md bg-card px-2 py-0.5 border border-border">
                {revealedTrack.releaseYear}
              </span>
            )}
            {revealedTrack.genre && (
              <span className="rounded-md bg-card px-2 py-0.5 uppercase tracking-wide border border-border">
                {revealedTrack.genre}
              </span>
            )}
            {revealedTrack.album && revealedTrack.album !== revealedTrack.title && (
              <span className="max-w-[200px] truncate rounded-md bg-card px-2 py-0.5 border border-border">
                {revealedTrack.album}
              </span>
            )}
          </div>

          {/* External Streaming Links */}
          <div className="mt-3 flex items-center justify-center sm:justify-start gap-3">
            {revealedTrack.spotifyUrl && (
              <a
                href={revealedTrack.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#1DB954] hover:underline font-medium"
              >
                <span>Spotify</span>
                <ExternalLink className="size-3" />
              </a>
            )}
            {revealedTrack.appleUrl && (
              <a
                href={revealedTrack.appleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-[#FC3C44] hover:underline font-medium"
              >
                <span>Apple Music</span>
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        {/* Next Song Button (Dynamic Accent Color) */}
        <button
          onClick={onNextSong}
          style={{
            backgroundColor: resolvedAccent,
            boxShadow: `0 10px 25px -5px ${resolvedAccent}50`,
          }}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl px-6 text-sm font-black text-black transition-all hover:brightness-110 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
        >
          <span>Next Song</span>
          <span className="rounded bg-black/20 px-1.5 py-0.5 font-mono text-xs">N</span>
          <ArrowRight className="size-4" />
        </button>

        {/* Challenge Friend Link */}
        {challengeUrl && (
          <button
            onClick={handleCopyChallenge}
            title="Copy seed link to challenge a friend"
            className="flex h-12 items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-4 text-xs font-bold text-muted-foreground transition-all hover:text-foreground active:scale-95 w-full sm:w-auto"
          >
            {copiedChallenge ? <Check className="size-4 text-emerald-400" /> : <Link2 className="size-4" />}
            <span className="hidden sm:inline">{copiedChallenge ? "Copied Link!" : "Challenge"}</span>
          </button>
        )}
      </div>
    </div>
  );
}
