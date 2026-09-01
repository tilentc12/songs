"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import {
  GameMode,
  DifficultyTier,
  GameSessionResponse,
  GuessAttempt,
  TrackSummary,
  SearchTrackItem,
  STAGES_DEFAULT,
  ScoreBreakdown,
} from "@/lib/types";
import { soundEffects } from "@/lib/soundEffects";
import {
  recordGameResult,
  addPlayedTrackId,
  getRecentPlayedTrackIds,
  saveDailyResult,
  getStoredCasualMode,
  getDailyHistory,
  getUserStats,
  DailySolveRecord,
} from "@/lib/stats";

export interface ActiveHints {
  decade?: string;
  releaseYear?: number;
  genre?: string;
  artistMasked?: string;
}

interface UseGameEngineProps {
  mode: GameMode;
  initialTier?: DifficultyTier;
  initialPlaylist?: string;
  initialSeed?: string;
}

export function useGameEngine({
  mode,
  initialTier = "easy",
  initialPlaylist,
  initialSeed,
}: UseGameEngineProps) {
  const [session, setSession] = useState<GameSessionResponse | null>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(true);
  const [currentStage, setCurrentStage] = useState(0); // 0..4
  const [attempts, setAttempts] = useState<GuessAttempt[]>([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [stageWon, setStageWon] = useState<number | null>(null);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState<ScoreBreakdown | null>(null);
  const [revealedTrack, setRevealedTrack] = useState<TrackSummary | null>(null);
  const [challengeSeed, setChallengeSeed] = useState<string | null>(null);
  const [activeHints, setActiveHints] = useState<ActiveHints>({});

  // No Hints Mode
  const [noHintsMode, setNoHintsMode] = useState(false);

  // Daily lockout state
  const [isDailyAlreadyPlayed, setIsDailyAlreadyPlayed] = useState(false);
  const [dailyRecord, setDailyRecord] = useState<DailySolveRecord | null>(null);

  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyTier>(initialTier);
  const selectedDifficultyRef = useRef<DifficultyTier>(initialTier);
  selectedDifficultyRef.current = selectedDifficulty;

  const [sessionScore, setSessionScore] = useState(0);
  const [sessionStreak, setSessionStreak] = useState(0);
  const [bestSessionStreak, setBestSessionStreak] = useState(0);
  const [careerBestStreak, setCareerBestStreak] = useState(0);
  const [wasStreakLost, setWasStreakLost] = useState(false);
  const [lostStreakCount, setLostStreakCount] = useState(0);
  const [songsPlayedInSession, setSongsPlayedInSession] = useState(0);

  // Session-level set of played track IDs to strictly prevent duplicates until the full catalog is exhausted
  const sessionRunExcludedIdsRef = useRef<Set<string>>(new Set());
  const abortControllerRef = useRef<AbortController | null>(null);

  // Search catalog index
  const [searchTracks, setSearchTracks] = useState<SearchTrackItem[]>([]);

  // Load preferences & career stats on mount
  useEffect(() => {
    try {
      const storedNoHints = localStorage.getItem("better_guessable_no_hints");
      if (storedNoHints === "true") setNoHintsMode(true);

      const stats = getUserStats();
      setCareerBestStreak(stats.maxStreak || 0);
    } catch {}
  }, []);

  // Mid-round hint toggle lock
  const toggleNoHintsMode = useCallback(() => {
    setNoHintsMode((prev) => {
      if (!isGameOver && attempts.length > 0) {
        return prev;
      }
      const next = !prev;
      try {
        localStorage.setItem("better_guessable_no_hints", String(next));
      } catch {}
      return next;
    });
  }, [isGameOver, attempts.length]);

  // Load search index
  useEffect(() => {
    fetch("/data/search-index.json")
      .then((res) => {
        if (res.ok) return res.json();
        return fetch("/api/catalog/search").then((r) => r.json());
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setSearchTracks(data);
        }
      })
      .catch((err) => {
        console.warn("Failed to load search index, fallback to API:", err);
      });
  }, []);

  // Initialize or fetch new game session
  const initGame = useCallback(
    async (tierOverride?: DifficultyTier) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const targetTier = tierOverride || selectedDifficultyRef.current;

      // Check daily lockout
      if (mode === "daily") {
        const todayDate = new Date().toISOString().split("T")[0];
        const history = getDailyHistory();
        const existingRecord = history[`${todayDate}_${targetTier}`];

        if (existingRecord) {
          setIsDailyAlreadyPlayed(true);
          setDailyRecord(existingRecord);
          setIsGameOver(true);
          setIsWin(existingRecord.isWin);
          setStageWon(existingRecord.stageWon);
          setPointsEarned(existingRecord.points);
          setScoreBreakdown(null);
          setSession(null);
          setIsLoadingSession(false);
          return;
        }
      }

      setIsLoadingSession(true);
      setSession(null);
      setIsGameOver(false);
      setIsWin(false);
      setStageWon(null);
      setPointsEarned(0);
      setScoreBreakdown(null);
      setRevealedTrack(null);
      setChallengeSeed(null);
      setActiveHints({});
      setAttempts([]);
      setCurrentStage(0);
      setWasStreakLost(false);
      setLostStreakCount(0);
      setIsDailyAlreadyPlayed(false);
      setDailyRecord(null);

      const isCasual = getStoredCasualMode();

      try {
        let endpoint = `/api/game/unlimited?difficulty=${targetTier}&casual=${isCasual}`;
        const runExcludes = Array.from(sessionRunExcludedIdsRef.current);
        const storedRecents = getRecentPlayedTrackIds();
        const combinedExcludes = Array.from(new Set([...runExcludes, ...storedRecents]));

        if (mode === "unlimited") {
          if (combinedExcludes.length > 0) {
            endpoint += `&exclude=${combinedExcludes.join(",")}`;
          }
        } else if (mode === "daily") {
          endpoint = `/api/game/daily?tier=${targetTier}&casual=${isCasual}`;
        } else if (mode === "playlist" && initialPlaylist) {
          endpoint = `/api/game/playlist?slug=${initialPlaylist}&difficulty=${targetTier}&casual=${isCasual}`;
          if (runExcludes.length > 0) {
            endpoint += `&exclude=${runExcludes.join(",")}`;
          }
        } else if (mode === "challenge" && initialSeed) {
          endpoint = `/api/game/challenge?seed=${initialSeed}&casual=${isCasual}`;
        }

        const res = await fetch(endpoint, { signal: controller.signal });
        if (!res.ok) throw new Error("Failed to load game session");
        const data: GameSessionResponse & { poolReset?: boolean } = await res.json();

        // If the pool reset (all tracks in tier/playlist were played), clear the session exclusion set
        if (data.poolReset) {
          sessionRunExcludedIdsRef.current.clear();
        }

        setSession(data);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          console.error("Game init error:", err);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoadingSession(false);
        }
      }
    },
    [mode, initialPlaylist, initialSeed]
  );

  useEffect(() => {
    initGame();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initGame]);

  // Handle Guess Submission
  const submitGuess = useCallback(
    async (track: SearchTrackItem | null, customText?: string) => {
      if (isGameOver || !session) return;

      const guessText = track ? `${track.title} - ${track.artist}` : customText || "";
      if (!guessText.trim()) return;

      const nextAttemptIndex = attempts.length;
      const nextAttemptCount = nextAttemptIndex + 1;
      const isCasualMode = getStoredCasualMode();

      try {
        const res = await fetch("/api/game/guess", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            audioToken: session.audioToken,
            guessTrackId: track?.id,
            guessText,
            isSkip: false,
            isGiveUp: false,
            currentStage,
            attemptsCount: nextAttemptCount,
            difficulty: session.difficulty,
            noHintsMode,
            isCasual: isCasualMode,
          }),
        });

        if (!res.ok) throw new Error("Guess verification failed");
        const result = await res.json();

        const newAttempt: GuessAttempt = {
          guessIndex: nextAttemptIndex,
          trackId: track?.id,
          guessText,
          isCorrect: result.isCorrect,
          isSkipped: false,
          stageUnlocked: currentStage,
          isFranchiseMatch: Boolean(result.isFranchiseMatch),
        };

        const updatedAttempts = [...attempts, newAttempt];
        setAttempts(updatedAttempts);

        if (result.hints) {
          setActiveHints(result.hints);
        }

        if (result.isCorrect) {
          soundEffects.playCorrect();
          setIsWin(true);
          setIsGameOver(true);
          setStageWon(result.stageWon);
          setWasStreakLost(false);

          const finalPoints = result.pointsEarned;

          setPointsEarned(finalPoints);
          if (result.scoreBreakdown) {
            setScoreBreakdown(result.scoreBreakdown);
          }
          setRevealedTrack(result.revealTrack);
          setChallengeSeed(result.challengeSeed || null);

          setSessionScore((prev) => prev + finalPoints);
          setSessionStreak((prev) => {
            const next = prev + 1;
            setBestSessionStreak((best) => Math.max(best, next));
            setCareerBestStreak((career) => Math.max(career, next));
            return next;
          });
          setSongsPlayedInSession((prev) => prev + 1);

          if (result.revealTrack?.id) {
            sessionRunExcludedIdsRef.current.add(result.revealTrack.id);
            addPlayedTrackId(result.revealTrack.id);
          }

          try {
            confetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.7 },
              colors: ["#10b981", "#06b6d4", "#f59e0b", "#a855f7"],
            });
          } catch {}

          recordGameResult(true, result.stageWon, finalPoints, {
            difficulty: session.difficulty,
            playlist: initialPlaylist || (session.mode === "playlist" ? session.playlistName : undefined),
            track: result.revealTrack,
            stageDuration:
              result.stageWon !== null
                ? session.stages?.[result.stageWon] ?? STAGES_DEFAULT[result.stageWon]
                : undefined,
            isFranchiseMatch: Boolean(result.isFranchiseMatch),
          });

          if (mode === "daily" && session.puzzleDate) {
            saveDailyResult({
              date: session.puzzleDate,
              tier: session.difficulty,
              isWin: true,
              stageWon: result.stageWon,
              attempts: nextAttemptCount,
              attemptsList: updatedAttempts,
              points: finalPoints,
              songTitle: result.revealTrack?.title || "",
              artist: result.revealTrack?.artist || "",
            });
          }
        } else {
          soundEffects.playWrong();
          if (result.isGameOver) {
            if (sessionStreak > 0) {
              soundEffects.playStreakLost();
              setWasStreakLost(true);
              setLostStreakCount(sessionStreak);
            }
            setIsGameOver(true);
            setIsWin(false);
            setPointsEarned(0);
            setScoreBreakdown(null);
            setRevealedTrack(result.revealTrack);
            setChallengeSeed(result.challengeSeed || null);
            setSessionStreak(0);
            setSongsPlayedInSession((prev) => prev + 1);

            if (result.revealTrack?.id) {
              sessionRunExcludedIdsRef.current.add(result.revealTrack.id);
              addPlayedTrackId(result.revealTrack.id);
            }

            recordGameResult(false, null, 0, {
              difficulty: session.difficulty,
              playlist: initialPlaylist || (session.mode === "playlist" ? session.playlistName : undefined),
              track: result.revealTrack,
            });

            if (mode === "daily" && session.puzzleDate) {
              saveDailyResult({
                date: session.puzzleDate,
                tier: session.difficulty,
                isWin: false,
                stageWon: null,
                attempts: 5,
                attemptsList: updatedAttempts,
                points: 0,
                songTitle: result.revealTrack?.title || "",
                artist: result.revealTrack?.artist || "",
              });
            }
          } else {
            setCurrentStage((prev) => Math.min(prev + 1, (session.stages?.length || 5) - 1));
          }
        }
      } catch (err) {
        console.error("Error submitting guess:", err);
      }
    },
    [isGameOver, session, attempts, currentStage, noHintsMode, sessionStreak, mode, initialPlaylist]
  );

  // Handle Skip Stage
  const skipStage = useCallback(async () => {
    if (isGameOver || !session) return;

    const nextAttemptIndex = attempts.length;
    const nextAttemptCount = nextAttemptIndex + 1;
    const isCasualMode = getStoredCasualMode();

    soundEffects.playSkip();

    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioToken: session.audioToken,
          isSkip: true,
          currentStage,
          attemptsCount: nextAttemptCount,
          difficulty: session.difficulty,
          noHintsMode,
          isCasual: isCasualMode,
        }),
      });

      if (!res.ok) throw new Error("Skip verification failed");
      const result = await res.json();

      const newAttempt: GuessAttempt = {
        guessIndex: nextAttemptIndex,
        guessText: "Skipped",
        isCorrect: false,
        isSkipped: true,
        stageUnlocked: currentStage,
      };

      const updatedAttempts = [...attempts, newAttempt];
      setAttempts(updatedAttempts);

      if (result.hints) {
        setActiveHints(result.hints);
      }

      if (result.isGameOver) {
        if (sessionStreak > 0) {
          soundEffects.playStreakLost();
          setWasStreakLost(true);
          setLostStreakCount(sessionStreak);
        }
        setIsGameOver(true);
        setIsWin(false);
        setPointsEarned(0);
        setScoreBreakdown(null);
        setRevealedTrack(result.revealTrack);
        setChallengeSeed(result.challengeSeed || null);
        setSessionStreak(0);
        setSongsPlayedInSession((prev) => prev + 1);

        if (result.revealTrack?.id) {
          sessionRunExcludedIdsRef.current.add(result.revealTrack.id);
          addPlayedTrackId(result.revealTrack.id);
        }

        recordGameResult(false, null, 0, {
          difficulty: session.difficulty,
          playlist: initialPlaylist || (session.mode === "playlist" ? session.playlistName : undefined),
          track: result.revealTrack,
        });

        if (mode === "daily" && session.puzzleDate) {
          saveDailyResult({
            date: session.puzzleDate,
            tier: session.difficulty,
            isWin: false,
            stageWon: null,
            attempts: 5,
            attemptsList: updatedAttempts,
            points: 0,
            songTitle: result.revealTrack?.title || "",
            artist: result.revealTrack?.artist || "",
          });
        }
      } else {
        setCurrentStage((prev) => Math.min(prev + 1, (session.stages?.length || 5) - 1));
      }
    } catch (err) {
      console.error("Error skipping stage:", err);
    }
  }, [isGameOver, session, attempts, currentStage, noHintsMode, sessionStreak, mode, initialPlaylist]);

  // Handle Give Up
  const giveUp = useCallback(async () => {
    if (isGameOver || !session) return;

    soundEffects.playSkip();
    const isCasualMode = getStoredCasualMode();

    try {
      const res = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          audioToken: session.audioToken,
          isGiveUp: true,
          currentStage,
          attemptsCount: 5,
          difficulty: session.difficulty,
          noHintsMode,
          isCasual: isCasualMode,
        }),
      });

      if (!res.ok) throw new Error("Give up verification failed");
      const result = await res.json();

      if (sessionStreak > 0) {
        soundEffects.playStreakLost();
        setWasStreakLost(true);
        setLostStreakCount(sessionStreak);
      }

      setIsGameOver(true);
      setIsWin(false);
      setPointsEarned(0);
      setScoreBreakdown(null);
      setRevealedTrack(result.revealTrack);
      setChallengeSeed(result.challengeSeed || null);
      setSessionStreak(0);
      setSongsPlayedInSession((prev) => prev + 1);

      const updatedAttempts = [
        ...attempts,
        {
          guessIndex: attempts.length,
          guessText: "Gave Up",
          isCorrect: false,
          isSkipped: true,
          stageUnlocked: currentStage,
        },
      ];
      setAttempts(updatedAttempts);

      if (result.revealTrack?.id) {
        sessionRunExcludedIdsRef.current.add(result.revealTrack.id);
        addPlayedTrackId(result.revealTrack.id);
      }

      recordGameResult(false, null, 0, {
        difficulty: session.difficulty,
        playlist: initialPlaylist || (session.mode === "playlist" ? session.playlistName : undefined),
        track: result.revealTrack,
      });

      if (mode === "daily" && session.puzzleDate) {
        saveDailyResult({
          date: session.puzzleDate,
          tier: session.difficulty,
          isWin: false,
          stageWon: null,
          attempts: 5,
          attemptsList: updatedAttempts,
          points: 0,
          songTitle: result.revealTrack?.title || "",
          artist: result.revealTrack?.artist || "",
        });
      }
    } catch (err) {
      console.error("Error giving up:", err);
    }
  }, [isGameOver, session, attempts, currentStage, noHintsMode, sessionStreak, mode, initialPlaylist]);

  // Change Tier
  const changeTier = useCallback(
    (newTier: DifficultyTier) => {
      setSelectedDifficulty(newTier);
      initGame(newTier);
    },
    [initGame]
  );

  const resetStreakLoss = useCallback(() => {
    setWasStreakLost(false);
    setLostStreakCount(0);
  }, []);

  const stages = session?.stages || STAGES_DEFAULT;
  const currentDuration = stages[Math.min(currentStage, stages.length - 1)];
  const audioProxyUrl = session?.audioToken ? `/api/audio/${session.audioToken}` : null;

  return {
    session,
    isLoadingSession,
    currentStage,
    currentDuration,
    stages,
    attempts,
    isGameOver,
    isWin,
    stageWon,
    pointsEarned,
    scoreBreakdown,
    revealedTrack,
    challengeSeed,
    activeHints: noHintsMode ? {} : activeHints,
    noHintsMode,
    toggleNoHintsMode,
    selectedDifficulty,
    sessionScore,
    sessionStreak,
    bestSessionStreak,
    careerBestStreak,
    wasStreakLost,
    lostStreakCount,
    resetStreakLoss,
    songsPlayedInSession,
    isDailyAlreadyPlayed,
    dailyRecord,
    searchTracks,
    audioProxyUrl,
    submitGuess,
    skipStage,
    giveUp,
    nextSong: () => initGame(),
    changeTier,
  };
}
