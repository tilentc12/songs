"use client";

import { Volume2, Volume1, VolumeX } from "lucide-react";
import { soundEffects } from "@/lib/soundEffects";

interface SleekVolumeSliderProps {
  volume: number; // 0 to 1
  isMuted: boolean;
  accentColor?: string;
  onVolumeChange: (vol: number) => void;
  onToggleMute: () => void;
}

export function SleekVolumeSlider({
  volume,
  isMuted,
  accentColor = "#10b981",
  onVolumeChange,
  onToggleMute,
}: SleekVolumeSliderProps) {
  const currentLevel = isMuted ? 0 : volume;
  const percentage = Math.round(currentLevel * 100);

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX className="size-4 text-rose-400" />;
    if (volume < 0.5) return <Volume1 className="size-4 text-foreground/80" />;
    return <Volume2 className="size-4 text-foreground" />;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onVolumeChange(val);
  };

  const handleMuteClick = () => {
    soundEffects.playToggle(!isMuted);
    onToggleMute();
  };

  return (
    <div className="flex items-center gap-2.5 rounded-2xl border border-border/70 bg-card/60 px-3 py-2 backdrop-blur-md shadow-sm transition-all hover:border-border">
      {/* Mute Button */}
      <button
        onClick={handleMuteClick}
        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
        className="grid size-8 place-items-center rounded-xl bg-surface hover:bg-neutral-800 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
      >
        {getVolumeIcon()}
      </button>

      {/* Custom Slider Track */}
      <div className="relative flex items-center w-24 sm:w-28 group">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={currentLevel}
          onChange={handleSliderChange}
          aria-label="Volume Slider"
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface outline-none transition-all accent-transparent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(255,255,255,0.8)] [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-neutral-900 group-hover:[&::-webkit-slider-thumb]:scale-110"
          style={{
            background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${percentage}%, #262626 ${percentage}%, #262626 100%)`,
          }}
        />
      </div>

      {/* Volume Percentage Badge */}
      <span className="w-8 text-right font-mono text-[11px] font-bold text-muted-foreground select-none">
        {percentage}%
      </span>
    </div>
  );
}
