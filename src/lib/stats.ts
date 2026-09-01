import {
  UserCareerStats,
  DifficultyTier,
  GuessAttempt,
  TrackSummary,
  MatchHistoryItem,
  TierStatRecord,
  PlaylistStatRecord,
  STAGES_DEFAULT,
} from "./types";

const STATS_KEY = "better_guessable_user_stats";
const RECENT_TRACKS_KEY = "better_guessable_recent_tracks";
const DAILY_HISTORY_KEY = "better_guessable_daily_history";
const VOLUME_KEY = "better_guessable_volume";
const CASUAL_MODE_KEY = "better_guessable_casual_mode";
const NO_HINTS_KEY = "better_guessable_no_hints";
const SFX_KEY = "better_guessable_sfx_enabled";

export const INITIAL_TIER_STATS: Record<DifficultyTier, TierStatRecord> = {
  easy: { played: 0, won: 0, points: 0 },
  medium: { played: 0, won: 0, points: 0 },
  hard: { played: 0, won: 0, points: 0 },
  expert: { played: 0, won: 0, points: 0 },
  impossible: { played: 0, won: 0, points: 0 },
};

const INITIAL_STATS: UserCareerStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: [0, 0, 0, 0, 0, 0],
  totalPoints: 0,
  perfectGuesses: 0,
  totalSecondsSolved: 0,
  totalStageIndexWon: 0,
  tierStats: { ...INITIAL_TIER_STATS },
  playlistStats: {},
  recentMatches: [],
};

export function getLocalStats(): UserCareerStats {
  if (typeof window === "undefined") return INITIAL_STATS;
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return INITIAL_STATS;
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_STATS,
      ...parsed,
      distribution:
        Array.isArray(parsed.distribution) && parsed.distribution.length === 6
          ? parsed.distribution
          : [...INITIAL_STATS.distribution],
      tierStats: {
        ...INITIAL_TIER_STATS,
        ...(parsed.tierStats || {}),
      },
      playlistStats: parsed.playlistStats || {},
      recentMatches: Array.isArray(parsed.recentMatches) ? parsed.recentMatches : [],
    };
  } catch {
    return INITIAL_STATS;
  }
}

export const getUserStats = getLocalStats;

export function saveLocalStats(stats: UserCareerStats): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (err) {
    console.error("Failed to save stats:", err);
  }
}

export interface RecordGameOptions {
  difficulty?: DifficultyTier;
  playlist?: string;
  track?: TrackSummary | null;
  stageDuration?: number;
  isFranchiseMatch?: boolean;
}

export function recordGameResult(
  isWin: boolean,
  stageIndex: number | null, // 0=0.1s, 1=0.5s, 2=2s, 3=8s, 4=15s, null=loss
  points: number,
  options?: RecordGameOptions
): UserCareerStats {
  const current = getLocalStats();
  const next: UserCareerStats = {
    ...current,
    distribution: [...current.distribution] as [number, number, number, number, number, number],
    tierStats: {
      easy: { ...(current.tierStats?.easy || INITIAL_TIER_STATS.easy) },
      medium: { ...(current.tierStats?.medium || INITIAL_TIER_STATS.medium) },
      hard: { ...(current.tierStats?.hard || INITIAL_TIER_STATS.hard) },
      expert: { ...(current.tierStats?.expert || INITIAL_TIER_STATS.expert) },
      impossible: { ...(current.tierStats?.impossible || INITIAL_TIER_STATS.impossible) },
    },
    playlistStats: { ...(current.playlistStats || {}) },
    recentMatches: [...(current.recentMatches || [])],
  };

  next.gamesPlayed += 1;
  const stageDurationSec =
    options?.stageDuration ??
    (stageIndex !== null && stageIndex >= 0 && stageIndex < 5 ? STAGES_DEFAULT[stageIndex] : 0);

  if (isWin) {
    next.gamesWon += 1;
    next.currentStreak += 1;
    if (next.currentStreak > next.maxStreak) {
      next.maxStreak = next.currentStreak;
    }
    if (stageIndex !== null && stageIndex >= 0 && stageIndex < 5) {
      next.distribution[stageIndex] += 1;
      if (stageIndex === 0) {
        next.perfectGuesses = (next.perfectGuesses || 0) + 1;
      }
      next.totalSecondsSolved = (next.totalSecondsSolved || 0) + stageDurationSec;
      next.totalStageIndexWon = (next.totalStageIndexWon || 0) + (stageIndex + 1);
    }
  } else {
    next.currentStreak = 0;
    next.distribution[5] += 1; // Loss bucket
  }

  next.totalPoints += points;

  // Record tier stats
  if (options?.difficulty && next.tierStats && next.tierStats[options.difficulty]) {
    next.tierStats[options.difficulty].played += 1;
    if (isWin) {
      next.tierStats[options.difficulty].won += 1;
    }
    next.tierStats[options.difficulty].points += points;
  }

  // Record playlist stats
  if (options?.playlist && next.playlistStats) {
    const slug = options.playlist.toLowerCase();
    if (!next.playlistStats[slug]) {
      next.playlistStats[slug] = { played: 0, won: 0, points: 0 };
    }
    next.playlistStats[slug].played += 1;
    if (isWin) {
      next.playlistStats[slug].won += 1;
    }
    next.playlistStats[slug].points += points;
  }

  // Record match history item (keep last 50 items)
  if (options?.track) {
    const stageLabels = ["0.1s", "0.5s", "2.0s", "8.0s", "15.0s"];
    const durationLabel =
      isWin && stageIndex !== null
        ? stageLabels[stageIndex] || `${stageDurationSec}s`
        : "Failed";

    const matchItem: MatchHistoryItem = {
      id: `${Date.now()}_${options.track.id || Math.random().toString(36).slice(2, 7)}`,
      title: options.track.title,
      artist: options.track.artist,
      coverUrl: options.track.coverUrl,
      difficulty: options.difficulty,
      playlist: options.playlist,
      isWin,
      isFranchiseMatch: options.isFranchiseMatch,
      stageWon: stageIndex,
      durationSeconds: isWin ? stageDurationSec : undefined,
      durationLabel: options.isFranchiseMatch ? "Franchise" : durationLabel,
      points,
      playedAt: new Date().toISOString(),
    };

    next.recentMatches = [matchItem, ...(next.recentMatches || [])].slice(0, 50);
  }

  saveLocalStats(next);
  return next;
}

