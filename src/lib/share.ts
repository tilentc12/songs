import { GuessAttempt, DifficultyTier, GameMode } from "./types";

interface ShareOptions {
  mode: GameMode;
  difficulty?: DifficultyTier;
  puzzleNumber?: number;
  attempts: GuessAttempt[];
  maxAttempts: number;
  stageWon: number | null; // null if lost
  stages: number[];
  points: number;
  currentStreak?: number;
  challengeUrl?: string;
}

export function generateShareEmojiString(options: ShareOptions): string {
  const { mode, difficulty, puzzleNumber, attempts, maxAttempts, stageWon, stages, points, currentStreak, challengeUrl } = options;

  let header = "🎵 Better Guessable";
  if (mode === "daily" && puzzleNumber) {
    header += ` · Daily #${puzzleNumber} (${difficulty?.toUpperCase()})`;
  } else if (mode === "unlimited") {
    header += ` · Endless (${difficulty || "All"})`;
  } else if (mode === "playlist") {
    header += ` · Playlist`;
  }

  // Build emoji tiles
  // 🟩 = Correct guess
  // 🟥 = Wrong guess
  // ⬜ or ⬛ = Skipped
  // ⬛ = Unused
  const tiles: string[] = [];
  for (let i = 0; i < maxAttempts; i++) {
    if (i < attempts.length) {
      const attempt = attempts[i];
      if (attempt.isCorrect) {
        tiles.push("🟩");
      } else if (attempt.isSkipped) {
        tiles.push("⬛");
      } else {
        tiles.push("🟥");
      }
    } else {
      tiles.push("⬛");
    }
  }

  const emojiLine = tiles.join("");
  const durationStr = stageWon !== null ? `${stages[stageWon]}s` : "X";
  const statusStr = stageWon !== null ? `Guessed in ${durationStr} (+${points} pts)` : "Out of attempts";

  const lines = [
    header,
    `${emojiLine} ${durationStr}`,
    statusStr,
  ];

  if (currentStreak && currentStreak > 1) {
    lines.push(`🔥 Current Streak: ${currentStreak}`);
  }

  if (challengeUrl) {
    lines.push(`Can you beat me? 👉 ${challengeUrl}`);
  } else if (typeof window !== "undefined") {
    lines.push(window.location.origin);
  }

  return lines.join("\n");
}

export async function shareResult(options: ShareOptions): Promise<boolean> {
  const text = generateShareEmojiString(options);

  if (typeof navigator !== "undefined" && navigator.share) {
    try {
      await navigator.share({
        title: "Better Guessable Result",
        text,
      });
      return true;
    } catch {
      // User dismissed or fallback to clipboard
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error("Clipboard copy failed:", err);
      return false;
    }
  }

  return false;
}
