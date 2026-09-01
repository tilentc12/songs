"use client";

import { Volume2, VolumeX } from "lucide-react";

interface VolumeControlProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export function VolumeControl({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: VolumeControlProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={isMuted ? "Unmute audio" : "Mute audio"}
        className="grid size-8 place-items-center rounded-lg border border-border/80 bg-surface text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground active:scale-95"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="size-4 text-rose-400" />
        ) : (
          <Volume2 className="size-4 text-foreground" />
        )}
      </button>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={isMuted ? 0 : volume}
        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
        aria-label="Volume Slider"
        className="h-1.5 w-16 sm:w-20 cursor-pointer appearance-none rounded-full bg-border accent-primary hover:accent-primary-hover focus:outline-none"
      />
    </div>
  );
}