export function getRecentPlayedTrackIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(RECENT_TRACKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addPlayedTrackId(trackId: string): void {
  if (typeof window === "undefined") return;
  try {
    const recents = getRecentPlayedTrackIds();
    const updated = [trackId, ...recents.filter((id) => id !== trackId)].slice(0, 100);
    localStorage.setItem(RECENT_TRACKS_KEY, JSON.stringify(updated));
  } catch {}
}

export interface DailySolveRecord {
  date: string;
  tier: DifficultyTier;
  isWin: boolean;
  stageWon: number | null;
  attempts: number;
  attemptsList?: GuessAttempt[];
  points: number;
  songTitle: string;
  artist: string;
}

export function getDailyHistory(): Record<string, DailySolveRecord> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(DAILY_HISTORY_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveDailyResult(record: DailySolveRecord): void {
  if (typeof window === "undefined") return;
  try {
    const history = getDailyHistory();
    const key = `${record.date}_${record.tier}`;
    history[key] = record;
    localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(history));
  } catch (err) {
    console.error("Failed to save daily result:", err);
  }
}

export function getStoredVolume(): number {
  if (typeof window === "undefined") return 0.8;
  try {
    const raw = localStorage.getItem(VOLUME_KEY);
    if (raw !== null) {
      const parsed = parseFloat(raw);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) return parsed;
    }
    return 0.8;
  } catch {
    return 0.8;
  }
}

export function setStoredVolume(vol: number): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(VOLUME_KEY, String(vol));
  } catch {}
}

export function getStoredNoHints(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(NO_HINTS_KEY) === "true";
  } catch {
    return false;
  }
}

export function setStoredNoHints(val: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(NO_HINTS_KEY, String(val));
  } catch {}
}

export function getStoredSfxEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(SFX_KEY);
    return raw === null ? true : raw === "true";
  } catch {
    return true;
  }
}

export function setStoredSfxEnabled(val: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SFX_KEY, String(val));
  } catch {}
}

export function clearPlayedHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(RECENT_TRACKS_KEY);
  } catch {}
}

export function resetAllStats(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(RECENT_TRACKS_KEY);
    localStorage.removeItem(DAILY_HISTORY_KEY);
  } catch {}
}

export function exportStatsToJson(): string {
  const stats = getLocalStats();
  const dailyHistory = getDailyHistory();
  const exportPayload = {
    app: "BetterSongGuess",
    version: 2,
    exportedAt: new Date().toISOString(),
    stats,
    dailyHistory,
  };
  return JSON.stringify(exportPayload, null, 2);
}

export function importStatsFromJson(jsonStr: string): { success: boolean; error?: string } {
  if (typeof window === "undefined") return { success: false, error: "No window context available" };
  try {
    const data = JSON.parse(jsonStr);
    if (!data || typeof data !== "object") {
      return { success: false, error: "Invalid JSON format." };
    }

    const rawStats = data.stats || data;
    if (typeof rawStats.gamesPlayed !== "number") {
      return { success: false, error: "JSON does not contain valid player statistics data." };
    }

    const importedStats: UserCareerStats = {
      ...INITIAL_STATS,
      ...rawStats,
      distribution:
        Array.isArray(rawStats.distribution) && rawStats.distribution.length === 6
          ? rawStats.distribution
          : [...INITIAL_STATS.distribution],
      tierStats: {
        ...INITIAL_TIER_STATS,
        ...(rawStats.tierStats || {}),
      },
      playlistStats: rawStats.playlistStats || {},
      recentMatches: Array.isArray(rawStats.recentMatches) ? rawStats.recentMatches : [],
    };

    saveLocalStats(importedStats);

    if (data.dailyHistory && typeof data.dailyHistory === "object") {
      localStorage.setItem(DAILY_HISTORY_KEY, JSON.stringify(data.dailyHistory));
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to parse JSON file." };
  }
}

export function getStoredCasualMode(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(CASUAL_MODE_KEY) === "true";
  } catch {
    return false;
  }
}

export function setStoredCasualMode(val: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CASUAL_MODE_KEY, String(val));
  } catch {}
}
