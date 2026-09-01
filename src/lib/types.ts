export type DifficultyTier = "easy" | "medium" | "hard" | "expert" | "impossible";

export type GameMode = "unlimited" | "daily" | "playlist" | "challenge";

export interface StageConfig {
  stage: number;
  duration: number; // in seconds, e.g. 0.1, 0.5, 2.0, 8.0, 15.0
  label: string;
}

export const STAGES_DEFAULT: number[] = [0.1, 0.5, 2.0, 8.0, 15.0];
export const STAGES_CASUAL: number[] = [1.0, 2.5, 5.0, 10.0, 15.0];

export const TIER_CONFIG: Record<
  DifficultyTier,
  { label: string; color: string; multiplier: number; description: string }
> = {
  easy: {
    label: "Easy",
    color: "#10b981", // Green
    multiplier: 1.0,
    description: "Mega-hits, iconic chart toppers & viral anthems",
  },
  medium: {
    label: "Medium",
    color: "#eab308", // Yellow
    multiplier: 1.5,
    description: "Huge radio staples & worldwide popular songs",
  },
  hard: {
    label: "Hard",
    color: "#f97316", // Orange
    multiplier: 2.0,
    description: "Classic anthems, legendary riffs & memorable hits",
  },
  expert: {
    label: "Expert",
    color: "#ef4444", // Red
    multiplier: 2.5,
    description: "Deep cuts, cult classics & niche genre anthems",
  },
  impossible: {
    label: "Impossible",
    color: "#a855f7", // Purple
    multiplier: 3.0,
    description: "Tricky intros, obscure master tracks & extreme trivia",
  },
};

export interface TrackSummary {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  releaseYear: number;
  genre: string;
  decade: string;
  difficulty: DifficultyTier;
  popularity: number;
  coverUrl: string;
  spotifyUrl?: string | null;
  appleUrl?: string | null;
}

export interface SearchTrackItem {
  id: string;
  title: string;
  artist: string;
  album?: string | null;
  releaseYear?: number;
  genre?: string;
  decade?: string;
  difficulty?: string;
  popularity?: number;
  coverUrl?: string;
  searchStr: string; // "Song Title - Artist Name"
}

export interface GameSessionResponse {
  sessionId: string;
  audioToken: string;
  stages: number[];
  maxAttempts: number;
  difficulty: DifficultyTier;
  mode: GameMode;
  puzzleDate?: string;
  puzzleNumber?: number;
  playlistName?: string;
  seed?: string;
}

export interface GuessAttempt {
  guessIndex: number;
  trackId?: string;
  guessText: string;
  isCorrect: boolean;
  isSkipped: boolean;
  isFranchiseMatch?: boolean;
  stageUnlocked: number;
}

export interface ScoreBreakdown {
  basePoints: number;
  tierMultiplier: number;
  noHintsBonusPercent: number;
  proSpeedBonusPercent: number;
  totalBonusPercent: number;
  isFranchiseMatch?: boolean;
  finalPoints: number;
}

export interface GuessResultResponse {
  isCorrect: boolean;
  isGameOver: boolean;
  isFranchiseMatch?: boolean;
  stageWon?: number | null;
  pointsEarned: number;
  attemptsUsed: number;
  revealTrack?: TrackSummary;
  challengeSeed?: string;
  hints?: any;
  scoreBreakdown?: ScoreBreakdown;
}

export interface MatchHistoryItem {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  difficulty?: DifficultyTier;
  playlist?: string;
  isWin: boolean;
  isFranchiseMatch?: boolean;
  stageWon: number | null;
  durationSeconds?: number;
  durationLabel?: string;
  points: number;
  playedAt: string;
}

export interface TierStatRecord {
  played: number;
  won: number;
  points: number;
}

export interface PlaylistStatRecord {
  played: number;
  won: number;
  points: number;
}

export interface UserCareerStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  distribution: [number, number, number, number, number, number]; // [0.1s, 0.5s, 2s, 8s, 15s, failed]
  totalPoints: number;
  perfectGuesses: number; // 0.1s solves
  totalSecondsSolved?: number;
  totalStageIndexWon?: number;
  tierStats?: Record<DifficultyTier, TierStatRecord>;
  playlistStats?: Record<string, PlaylistStatRecord>;
  recentMatches?: MatchHistoryItem[];
}

export interface PlaylistInfo {
  slug: string;
  title: string;
  description: string;
  icon: string;
  gradient: string;
  genre?: string;
  decade?: string;
  songCount?: number;
}
