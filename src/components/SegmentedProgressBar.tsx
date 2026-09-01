"use client";

import { useMemo } from "react";

interface SegmentedProgressBarProps {
  stages: number[]; // e.g. [0.1, 0.5, 2.0, 8.0, 15.0]
  currentStage: number; // 0..4
  currentTime: number; // Current playback time in seconds (e.g. 0.05)
  duration: number; // Current unlocked limit in seconds
  accentColor?: string;
  isGameOver?: boolean;
}

/**
 * Converts a continuous timestamp (in seconds) to a piecewise visual progress percentage (0..100%).
 * Each stage represents an equal visual partition (e.g. 5 stages = 20% each),
 * ensuring sub-second snippets (0.1s, 0.5s) are clearly visible and fluidly animated.
 */
export function timeToVisualPercent(time: number, stages: number[]): number {
  if (!stages || stages.length === 0 || time <= 0) return 0;
  const numSegments = stages.length;
  const segmentWidth = 100 / numSegments;
  const maxStageTime = stages[stages.length - 1] || 15.0;

  if (time >= maxStageTime) return 100;

  let prevTime = 0;
  for (let i = 0; i < numSegments; i++) {
    const stageTime = stages[i];
    if (time <= stageTime) {
      const segmentDuration = stageTime - prevTime;
      if (segmentDuration <= 0) return (i + 1) * segmentWidth;
      const progressInSegment = (time - prevTime) / segmentDuration;
      return i * segmentWidth + progressInSegment * segmentWidth;
    }
    prevTime = stageTime;
  }

  return 100;
}

export function SegmentedProgressBar({
  stages = [0.1, 0.5, 2.0, 8.0, 15.0],
  currentStage = 0,
  currentTime = 0,
  accentColor = "#10b981",
  isGameOver = false,
}: SegmentedProgressBarProps) {
  const numSegments = stages.length || 5;
  const segmentWidth = 100 / numSegments;

  // Unlocked region occupies full segments up to currentStage + 1
  const unlockedPercent = useMemo(() => {
    if (isGameOver) return 100;
    const clampedStage = Math.min(Math.max(0, currentStage), numSegments - 1);
    return Math.min(100, (clampedStage + 1) * segmentWidth);
  }, [isGameOver, currentStage, numSegments, segmentWidth]);

  // Current playback position mapped through the piecewise transfer function
  const currentPlayPercent = useMemo(() => {
    return Math.min(100, Math.max(0, timeToVisualPercent(currentTime, stages)));
  }, [currentTime, stages]);

  const isPlayActive = currentPlayPercent > 0;

  return (
    <div className="w-full flex flex-col gap-2 select-none" role="region" aria-label="Snippet Progress Timeline">
      {/* 1. Track Container */}
      <div
        className="relative h-5 w-full overflow-hidden rounded-full bg-surface border border-border/80 p-0.5 shadow-inner"
        role="progressbar"
        aria-label="Audio snippet timeline"
        aria-valuemin={0}
        aria-valuemax={stages[stages.length - 1] || 15.0}
        aria-valuenow={currentTime}
      >
        {/* 2. Unlocked Stage Region (Smooth animated backdrop when unlocking stages) */}
        <div
          className="absolute inset-y-0.5 left-0.5 rounded-full transition-all duration-300 ease-out pointer-events-none"
          style={{
            width: `${unlockedPercent}%`,
            backgroundColor: `${accentColor}18`,
            borderRight: unlockedPercent < 100 ? `2px solid ${accentColor}60` : "none",
          }}
        />

        {/* 3. Real-Time 60fps Playback Fill (Zero CSS transition delay for instant sync) */}
        <div
          className="absolute inset-y-0.5 left-0.5 rounded-full transition-none pointer-events-none"
          style={{
            width: `${currentPlayPercent}%`,
            backgroundColor: accentColor,
            boxShadow: isPlayActive ? `0 0 12px ${accentColor}90` : "none",
          }}
        />

        {/* 4. Glowing Playhead / Scrub Needle */}
        {isPlayActive && (
          <div
            className="absolute top-0 bottom-0 w-1 -ml-0.5 rounded-full pointer-events-none transition-none shadow-lg z-20"
            style={{
              left: `${currentPlayPercent}%`,
              backgroundColor: "#ffffff",
              boxShadow: `0 0 8px 1px ${accentColor}`,
            }}
          />
        )}

        {/* 5. Segment Divider Notches */}
        {stages.map((_, idx) => {
          const positionPercent = (idx + 1) * segmentWidth;
          if (positionPercent >= 100) return null; // End border handles last stage

          const isPassed = isGameOver || idx < currentStage;
          const isCurrentLimit = !isGameOver && idx === currentStage;

          return (
            <div
              key={idx}
              className="absolute top-0 bottom-0 pointer-events-none transition-colors duration-200 z-10"
              style={{ left: `${positionPercent}%` }}
            >
              <div
                className={`h-full w-0.5 -ml-[1px] transition-colors ${
                  isCurrentLimit
                    ? "bg-foreground/60 shadow-[0_0_4px_rgba(255,255,255,0.4)]"
                    : isPassed
                    ? "bg-foreground/30"
                    : "bg-border/60"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* 6. Evenly Spaced Timestamp Labels */}
      <div className="relative h-4 w-full text-[10px] font-mono font-bold select-none">
        {stages.map((sec, idx) => {
          const positionPercent = (idx + 1) * segmentWidth;
          const isPassed = isGameOver || idx <= currentStage;
          const isCurrent = !isGameOver && idx === currentStage;

          const isLast = idx === stages.length - 1;
          const transformStyle = isLast ? "-translate-x-full" : "-translate-x-1/2";

          return (
            <span
              key={idx}
              style={{
                left: `${positionPercent}%`,
                color: isCurrent || isPassed ? accentColor : undefined,
              }}
              className={`absolute top-0 transform ${transformStyle} transition-colors duration-200 ${
                isCurrent
                  ? "text-foreground font-black scale-105"
                  : isPassed
                  ? "text-foreground/80 font-bold"
                  : "text-muted-foreground/40 font-semibold"
              }`}
            >
              {sec}s
            </span>
          );
        })}
      </div>
    </div>
  );
}
