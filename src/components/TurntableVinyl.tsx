"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { Disc3 } from "lucide-react";

interface TurntableVinylProps {
  isPlaying: boolean;
  coverUrl?: string;
  songTitle?: string;
  accentColor?: string;
  progressPercent?: number; // 0 to 1
  snippetDuration: number;
  isGameOver?: boolean;
}

export function TurntableVinyl({
  isPlaying,
  coverUrl,
  songTitle,
  accentColor = "#10b981",
  progressPercent = 0,
  snippetDuration,
  isGameOver = false,
}: TurntableVinylProps) {
  const [imageError, setImageError] = useState(false);
  const [isDropped, setIsDropped] = useState(false);

  // Cueing state machine: Delay dropping needle onto vinyl until arm swings over lead-in groove
  useEffect(() => {
    if (isPlaying) {
      const timer = setTimeout(() => {
        setIsDropped(true);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      setIsDropped(false);
    }
  }, [isPlaying]);

  // Tonearm rotation angle:
  // - Resting in cradle: -28deg
  // - Lead-in groove (outer edge): 2deg
  // - Outer grooved band tracking: 2deg to 9deg (stays comfortably on the outer edge)
  const tonearmAngle = useMemo(() => {
    if (!isPlaying) return -28;
    const clampedProgress = Math.min(1, Math.max(0, progressPercent));
    return 2 + clampedProgress * 7;
  }, [isPlaying, progressPercent]);

  return (
    <div className="relative flex items-center justify-center select-none py-2">
      {/* Ambient Backlight Glow */}
      <div
        className={`absolute inset-4 rounded-full blur-3xl transition-opacity duration-700 pointer-events-none ${
          isPlaying ? "opacity-35 animate-pulse" : "opacity-10"
        }`}
        style={{ backgroundColor: accentColor }}
      />

      {/* Turntable Platter Deck */}
      <div className="relative size-56 sm:size-64 rounded-full bg-gradient-to-b from-neutral-900 via-neutral-950 to-black p-2 shadow-[0_24px_50px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.12)] border border-neutral-800/80">
        
        {/* Tonearm Resting Cradle Post (Top-Right Plinth) */}
        <div className="absolute top-2.5 right-4 w-4 h-6 pointer-events-none z-10 flex flex-col items-center">
          <div className="w-2.5 h-3.5 bg-gradient-to-b from-neutral-600 via-neutral-700 to-neutral-900 rounded-t-sm border border-neutral-600/50 shadow-md flex items-start justify-center pt-0.5">
            <div className="w-1.5 h-1 bg-neutral-950 rounded-sm" />
          </div>
          <div className="w-3.5 h-1 bg-neutral-800 rounded-full border border-neutral-700 -mt-0.5 shadow-inner" />
        </div>

        {/* Spinning Vinyl Record Body */}
        <div
          className={`relative size-full rounded-full overflow-hidden shadow-2xl transition-transform ${
            isPlaying ? "animate-[spin_3.5s_linear_infinite]" : ""
          }`}
          style={{
            background: `radial-gradient(circle at center, #111 0%, #0a0a0a 35%, #050505 70%, #000 100%)`,
          }}
        >
          {/* Concentric Micro-Grooves */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none opacity-45"
            style={{
              backgroundImage: `repeating-radial-gradient(
                circle at center,
                rgba(255, 255, 255, 0.06) 0px,
                rgba(255, 255, 255, 0.06) 1px,
                transparent 2px,
                transparent 3.5px,
                rgba(255, 255, 255, 0.03) 4.5px
              )`,
            }}
          />

          {/* Anisotropic Light Sheen (Double Conic Reflection) */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen opacity-25"
            style={{
              background: `conic-gradient(
                from 45deg at 50% 50%,
                rgba(255,255,255,0.16) 0deg,
                transparent 40deg,
                rgba(255,255,255,0.2) 90deg,
                transparent 140deg,
                rgba(255,255,255,0.16) 180deg,
                transparent 220deg,
                rgba(255,255,255,0.2) 270deg,
                transparent 320deg,
                rgba(255,255,255,0.16) 360deg
              )`,
            }}
          />

          {/* Dead Wax Run-Out Ring */}
          <div className="absolute inset-[30%] rounded-full border border-neutral-700/30 bg-neutral-900/60" />

          {/* Center Record Label / Authentic Album Cover */}
          <div className="absolute inset-[33%] rounded-full overflow-hidden border-2 border-neutral-700/80 shadow-inner bg-neutral-900 flex items-center justify-center">
            {coverUrl && isGameOver && !imageError ? (
              <Image
                src={coverUrl}
                alt={songTitle || "Revealed Track"}
                fill
                unoptimized
                onError={() => setImageError(true)}
                className="object-cover"
                sizes="120px"
              />
            ) : (
              <div
                className="size-full flex flex-col items-center justify-center p-2 text-center"
                style={{
                  background: `radial-gradient(circle, ${accentColor}25 0%, #18181b 85%)`,
                }}
              >
                <Disc3 className="size-8 transition-transform duration-500" style={{ color: accentColor }} />
                <span className="text-[7px] font-mono uppercase tracking-widest text-neutral-400 font-bold mt-1">
                  33⅓ RPM
                </span>
              </div>
            )}

            {/* Center Spindle Hole & Brass Ring */}
            <div className="absolute size-3.5 rounded-full bg-gradient-to-tr from-neutral-300 via-neutral-100 to-neutral-400 border border-neutral-600 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] z-10" />
          </div>
        </div>

        {/* Outer Tonearm Pivot Layer (Handles Dynamic Rotation & Spring Easing) */}
        <div
          className={`absolute -top-3 -right-2 w-24 h-44 pointer-events-none origin-[85%_14%] z-30 ${
            !isPlaying
              ? "transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
              : !isDropped
              ? "transition-transform duration-400 ease-out"
              : "transition-transform duration-100 ease-linear"
          }`}
          style={{ transform: `rotate(${tonearmAngle}deg)` }}
        >
          {/* Inner Needle Floating & Elevation Layer (Handles Lift/Drop & Micro-Vibration) */}
          <div
            className={`size-full transition-all duration-300 ${
              isDropped
                ? "translate-y-0.5 drop-shadow-[0_4px_10px_rgba(0,0,0,0.95)] animate-needle-float"
                : "-translate-y-1 drop-shadow-[0_14px_24px_rgba(0,0,0,0.6)]"
            }`}
          >
            <svg viewBox="0 0 100 180" fill="none" className="size-full">
              {/* Base Gimbal Pivot Housing */}
              <circle cx="85" cy="25" r="14" fill="url(#metalGradient)" stroke="#525252" strokeWidth="1.5" />
              <circle cx="85" cy="25" r="9" fill="#171717" stroke="#404040" strokeWidth="1" />
              <circle cx="85" cy="25" r="4" fill="#a3a3a3" />

              {/* Counterweight */}
              <rect x="79" y="3" width="12" height="11" rx="2" fill="url(#metalGradient)" stroke="#404040" strokeWidth="1" />
              <line x1="85" y1="3" x2="85" y2="14" stroke="#262626" strokeWidth="0.8" strokeDasharray="1.5 1.5" />

              {/* Cueing Lift Bar */}
              <path d="M 77 34 Q 73 42 77 48" stroke="#525252" strokeWidth="2" strokeLinecap="round" />

              {/* S-Shaped Audiophile Tonearm Wand */}
              <path
                d="M85 25 C 85 60, 70 85, 62 110 C 56 130, 52 145, 45 158"
                stroke="url(#armGradient)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M85 25 C 85 60, 70 85, 62 110 C 56 130, 52 145, 45 158"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="1"
                strokeLinecap="round"
              />

              {/* Headshell & Cartridge Assembly */}
              <g transform="translate(45, 158) rotate(22)">
                <rect x="-4.5" y="0" width="9" height="15" rx="1.5" fill="#171717" stroke="#404040" strokeWidth="1" />
                <rect x="-3" y="10" width="6" height="5" fill={accentColor} rx="0.5" />
                <circle cx="0" cy="15" r="1.2" fill="#f5f5f5" />
                
                {/* Stylus Tracking Glow when dropped onto groove */}
                {isDropped && (
                  <circle
                    cx="0"
                    cy="16"
                    r="2.5"
                    fill={accentColor}
                    opacity="0.6"
                    className="animate-pulse"
                  />
                )}
              </g>

              {/* Gradients */}
              <defs>
                <linearGradient id="metalGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d4d4d4" />
                  <stop offset="50%" stopColor="#737373" />
                  <stop offset="100%" stopColor="#404040" />
                </linearGradient>
                <linearGradient id="armGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f5f5f5" />
                  <stop offset="50%" stopColor="#a3a3a3" />
                  <stop offset="100%" stopColor="#525252" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
