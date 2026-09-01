"use client";

import { useState } from "react";
import { Play, Pause, Flag, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { SegmentedProgressBar } from "./SegmentedProgressBar";
import { TurntableVinyl } from "./TurntableVinyl";
import { DifficultyTier, TIER_CONFIG } from "@/lib/types";
import { soundEffects } from "@/lib/soundEffects";

export interface AudioPlayerProps {
  isPlaying: boolean;
  isLoading: boolean;
  isStalled?: boolean;
  hasError?: boolean;
  currentTime: number;
  duration: number;
  stages: number[];
  currentStage: number;
  difficulty: DifficultyTier;
  volume: number;
  isMuted: boolean;
  isGameOver: boolean;
  coverUrl?: string;
  songTitle?: string;
  onTogglePlay: () => void;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onGiveUp?: () => void;
  onRetry?: () => void;
}

export function AudioPlayer({
  isPlaying,
  isLoading,
  isStalled = false,
  hasError = false,
  currentTime,
  duration,
  stages,
  currentStage,
  difficulty,
  isGameOver,
  coverUrl,
  songTitle,
  onTogglePlay,
  onGiveUp,
  onRetry,
}: AudioPlayerProps) {
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const tierConfig = TIER_CONFIG[difficulty] || TIER_CONFIG.easy;

  const unlockedSeconds = isGameOver
    ? stages[stages.length - 1] || 15
    : stages[currentStage] || 0.1;

  const progressPercent = duration > 0 ? currentTime / duration : 0;

  const handlePlayClick = () => {
    soundEffects.playNeedleDrop();
    onTogglePlay();
  };

  const showDiagnosticBanner = hasError || isStalled || autoplayBlocked;

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* 1. Sleek Vinyl Turntable Display */}
      <TurntableVinyl
        isPlaying={isPlaying}
        coverUrl={coverUrl}
        songTitle={songTitle}
        accentColor={tierConfig.color}
        progressPercent={progressPercent}
        snippetDuration={unlockedSeconds}
        isGameOver={isGameOver}
      />

      {/* 2. Linear Segmented Progress Timeline */}
      <div className="w-full max-w-md px-2">
        <SegmentedProgressBar
          stages={stages}
          currentStage={currentStage}
          currentTime={currentTime}
          duration={duration}
          accentColor={tierConfig.color}
          isGameOver={isGameOver}
        />
      </div>

      {/* 3. Resilient Error Diagnostics Banner with Concede & Skip Action */}
      {showDiagnosticBanner && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-200 animate-in fade-in zoom-in-95 max-w-md w-full shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="size-4 shrink-0 text-rose-400" />
            <span className="leading-snug">
              {autoplayBlocked
                ? "Browser paused audio. Click Play to unlock."
                : isStalled
                ? "Audio preview stalled (>8s timeout)."
                : "Audio preview failed to buffer or load."}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-1 rounded-xl bg-rose-500/20 px-2.5 py-1.5 text-[11px] font-bold text-rose-200 hover:bg-rose-500/30 active:scale-95 transition-all"
              >
                <RefreshCw className="size-3" />
                <span>Retry</span>
              </button>
            )}

            {!isGameOver && onGiveUp && (
              <button
                onClick={onGiveUp}
                title="Concede this round and skip to the next track (resets streak)"
                className="flex items-center gap-1 rounded-xl bg-rose-600/30 border border-rose-500/40 px-2.5 py-1.5 text-[11px] font-bold text-rose-100 hover:bg-rose-600/50 active:scale-95 transition-all"
              >
                <Flag className="size-3" />
                <span>Concede & Skip</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 4. Primary Centered Control Row */}
      <div className="flex w-full max-w-md items-center justify-between px-2 pt-1">
        {/* Left Spacer / Stage Info Badge */}
        <div className="flex items-center w-24">
          <span
            style={{
              color: tierConfig.color,
              borderColor: `${tierConfig.color}40`,
              backgroundColor: `${tierConfig.color}15`,
            }}
            className="rounded-full border px-2.5 py-1 text-[11px] font-mono font-bold"
          >
            {isGameOver ? "Full Track" : `${unlockedSeconds}s`}
          </span>
        </div>

        {/* Center: Hero Play/Pause Button */}
        <button
          onClick={handlePlayClick}
          disabled={isLoading && !isStalled}
          aria-label={
            showDiagnosticBanner
              ? "Audio error occurred"
              : isPlaying
              ? "Pause audio snippet"
              : `Play ${unlockedSeconds}s snippet (Spacebar)`
          }
          style={{
            backgroundColor: tierConfig.color,
            boxShadow: `0 8px 24px ${tierConfig.color}40`,
          }}
          className="relative grid size-16 place-items-center rounded-full text-black shadow-xl transition-all duration-200 hover:scale-105 hover:brightness-110 active:scale-95 disabled:opacity-60 focus:outline-none"
        >
          {isLoading && !isStalled ? (
            <Loader2 className="size-7 animate-spin text-black" />
          ) : isPlaying ? (
            <Pause className="size-7 fill-black text-black" />
          ) : (
            <Play className="size-7 fill-black text-black translate-x-0.5" />
          )}

          {/* Glowing pulse ring when playing */}
          {isPlaying && (
            <span
              style={{ borderColor: tierConfig.color }}
              className="absolute -inset-2 rounded-full border-2 animate-ping opacity-40 pointer-events-none"
            />
          )}
        </button>

        {/* Right: Give Up / Concede Action (Available whenever not Game Over) */}
        <div className="flex items-center justify-end w-24">
          {!isGameOver && onGiveUp ? (
            <button
              onClick={onGiveUp}
              title="Give up and reveal the song"
              className="flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-400 transition-all hover:bg-rose-500/20 active:scale-95"
            >
              <Flag className="size-3.5" />
              <span>Give Up</span>
            </button>
          ) : (
            <div className="w-16" />
          )}
        </div>
      </div>
    </div>
  );
}
