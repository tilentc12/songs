"use client";

import { use, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useGameEngine } from "@/hooks/useGameEngine";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { AudioPlayer } from "@/components/AudioPlayer";
import { DifficultySelector } from "@/components/DifficultySelector";
import { SongSearchCombobox } from "@/components/SongSearchCombobox";
import { AttemptsList } from "@/components/AttemptsList";
import { ResultModal } from "@/components/ResultModal";
import { ProgressiveHintCard } from "@/components/ProgressiveHintCard";
import { AudioCockpitSidebar } from "@/components/AudioCockpitSidebar";
import { GameStatsSidebar } from "@/components/GameStatsSidebar";
import { StreakLossOverlay } from "@/components/StreakLossOverlay";
import { PLAYLISTS } from "@/lib/constants";
import { TIER_CONFIG } from "@/lib/types";

export default function PlaylistGamePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const info = PLAYLISTS.find((p) => p.slug === slug) || {
    slug,
    title: slug.toUpperCase(),
    icon: "🎵",
    description: "Curated Playlist Mode",
  };

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
    selectedDifficulty,
    sessionScore,
    sessionStreak,
    bestSessionStreak,
    careerBestStreak,
    wasStreakLost,
    lostStreakCount,
    resetStreakLoss,
    songsPlayedInSession,
    searchTracks,
    audioProxyUrl,
    submitGuess,
    skipStage,
    giveUp,
    nextSong,
    changeTier,
  } = useGameEngine({
    mode: "playlist",
    initialPlaylist: slug,
    initialTier: "easy",
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

  const tier = selectedDifficulty || session?.difficulty || "easy";
  const tierConfig = TIER_CONFIG[tier] || TIER_CONFIG.easy;

  // Global hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }

      if (e.key.toLowerCase() === "n" && isGameOver) {
        e.preventDefault();
        nextSong();
      } else if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === "m") {
        e.preventDefault();
        toggleMute();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGameOver, nextSong, togglePlay, toggleMute]);

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:py-8">
      {wasStreakLost && (
        <StreakLossOverlay
          lostStreak={lostStreakCount}
          onFinished={resetStreakLoss}
        />
      )}

      {/* Symmetrical 3-Column Luxury Game Center: Left 280px | Center 1fr | Right 280px */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_280px] gap-6 items-start">
        {/* Left Column: Audio Controls, No Hints & HUD (280px fixed width) */}
        <div className="hidden lg:block w-[280px] shrink-0">
          <AudioCockpitSidebar
            volume={volume}
            isMuted={isMuted}
            noHintsMode={noHintsMode}
            isGameOver={isGameOver}
            attemptsCount={attempts.length}
            accentColor={tierConfig.color}
            onVolumeChange={changeVolume}
            onToggleMute={toggleMute}
            onToggleNoHints={toggleNoHintsMode}
          />
        </div>

        {/* Center Column */}
        <div className="flex flex-col items-center gap-5 w-full max-w-xl mx-auto">
          {/* Header with Difficulty Selection */}
          <div className="flex w-full flex-col gap-4">
            <div className="flex w-full items-center justify-between border-b border-border/80 pb-3">
              <Link
                href="/playlists"
                className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="size-3.5" />
                <span>Playlists</span>
              </Link>

              <div className="flex items-center gap-2">
                <span className="text-base">{info.icon}</span>
                <h1 className="text-sm font-black text-foreground uppercase tracking-wider">
                  {info.title}
                </h1>
                <span
                  style={{
                    backgroundColor: `${tierConfig.color}20`,
                    color: tierConfig.color,
                    borderColor: `${tierConfig.color}40`,
                  }}
                  className="rounded-full border px-2.5 py-0.5 font-sans text-[10px] font-black uppercase tracking-wider ml-1"
                >
                  {tierConfig.label}
                </span>
              </div>

              <span className="font-mono text-xs font-bold text-muted-foreground">
                Round #{songsPlayedInSession + 1}
              </span>
            </div>

            {/* Difficulty Selector for Playlists */}
            <DifficultySelector
              selected={selectedDifficulty}
              onChange={changeTier}
              disabled={!isGameOver && attempts.length > 0}
            />
          </div>

          {/* Main Content */}
          {isLoadingSession ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <Loader2 className="size-10 animate-spin" style={{ color: tierConfig.color }} />
              <span className="text-xs font-semibold text-muted-foreground">
                Loading next {tierConfig.label} {info.title} track...
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
                difficulty={tier}
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
                    mode="playlist"
                    difficulty={tier}
                    accentColor={tierConfig.color}
                    currentStreak={sessionStreak}
                    challengeSeed={challengeSeed}
                    noHintsMode={noHintsMode}
                    isPlayingFullAudio={isPlaying}
                    onToggleFullAudio={togglePlay}
                    onNextSong={nextSong}
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
            sessionScore={sessionScore}
            roundsPlayed={songsPlayedInSession}
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
