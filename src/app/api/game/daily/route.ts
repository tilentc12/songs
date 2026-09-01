import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAudioToken } from "@/lib/crypto";
import { STAGES_DEFAULT, STAGES_CASUAL, DifficultyTier, GameSessionResponse } from "@/lib/types";
import crypto from "crypto";

function getDailyDeterministicIndex(dateStr: string, tier: string, length: number): number {
  if (length <= 1) return 0;
  const hash = crypto
    .createHash("sha256")
    .update(`better_guessable_daily_puzzle_seed_${dateStr}_${tier}`)
    .digest("hex");
  const num = parseInt(hash.substring(0, 8), 16);
  return num % length;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tier = (searchParams.get("tier") || "easy") as DifficultyTier;
  const casualMode = searchParams.get("casual") === "true";

  // Use current UTC date "YYYY-MM-DD"
  const now = new Date();
  const dateStr = searchParams.get("date") || now.toISOString().split("T")[0];

  // Calculate global puzzle day number since epoch Jan 1, 2024
  const epoch = new Date("2024-01-01T00:00:00Z").getTime();
  const currentDayNumber = Math.max(1, Math.floor((now.getTime() - epoch) / (1000 * 60 * 60 * 24)));

  // Fetch all eligible tracks for this tier with deterministic ID ordering (strictly mainstream songs)
  let tracks = await prisma.track.findMany({
    where: {
      difficulty: tier,
      genre: { notIn: ["anime", "soundtrack"] },
    },
    orderBy: { id: "asc" },
  });

  if (tracks.length === 0) {
    tracks = await prisma.track.findMany({
      where: {
        genre: { notIn: ["anime", "soundtrack"] },
      },
      orderBy: { id: "asc" },
    });
  }

  if (tracks.length === 0) {
    return NextResponse.json({ error: "No tracks available in database" }, { status: 404 });
  }

  const chosenIndex = getDailyDeterministicIndex(dateStr, tier, tracks.length);
  const chosenTrack = tracks[chosenIndex];

  const sessionId = `daily_${dateStr}_${tier}`;
  const audioToken = generateAudioToken(chosenTrack.id, sessionId);
  const stages = casualMode ? STAGES_CASUAL : STAGES_DEFAULT;

  const response: GameSessionResponse = {
    sessionId,
    audioToken,
    stages,
    maxAttempts: 5,
    difficulty: tier,
    mode: "daily",
    puzzleDate: dateStr,
    puzzleNumber: currentDayNumber,
  };

  return NextResponse.json(response);
}
