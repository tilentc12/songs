"use client";

import { useState, useEffect } from "react";
import {
  X,
  Settings,
  ShieldAlert,
  Volume2,
  VolumeX,
  Volume1,
  Sparkles,
  Zap,
  Headphones,
  RotateCcw,
  Keyboard,
  Check,
  Bell,
  BellOff,
} from "lucide-react";
import {
  getStoredVolume,
  setStoredVolume,
  getStoredCasualMode,
  setStoredCasualMode,
  getStoredNoHints,
  setStoredNoHints,
  getStoredSfxEnabled,
  setStoredSfxEnabled,
  clearPlayedHistory,
} from "@/lib/stats";
import { soundEffects } from "@/lib/soundEffects";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [noHintsMode, setNoHintsMode] = useState(false);
  const [isCasual, setIsCasual] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setVolume(getStoredVolume());
      setNoHintsMode(getStoredNoHints());
      setIsCasual(getStoredCasualMode());
      setSfxEnabled(getStoredSfxEnabled());
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleVolumeChange = (newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolume(clamped);
    setStoredVolume(clamped);
    if (isMuted && clamped > 0) setIsMuted(false);
  };

  const handleToggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEffects.playToggle(!next);
  };

  const handleToggleSfx = () => {
    const next = !sfxEnabled;
    setSfxEnabled(next);
    setStoredSfxEnabled(next);
    soundEffects.setSfxEnabled(next);
    if (next) soundEffects.playToggle(true);
  };

  const handleToggleNoHints = () => {
    const next = !noHintsMode;
    setNoHintsMode(next);
    setStoredNoHints(next);
    soundEffects.playToggle(next);
  };

  const handleModeChange = (casual: boolean) => {
    if (casual === isCasual) return;
    setIsCasual(casual);
    setStoredCasualMode(casual);
    soundEffects.playToggle(true);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const handleClearData = () => {
    if (confirm("Reset song history cache on this device so all songs can replay?")) {
      clearPlayedHistory();
      setResetDone(true);
      soundEffects.playStreakLost();
      setTimeout(() => setResetDone(false), 3000);
    }
  };

  const currentLevel = isMuted ? 0 : volume;
  const percentage = Math.round(currentLevel * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-border bg-card p-6 shadow-2xl animate-in zoom-in-95 duration-200 scrollbar-thin">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Settings className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight text-foreground">
                Settings & Preferences
              </h2>
              <p className="text-xs text-muted-foreground">
                Customize audio, game mode, and hints
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close settings"
            className="grid size-8 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-5">
          {/* Section 1: Audio Controls */}
          <div className="rounded-2xl bg-surface/70 border border-border/70 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Volume2 className="size-3.5 text-primary" />
              <span>Audio Configuration</span>
            </h3>

            {/* Volume Slider */}
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleToggleMute}
                aria-label={isMuted ? "Unmute audio" : "Mute audio"}
                className="grid size-9 place-items-center rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground transition-all active:scale-95"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="size-4 text-rose-400" />
                ) : volume < 0.5 ? (
                  <Volume1 className="size-4 text-foreground" />
                ) : (
                  <Volume2 className="size-4 text-foreground" />
                )}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={currentLevel}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-card outline-none transition-all accent-primary [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md"
                />
              </div>

              <span className="w-10 text-right font-mono text-xs font-bold text-foreground">
                {percentage}%
              </span>
            </div>

            {/* Sound Effects Toggle */}
            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  {sfxEnabled ? (
                    <Bell className="size-3.5 text-emerald-400" />
                  ) : (
                    <BellOff className="size-3.5 text-muted-foreground" />
                  )}
                  Sound Effects (SFX)
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Chimes, needle drops, and buzzes
                </span>
              </div>

              <button
                onClick={handleToggleSfx}
                aria-label="Toggle Sound Effects"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  sfxEnabled ? "bg-emerald-500" : "bg-card border-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    sfxEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 2: Gameplay & Timing Mode */}
          <div className="rounded-2xl bg-surface/70 border border-border/70 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-400" />
              <span>Gameplay Timing & Hints</span>
            </h3>

            {/* Timing Mode Selection */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => handleModeChange(false)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  !isCasual
                    ? "bg-emerald-500/15 border-emerald-500/50 text-emerald-400 shadow-sm"
                    : "bg-card border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs">
                  <Zap className="size-3.5" />
                  <span>0.1s Pro Mode</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  0.1s → 0.5s → 2s → 8s → 15s
                </span>
              </button>

              <button
                onClick={() => handleModeChange(true)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all ${
                  isCasual
                    ? "bg-cyan-500/15 border-cyan-500/50 text-cyan-400 shadow-sm"
                    : "bg-card border-border/60 text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-1 font-bold text-xs">
                  <Headphones className="size-3.5" />
                  <span>1.0s Casual Mode</span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-1">
                  1.0s → 2.5s → 5s → 10s → 15s
                </span>
              </button>
            </div>

            {/* Hardcore No Hints Switch */}
            <div className="pt-3 border-t border-border/50 flex items-center justify-between">
              <div className="flex flex-col pr-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <ShieldAlert
                    className={`size-3.5 ${noHintsMode ? "text-rose-400" : "text-muted-foreground"}`}
                  />
                  Hardcore &quot;No Hints&quot; Mode
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Conceal clues for +25% bonus score points
                </span>
              </div>

              <button
                onClick={handleToggleNoHints}
                aria-label="Toggle No Hints Mode"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  noHintsMode ? "bg-rose-500" : "bg-card border-border"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-4 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    noHintsMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Section 3: Keyboard Shortcuts HUD */}
          <div className="rounded-2xl bg-surface/70 border border-border/70 p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
              <Keyboard className="size-3.5 text-cyan-400" />
              <span>Keyboard Shortcuts</span>
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-border/40">
                <span className="text-muted-foreground text-[11px]">Play / Pause</span>
                <kbd className="rounded bg-surface border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                  Space
                </kbd>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-border/40">
                <span className="text-muted-foreground text-[11px]">Submit Guess</span>
                <kbd className="rounded bg-surface border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                  Enter ↵
                </kbd>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-border/40">
                <span className="text-muted-foreground text-[11px]">Mute / Unmute</span>
                <kbd className="rounded bg-surface border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                  M
                </kbd>
              </div>

              <div className="flex items-center justify-between p-1.5 rounded-lg bg-card border border-border/40">
                <span className="text-muted-foreground text-[11px]">Next Round</span>
                <kbd className="rounded bg-surface border border-border px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
                  N
                </kbd>
              </div>
            </div>
          </div>

          {/* Section 4: Data & Reset */}
          <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs text-muted-foreground">
            <span>Stored in local browser storage</span>
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 text-rose-400 hover:text-rose-300 font-bold transition-colors"
            >
              {resetDone ? <Check className="size-3.5 text-emerald-400" /> : <RotateCcw className="size-3.5" />}
              <span>{resetDone ? "History Cleared!" : "Reset Session Cache"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
