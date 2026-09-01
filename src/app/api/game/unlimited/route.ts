import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAudioToken } from "@/lib/crypto";
import { STAGES_DEFAULT, STAGES_CASUAL, DifficultyTier, GameSessionResponse } from "@/lib/types";

const VALID_TIERS: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const difficulty = searchParams.get("difficulty") as DifficultyTier | null;
  const decade = searchParams.get("decade");
  const genre = searchParams.get("genre");
  const casualMode = searchParams.get("casual") === "true";

  // Parse exclude parameter robustly
  const excludeParams = searchParams.getAll("exclude").join(",");
  const excludeIds = Array.from(
    new Set(
      excludeParams
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    )
  );

  // Build base filter query
  const baseWhere: any = {};
  if (difficulty && VALID_TIERS.includes(difficulty)) {
    baseWhere.difficulty = difficulty;
  }
  if (decade) {
    baseWhere.decade = decade;
  }
  if (genre) {
    baseWhere.genre = genre;
  } else {
    // Normal Unlimited mode strictly excludes anime and soundtrack
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  }

  // 1. First attempt: Exclude all tracks played in the active session
  let poolReset = false;
  let candidateTracks = await prisma.track.findMany({
    where: {
      ...baseWhere,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    },
    select: { id: true, difficulty: true },
    orderBy: { id: "asc" },
  });

  // 2. Full-Catalog Loop: If all tracks in this category/tier have been played, reset the pool!
  if (candidateTracks.length === 0 && excludeIds.length > 0) {
    poolReset = true;
    candidateTracks = await prisma.track.findMany({
      where: baseWhere,
      select: { id: true, difficulty: true },
      orderBy: { id: "asc" },
    });
  }

  // 3. Fallback if tier/genre has 0 tracks in catalog
  if (candidateTracks.length === 0) {
    const fallbackWhere: any = {};
    if (genre === "anime" || genre === "soundtrack") {
      fallbackWhere.genre = genre;
    } else {
      fallbackWhere.genre = { notIn: ["anime", "soundtrack"] };
    }
    candidateTracks = await prisma.track.findMany({
      where: fallbackWhere,
      select: { id: true, difficulty: true },
      orderBy: { id: "asc" },
    });
  }

  if (candidateTracks.length === 0) {
    return NextResponse.json({ error: "No tracks available in catalog" }, { status: 404 });
  }

  // Uniform random selection from non-excluded candidates
  const randomIndex = Math.floor(Math.random() * candidateTracks.length);
  const chosenTrack = candidateTracks[randomIndex];

  const sessionId = "sess_" + Math.random().toString(36).substring(2, 11);
  const audioToken = generateAudioToken(chosenTrack.id, sessionId);
  const stages = casualMode ? STAGES_CASUAL : STAGES_DEFAULT;

  const response: GameSessionResponse & { poolReset?: boolean } = {
    sessionId,
    audioToken,
    stages,
    maxAttempts: 5,
    difficulty: (chosenTrack.difficulty as DifficultyTier) || "medium",
    mode: "unlimited",
    poolReset,
  };

  return NextResponse.json(response);
}
