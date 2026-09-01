"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { getStoredVolume, setStoredVolume } from "@/lib/stats";

interface UseAudioPlayerOptions {
  audioUrl: string | null;
  maxDuration: number; // Current unlocked stage duration (e.g. 0.1, 0.5, 2.0, etc.)
  isGameOver: boolean;
  onEnded?: () => void;
}

const STALL_TIMEOUT_MS = 8000;

export function useAudioPlayer({
  audioUrl,
  maxDuration,
  isGameOver,
  onEnded,
}: UseAudioPlayerOptions) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isStalled, setIsStalled] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState<number>(0.8);
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const playbackStartRef = useRef<{ startPerf: number; startAudioTime: number } | null>(null);
  const stallTimerRef = useRef<NodeJS.Timeout | null>(null);

  const clearStallTimer = useCallback(() => {
    if (stallTimerRef.current) {
      clearTimeout(stallTimerRef.current);
      stallTimerRef.current = null;
    }
  }, []);

  const armStallTimer = useCallback(() => {
    clearStallTimer();
    stallTimerRef.current = setTimeout(() => {
      setIsLoading(false);
      setIsBuffering(false);
      setIsStalled(true);
      setHasError(true);
    }, STALL_TIMEOUT_MS);
  }, [clearStallTimer]);

  // Initialize volume from local storage on mount
  useEffect(() => {
    const savedVol = getStoredVolume();
    setVolumeState(savedVol);
  }, []);

  // Initialize Audio element with robust lifecycle listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();
    audio.preload = "auto";
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const handleLoadedMetadata = () => {
      clearStallTimer();
      setDuration(audio.duration || 30);
      setIsLoading(false);
      setIsBuffering(false);
      setIsStalled(false);
      setHasError(false);
    };

    const handleCanPlay = () => {
      clearStallTimer();
      setIsLoading(false);
      setIsBuffering(false);
      setIsStalled(false);
      setHasError(false);
    };

    const handleWaiting = () => {
      setIsBuffering(true);
      armStallTimer();
    };

    const handlePlaying = () => {
      clearStallTimer();
      setIsLoading(false);
      setIsBuffering(false);
      setIsStalled(false);
      setHasError(false);
      playbackStartRef.current = {
        startPerf: performance.now(),
        startAudioTime: audio.currentTime,
      };
    };

    const handleError = () => {
      clearStallTimer();
      setIsLoading(false);
      setIsBuffering(false);
      setIsPlaying(false);
      setHasError(true);
    };

    const handleStalled = () => {
      armStallTimer();
    };

    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("stalled", handleStalled);

    return () => {
      clearStallTimer();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("stalled", handleStalled);
      audio.pause();
      audio.src = "";
    };
  }, [armStallTimer, clearStallTimer]);

  // Sync Audio source URL
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }

    if (audioUrl) {
      setIsLoading(true);
      setIsBuffering(false);
      setIsStalled(false);
      setHasError(false);
      armStallTimer();

      audio.src = audioUrl;
      audio.load();
      setCurrentTime(0);
      setIsPlaying(false);
      playbackStartRef.current = null;
    } else {
      clearStallTimer();
      audio.src = "";
      setCurrentTime(0);
      setIsPlaying(false);
      playbackStartRef.current = null;
    }
  }, [audioUrl, armStallTimer, clearStallTimer]);

  // Sync Volume & Mute state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // High-Resolution 60 FPS Animation & Boundary Check Loop
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const checkTime = () => {
      if (!audio || audio.paused) return;

      const limit = isGameOver ? (audio.duration || 30) : maxDuration;
      let calculatedTime = audio.currentTime;

      if (playbackStartRef.current) {
        const elapsed = (performance.now() - playbackStartRef.current.startPerf) / 1000;
        calculatedTime = Math.max(audio.currentTime, playbackStartRef.current.startAudioTime + elapsed);
      }

      if (calculatedTime >= limit) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
        setCurrentTime(limit); // Keep visually docked at stage marker
        playbackStartRef.current = null;
        onEnded?.();
        return;
      }

      setCurrentTime(calculatedTime);
      animFrameRef.current = requestAnimationFrame(checkTime);
    };

    if (isPlaying) {
      animFrameRef.current = requestAnimationFrame(checkTime);
    } else {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [isPlaying, maxDuration, isGameOver, onEnded]);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    if (hasError || isStalled) {
      setHasError(false);
      setIsStalled(false);
      setIsLoading(true);
      armStallTimer();
      audio.load();
    }

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      playbackStartRef.current = null;
    } else {
      try {
        const limit = isGameOver ? (audio.duration || 30) : maxDuration;
        if (currentTime >= limit || currentTime === 0 || audio.currentTime >= limit) {
          audio.currentTime = 0;
          setCurrentTime(0);
        }
        playbackStartRef.current = {
          startPerf: performance.now(),
          startAudioTime: audio.currentTime,
        };
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.warn("Playback prevented / user gesture needed:", err);
        setIsPlaying(false);
      }
    }
  }, [isPlaying, audioUrl, isGameOver, maxDuration, currentTime, hasError, isStalled, armStallTimer]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (audio && !audio.paused) {
      audio.pause();
      setIsPlaying(false);
      playbackStartRef.current = null;
    }
  }, []);

  const seek = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = seconds;
      setCurrentTime(seconds);
      playbackStartRef.current = null;
    }
  }, []);

  const changeVolume = useCallback((newVol: number) => {
    const clamped = Math.max(0, Math.min(1, newVol));
    setVolumeState(clamped);
    setStoredVolume(clamped);
    if (clamped > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const retry = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audioUrl) {
      setHasError(false);
      setIsStalled(false);
      setIsLoading(true);
      armStallTimer();
      audio.load();
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [audioUrl, armStallTimer]);

  return {
    isPlaying,
    currentTime,
    duration: isGameOver ? duration : maxDuration,
    fullDuration: duration,
    isLoading: isLoading || isBuffering,
    isStalled,
    hasError,
    volume,
    isMuted,
    togglePlay,
    pause,
    seek,
    changeVolume,
    toggleMute,
    retry,
  };
}
