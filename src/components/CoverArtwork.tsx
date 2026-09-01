"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Music2 } from "lucide-react";

interface CoverArtworkProps {
  coverUrl?: string | null;
  trackId?: string | null;
  title?: string;
  artist?: string;
  alt?: string;
  className?: string;
  roundedClassName?: string;
  showVinylGroove?: boolean;
  priority?: boolean;
}

const GRADIENT_PALETTES = [
  { from: "#4f46e5", to: "#06b6d4" }, // Indigo to Cyan
  { from: "#ec4899", to: "#8b5cf6" }, // Pink to Purple
  { from: "#f97316", to: "#e11d48" }, // Orange to Rose
  { from: "#10b981", to: "#0ea5e9" }, // Emerald to Sky
  { from: "#8b5cf6", to: "#3b82f6" }, // Violet to Blue
  { from: "#d97706", to: "#dc2626" }, // Amber to Red
  { from: "#059669", to: "#10b981" }, // Teal to Emerald
  { from: "#6366f1", to: "#a855f7" }, // Indigo to Violet
  { from: "#e11d48", to: "#4f46e5" }, // Rose to Indigo
  { from: "#0284c7", to: "#16a34a" }, // Sky to Green
];

function stringToPaletteIndex(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % GRADIENT_PALETTES.length;
}

function isInvalidOrPlaceholder(url?: string | null): boolean {
  if (!url || !url.trim()) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("unsplash.com") ||
    lower.includes("placeholder") ||
    lower.includes("via.placeholder") ||
    lower.includes("placehold.co") ||
    lower.includes("undefined") ||
    lower.includes("dummyimage")
  );
}

export function CoverArtwork({
  coverUrl,
  trackId,
  title = "Unknown Song",
  artist = "Unknown Artist",
  alt,
  className = "",
  roundedClassName = "rounded-xl",
  showVinylGroove = false,
  priority = false,
}: CoverArtworkProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const palette = useMemo(() => {
    const idx = stringToPaletteIndex(`${title}-${artist}`);
    return GRADIENT_PALETTES[idx];
  }, [title, artist]);

  const initials = useMemo(() => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    const cleanArtist = artist.replace(/[^a-zA-Z0-9\s]/g, "").trim();
    const first = cleanTitle.charAt(0) || "M";
    const second = cleanArtist.charAt(0) || "U";
    return (first + second).toUpperCase();
  }, [title, artist]);

  // If coverUrl is invalid/placeholder and trackId exists, use live server resolver
  const effectiveCoverUrl = useMemo(() => {
    if (!isInvalidOrPlaceholder(coverUrl)) {
      return coverUrl;
    }
    if (trackId) {
      return `/api/cover/${trackId}`;
    }
    return null;
  }, [coverUrl, trackId]);

  const isImageValid = Boolean(effectiveCoverUrl && !hasError);

  return (
    <div
      className={`relative overflow-hidden bg-neutral-950 flex items-center justify-center select-none ${roundedClassName} ${className}`}
    >
      {isImageValid ? (
        <>
          <Image
            src={effectiveCoverUrl!}
            alt={alt || `${title} by ${artist}`}
            fill
            unoptimized
            priority={priority}
            sizes="(max-width: 768px) 100vw, 300px"
            className={`object-cover transition-opacity duration-300 ${
              isLoading ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          />
          {isLoading && (
            <div
              className="absolute inset-0 animate-pulse"
              style={{
                background: `linear-gradient(135deg, ${palette.from}50 0%, ${palette.to}50 100%)`,
              }}
            />
          )}
        </>
      ) : (
        /* Dynamic Procedural SVG Canvas Album Artwork */
        <div
          className="size-full flex flex-col items-center justify-between p-2.5 text-center relative overflow-hidden"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${palette.from} 0%, ${palette.to} 70%, #09090b 100%)`,
          }}
        >
          {/* Subtle Vinyl Grooves Pattern */}
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: `repeating-radial-gradient(
                circle at center,
                rgba(255, 255, 255, 0.25) 0px,
                rgba(255, 255, 255, 0.25) 1px,
                transparent 2px,
                transparent 5px
              )`,
            }}
          />

          {/* Top subtle badge */}
          <div className="w-full flex items-center justify-between z-10 opacity-75">
            <Music2 className="size-3 text-white" />
            <span className="font-mono text-[8px] font-bold text-white uppercase tracking-wider">
              Audio
            </span>
          </div>

          {/* Center Graphic & Initials */}
          <div className="flex flex-col items-center justify-center z-10 drop-shadow-md my-auto">
            <div className="grid size-9 sm:size-10 place-items-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-inner mb-1">
              <span className="font-mono text-xs sm:text-sm font-black tracking-widest text-white uppercase">
                {initials}
              </span>
            </div>
          </div>

          {/* Bottom Title & Artist Banner */}
          <div className="w-full z-10">
            <div className="truncate text-[9px] font-black text-white/95 leading-tight">
              {title}
            </div>
            <div className="truncate text-[8px] font-medium text-white/75">
              {artist}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
