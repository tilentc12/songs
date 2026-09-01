"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Check, Clock, ArrowRight } from "lucide-react";
import { useGameEngine } from "@/hooks/useGameEngine";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SongSearchCombobox } from "@/components/SongSearchCombobox";
import { AttemptsList } from "@/components/AttemptsList";
import { ResultModal } from "@/components/ResultModal";
import { ProgressiveHintCard } from "@/components/ProgressiveHintCard";
import { AudioCockpitSidebar } from "@/components/AudioCockpitSidebar";
import { GameStatsSidebar } from "@/components/GameStatsSidebar";
import { StreakLossOverlay } from "@/components/StreakLossOverlay";
import { DifficultyTier, TIER_CONFIG } from "@/lib/types";

export default function DailyTierGamePage({
  params,
}: {
  params: Promise<{ tier: string }>;
}) {
  const { tier } = use(params);
  const router = useRouter();
  const validTier: DifficultyTier = ["easy", "medium", "hard", "expert", "impossible"].includes(tier)
    ? (tier as DifficultyTier)
    : "easy";

  const [timeUntilReset, setTimeUntilReset] = useState("");

  const {
    session,
    isLoadingSession,
    currentStage,
    currentDuration,
    stages,
    attempts,
    isGameOver,
    isWin,
    stageWon,
    pointsEarned,
    revealedTrack,
    challengeSeed,
    activeHints,
    noHintsMode,
    toggleNoHintsMode,
    sessionStreak,
    bestSessionStreak,
    careerBestStreak,
    wasStreakLost,
    lostStreakCount,
    resetStreakLoss,
    isDailyAlreadyPlayed,
    dailyRecord,
    searchTracks,
    audioProxyUrl,
    submitGuess,
    skipStage,
    giveUp,
  } = useGameEngine({
    mode: "daily",
    initialTier: validTier,
  });

  const {
    isPlaying,
    isLoading: isAudioLoading,
    isStalled: isAudioStalled,
    hasError: isAudioError,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    changeVolume,
    toggleMute,
    retry: retryAudio,
  } = useAudioPlayer({
    audioUrl: audioProxyUrl,
    maxDuration: currentDuration,
    isGameOver,
  });

  const tierConfig = TIER_CONFIG[validTier];

  // Daily reset timer calculation
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setUTCHours(24, 0, 0, 0);
      const diffMs = tomorrow.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const navigateToNextTier = () => {
    const tiers: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];
    const curIdx = tiers.indexOf(validTier);
    const nextTier = tiers[(curIdx + 1) % tiers.length];
    router.push(`/daily/${nextTier}`);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay, toggleMute]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8">
      {wasStreakLost && (
        <StreakLossOverlay
          lostStreak={lostStreakCount}
          onFinished={resetStreakLoss}
        />
      )}

      {/* Navigation Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <Link
          href="/daily"
          className="flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back to Daily Hub</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 rounded-full bg-surface border border-border px-3 py-1 text-xs font-mono font-bold text-muted-foreground">
            <Clock className="size-3.5 text-primary" />
            <span>Next in {timeUntilReset}</span>
          </div>

          <span
            style={{
              backgroundColor: `${tierConfig.color}20`,
              color: tierConfig.color,
              borderColor: `${tierConfig.color}40`,
            }}
            className="rounded-full border px-3 py-1 font-sans text-xs font-black uppercase tracking-wider"
          >
            {tierConfig.label} Daily
          </span>
        </div>
      </div>

      {/* Symmetrical 3-Column Luxury Game Center: Left 280px | Center 1fr | Right 280px */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_280px] gap-6 items-start">
        {/* Left Column: Audio Controls, No Hints & HUD */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <AudioCockpitSidebar
            volume={volume}
            isMuted={isMuted}
            noHintsMode={noHintsMode}
            isGameOver={isGameOver || isDailyAlreadyPlayed}
            attemptsCount={attempts.length}
            accentColor={tierConfig.color}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
            onToggleNoHints={toggleNoHintsMode}
          />
        </div>

        {/* Center Column: Gameplay Deck */}
        <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto">
          {/* Daily Lockout Alert if already completed today */}
          {isDailyAlreadyPlayed && dailyRecord ? (
            <div className="flex w-full flex-col items-center gap-4 rounded-3xl border border-border bg-card p-6 text-center shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95">
              <div className="grid size-14 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                <Check className="size-7 stroke-[3]" />
              </div>

              <div>
                <h2 className="text-xl font-black text-foreground">
                  Daily {tierConfig.label} Complete!
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  You already completed today&apos;s {tierConfig.label} challenge. Come back tomorrow for a new puzzle!
                </p>
              </div>

              <div className="w-full rounded-2xl bg-surface border border-border p-4 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold text-emerald-400">Solved in {dailyRecord.attempts} guesses</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Points Earned:</span>
                  <span style={{ color: tierConfig.color }} className="font-mono font-bold">
                    +{dailyRecord.points} pts
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-muted-foreground">Song:</span>
                  <span className="font-medium text-foreground truncate max-w-[200px]">
                    {dailyRecord.songTitle} - {dailyRecord.artist}
                  </span>
                </div>
              </div>

              <div className="flex w-full flex-col sm:flex-row gap-2 mt-2">
                <button
                  onClick={navigateToNextTier}
                  style={{ backgroundColor: tierConfig.color }}
                  className="flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl px-6 text-sm font-black text-black shadow-lg hover:brightness-110 active:scale-95 transition-all"
                >
                  <span>Next Daily Tier</span>
                  <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <AudioPlayer
                isPlaying={isPlaying}
                isLoading={isAudioLoading}
                isStalled={isAudioStalled}
                hasError={isAudioError}
                currentTime={currentTime}
                duration={duration}
                stages={stages}
                currentStage={currentStage}
                difficulty={validTier}
                volume={volume}
                isMuted={isMuted}
                isGameOver={isGameOver}
                coverUrl={revealedTrack?.coverUrl}
                songTitle={revealedTrack?.title}
                onTogglePlay={togglePlay}
                onVolumeChange={changeVolume}
                onToggleMute={toggleMute}
                onGiveUp={giveUp}
                onRetry={retryAudio}
              />

              <ProgressiveHintCard
                currentStage={currentStage}
                genre={activeHints.genre}
                decade={activeHints.decade}
                releaseYear={activeHints.releaseYear}
                artistMasked={activeHints.artistMasked}
                accentColor={tierConfig.color}
                isGameOver={isGameOver}
                noHintsMode={noHintsMode}
              />

              <div className="w-full max-w-md">
                <AttemptsList attempts={attempts} stages={stages} maxAttempts={5} />
              </div>

              {!isGameOver ? (
                <div className="w-full max-w-md">
                  <SongSearchCombobox
                    tracks={searchTracks}
                    onSubmitGuess={submitGuess}
                    onSkip={skipStage}
                    disabled={isGameOver || isLoadingSession}
                    accentColor={tierConfig.color}
                  />
                </div>
              ) : revealedTrack ? (
                <div className="w-full max-w-md">
                  <ResultModal
                    isOpen={isGameOver}
                    isWin={isWin}
                    stageWon={stageWon}
                    pointsEarned={pointsEarned}
                    revealedTrack={revealedTrack}
                    attempts={attempts}
                    stages={stages}
                    mode="daily"
                    difficulty={validTier}
                    accentColor={tierConfig.color}
                    puzzleNumber={session?.puzzleNumber}
                    currentStreak={sessionStreak}
                    challengeSeed={challengeSeed}
                    noHintsMode={noHintsMode}
                    isPlayingFullAudio={isPlaying}
                    onToggleFullAudio={togglePlay}
                    onNextSong={navigateToNextTier}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>

        {/* Right Column (280px fixed width) */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <GameStatsSidebar
            sessionStreak={sessionStreak}
            bestSessionStreak={bestSessionStreak}
            careerMaxStreak={careerBestStreak}
            sessionScore={0}
            roundsPlayed={1}
            challengeSeed={challengeSeed}
            accentColor={tierConfig.color}
            noHintsMode={noHintsMode}
            stages={stages}
          />
        </div>
      </div>
    </div>
  );
}
