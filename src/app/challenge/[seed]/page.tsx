"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { useGameEngine } from "@/hooks/useGameEngine";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { SongSearchCombobox } from "@/components/SongSearchCombobox";
import { AttemptsList } from "@/components/AttemptsList";
import { ResultModal } from "@/components/ResultModal";
import { ProgressiveHintCard } from "@/components/ProgressiveHintCard";
import { TIER_CONFIG } from "@/lib/types";

export default function ChallengeSeedPage({
  params,
}: {
  params: Promise<{ seed: string }>;
}) {
  const { seed } = use(params);

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
    selectedDifficulty,
    activeHints,
    noHintsMode,
    searchTracks,
    audioProxyUrl,
    submitGuess,
    skipStage,
    giveUp,
  } = useGameEngine({
    mode: "challenge",
    initialSeed: seed,
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

  const tierConfig = TIER_CONFIG[selectedDifficulty] || TIER_CONFIG.easy;

  // Spacebar toggle playback
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
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [togglePlay]);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-between px-4 py-6 sm:py-8">
      {/* Top Header */}
      <div className="flex w-full items-center justify-between border-b border-border/80 pb-3">
        <Link
          href="/play"
          className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-1.5 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" />
          <span>Play Unlimited</span>
        </Link>

        <div className="flex items-center gap-2">
          <Sparkles className="size-3.5 text-cyan-400" />
          <span className="rounded-full bg-cyan-500/15 border border-cyan-500/30 px-3 py-0.5 font-sans text-xs font-black text-cyan-400 uppercase tracking-wider">
            Friend Challenge
          </span>
        </div>
      </div>

      {/* Main Game Screen */}
      <div className="my-6 flex w-full flex-col items-center gap-5">
        {isLoadingSession ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-10 animate-spin text-cyan-400" />
            <span className="text-xs font-semibold text-muted-foreground">
              Loading mystery challenge song...
            </span>
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
              difficulty={selectedDifficulty}
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
                  mode="challenge"
                  difficulty={selectedDifficulty}
                  currentStreak={0}
                  challengeSeed={seed}
                  isPlayingFullAudio={isPlaying}
                  onToggleFullAudio={togglePlay}
                  onNextSong={() => {
                    if (typeof window !== "undefined") window.location.href = "/play";
                  }}
                />
              </div>
            ) : null}
          </>
        )}
      </div>

      <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
        You are playing a custom seed challenge sent by a friend
      </p>
    </div>
  );
}
