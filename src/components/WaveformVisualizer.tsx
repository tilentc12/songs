"use client";

import { useEffect, useRef } from "react";

interface WaveformVisualizerProps {
  isPlaying: boolean;
  accentColor?: string;
  color?: string;
  barCount?: number;
  height?: number;
}

export function WaveformVisualizer({
  isPlaying,
  accentColor,
  color = "#10b981",
  barCount = 28,
  height = 40,
}: WaveformVisualizerProps) {
  const activeColor = accentColor || color;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const width = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, width, h);

      const spacing = width / barCount;
      const barWidth = Math.max(2.5, spacing - 2);

      phaseRef.current += isPlaying ? 0.09 : 0.012;

      for (let i = 0; i < barCount; i++) {
        let barHeight = 4;
        if (isPlaying) {
          // Dynamic harmonic sound wave simulation
          const sinVal = Math.sin(phaseRef.current + i * 0.38) * Math.cos(phaseRef.current * 0.6 + i * 0.15);
          barHeight = Math.max(4, Math.abs(sinVal) * (h * 0.9));
        } else {
          // Subtle resting breathing line
          const sinVal = Math.sin(phaseRef.current + i * 0.22);
          barHeight = 4 + Math.abs(sinVal) * 3;
        }

        const x = i * spacing + (spacing - barWidth) / 2;
        const y = (h - barHeight) / 2;

        const grad = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isPlaying) {
          grad.addColorStop(0, "#ffffff");
          grad.addColorStop(0.3, activeColor);
          grad.addColorStop(1, `${activeColor}88`);
          ctx.shadowBlur = 8;
          ctx.shadowColor = activeColor;
        } else {
          grad.addColorStop(0, "rgba(148, 163, 184, 0.4)");
          grad.addColorStop(1, "rgba(71, 85, 105, 0.2)");
          ctx.shadowBlur = 0;
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeColor, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={260}
      height={height}
      className="w-full max-w-[260px] drop-shadow-md"
    />
  );
}
