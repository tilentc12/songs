"use client";

import { ShieldAlert, Sparkles, Keyboard, Lock } from "lucide-react";
import { SleekVolumeSlider } from "./SleekVolumeSlider";
import { soundEffects } from "@/lib/soundEffects";

interface AudioCockpitSidebarProps {
  volume: number;
  isMuted: boolean;
  noHintsMode: boolean;
  isGameOver?: boolean;
  attemptsCount?: number;
  accentColor?: string;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
  onToggleNoHints: () => void;
}

export function AudioCockpitSidebar({
  volume,
  isMuted,
  noHintsMode,
  isGameOver = false,
  attemptsCount = 0,
  accentColor = "#10b981",
  onVolumeChange,
  onToggleMute,
  onToggleNoHints,
}: AudioCockpitSidebarProps) {
  // Strict 2-way lock: Once guessing starts in an active round, mode cannot be switched either ON or OFF
  const isLocked = !isGameOver && attemptsCount > 0;

  const handleNoHintsToggle = () => {
    if (isLocked) {
      soundEffects.playWrong?.();
      return;
    }
    soundEffects.playToggle(!noHintsMode);
    onToggleNoHints();
  };

  return (
    <aside className="flex flex-col gap-4 w-full select-none">
      {/* 1. Hardcore "No Hints" Challenge Switch with Active Round Lock */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl transition-all">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <ShieldAlert
                className={`size-4 ${noHintsMode ? "text-rose-400" : "text-muted-foreground"}`}
              />
              <span className="text-xs font-black uppercase tracking-wider text-foreground">
                No Hints Mode
              </span>
              {isLocked && (
                <span
                  title="Locked during active round"
                  className="flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-400"
                >
                  <Lock className="size-2.5" />
                  <span>Locked</span>
                </span>
              )}
            </div>
            <p className="text-[11px] text-muted-foreground leading-snug">
              {noHintsMode
                ? "Hardcore pure guessing enabled (clues concealed)."
                : "Normal mode with progressive clues enabled."}
            </p>
          </div>

          <button
            onClick={handleNoHintsToggle}
            disabled={isLocked}
            aria-label="Toggle No Hints Mode"
            style={{
              backgroundColor: noHintsMode ? "#f43f5e" : undefined,
            }}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              noHintsMode ? "" : "bg-surface"
            } ${isLocked ? "cursor-not-allowed opacity-75" : ""}`}
          >
            <span
              className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                noHintsMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>

        {/* Informative Status Banner */}
        {noHintsMode ? (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold text-rose-400">
            <Sparkles className="size-3" />
            <span>+25% Points Score Bonus Active</span>
          </div>
        ) : (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            <span>Clues unlock progressively on skipped stages</span>
          </div>
        )}

        {isLocked && (
          <div className="mt-2 text-[10px] text-amber-400/90 font-medium">
            🔒 Mode locked during active round. Toggles reset between rounds.
          </div>
        )}
      </div>

      {/* 2. Master Volume Deck */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            Master Audio
          </span>
          <span className="font-mono text-xs font-bold text-foreground">
            {isMuted ? "Muted" : `${Math.round(volume * 100)}%`}
          </span>
        </div>

        <SleekVolumeSlider
          volume={volume}
          isMuted={isMuted}
          accentColor={accentColor}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>

      {/* 3. Keyboard Shortcut HUD */}
      <div className="rounded-3xl border border-border/80 bg-card/90 p-4 shadow-xl backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-2.5">
          <Keyboard className="size-3.5 text-muted-foreground" />
          <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
            Controls HUD
          </span>
        </div>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Play / Pause</span>
            <kbd className="rounded-lg bg-surface border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              Space
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Mute / Unmute</span>
            <kbd className="rounded-lg bg-surface border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              M
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Submit Guess</span>
            <kbd className="rounded-lg bg-surface border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              Enter ↵
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Next Round</span>
            <kbd className="rounded-lg bg-surface border border-border px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              N
            </kbd>
          </div>
        </div>
      </div>
    </aside>
  );
}
