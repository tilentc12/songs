"use client";

import { Eye, EyeOff, Radio, Keyboard, Zap } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

interface PlayerSideDeckProps {
  noHintsMode: boolean;
  onToggleNoHints: () => void;
  accentColor?: string;
}

export function PlayerSideDeck({
  noHintsMode,
  onToggleNoHints,
  accentColor = "#10b981",
}: PlayerSideDeckProps) {
  const handleToggle = () => {
    soundEffects.playToggle(!noHintsMode);
    onToggleNoHints();
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* No Hints Hardcore Switcher */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl transition-all hover:border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              style={{ backgroundColor: noHintsMode ? "#f43f5e20" : `${accentColor}20` }}
              className="grid size-9 place-items-center rounded-2xl border transition-colors"
            >
              {noHintsMode ? (
                <EyeOff className="size-4 text-rose-400" />
              ) : (
                <Eye className="size-4" style={{ color: accentColor }} />
              )}
            </div>
            <div>
              <h4 className="text-xs font-black text-foreground uppercase tracking-wider">
                {noHintsMode ? "No Hints Mode" : "Hints Enabled"}
              </h4>
              <p className="text-[11px] text-muted-foreground">
                {noHintsMode ? "Hardcore (+25% pts bonus)" : "Stage clues active"}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            onClick={handleToggle}
            role="switch"
            aria-checked={noHintsMode}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              noHintsMode ? "bg-rose-500" : "bg-neutral-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block size-5 rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                noHintsMode ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {noHintsMode && (
          <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 px-2.5 py-1.5 text-[11px] font-semibold text-rose-400">
            <Zap className="size-3 shrink-0" />
            <span>Clues hidden! +25% Points Bonus Active.</span>
          </div>
        )}
      </div>

      {/* Live Audio Spectrum Monitor */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Radio className="size-3.5 text-primary animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-foreground">
              Audio Monitor
            </span>
          </div>
          <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
            44.1 kHz
          </span>
        </div>

        {/* Dynamic VU Meter Graphic */}
        <div className="mt-3 flex items-end justify-between gap-1 h-12 px-1">
          {[40, 75, 60, 90, 50, 85, 30, 95, 70, 45, 80, 60].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-sm transition-all duration-300"
              style={{
                height: `${h}%`,
                backgroundColor: i > 9 ? "#ef4444" : i > 6 ? "#f59e0b" : accentColor,
                opacity: 0.85,
              }}
            />
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts Card */}
      <div className="rounded-3xl border border-border/80 bg-card/70 p-4 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-2 pb-2.5 border-b border-border/40">
          <Keyboard className="size-3.5 text-muted-foreground" />
          <span className="text-xs font-black uppercase tracking-wider text-foreground">
            Hotkeys
          </span>
        </div>

        <div className="mt-3 flex flex-col gap-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Play / Pause Snippet</span>
            <kbd className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              Space
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Submit Guess</span>
            <kbd className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              Enter
            </kbd>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px]">Next Song (after solve)</span>
            <kbd className="rounded-md border border-border bg-surface px-2 py-0.5 font-mono text-[10px] font-bold text-foreground">
              N
            </kbd>
          </div>
        </div>
      </div>
    </div>
  );
}
