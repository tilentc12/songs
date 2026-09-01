import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateAudioToken } from "@/lib/crypto";
import { STAGES_DEFAULT, STAGES_CASUAL, DifficultyTier, GameSessionResponse } from "@/lib/types";

const VALID_TIERS: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") || "80s";
  const difficulty = searchParams.get("difficulty") as DifficultyTier | null;
  const casualMode = searchParams.get("casual") === "true";
  const excludeParams = searchParams.getAll("exclude").join(",");
  const excludeIds = Array.from(
    new Set(
      excludeParams
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id.length > 0)
    )
  );

  const baseWhere: any = {};

  if (slug === "70s" || slug === "80s" || slug === "90s") {
    baseWhere.decade = slug;
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  } else if (slug === "2000s" || slug === "00s") {
    baseWhere.decade = "00s";
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  } else if (slug === "2010s" || slug === "10s") {
    baseWhere.decade = "10s";
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  } else if (slug === "2020s" || slug === "20s") {
    baseWhere.decade = "20s";
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  } else if (slug === "anime" || slug === "anisong") {
    baseWhere.genre = "anime";
  } else if (slug === "soundtrack" || slug === "soundtracks") {
    baseWhere.genre = "soundtrack";
  } else if (slug === "rock" || slug === "hiphop" || slug === "pop" || slug === "electronic") {
    baseWhere.genre = slug;
  } else {
    baseWhere.genre = { notIn: ["anime", "soundtrack"] };
  }

  if (difficulty && VALID_TIERS.includes(difficulty)) {
    baseWhere.difficulty = difficulty;
  }

  let poolReset = false;

  // 1. Query non-excluded candidates for this playlist
  let candidateTracks = await prisma.track.findMany({
    where: {
      ...baseWhere,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
    },
    select: { id: true, difficulty: true },
    orderBy: { id: "asc" },
  });

  // 2. Full-Catalog Loop: If all tracks in this playlist/tier were played, reset pool
  if (candidateTracks.length === 0 && excludeIds.length > 0) {
    poolReset = true;
    candidateTracks = await prisma.track.findMany({
      where: baseWhere,
      select: { id: true, difficulty: true },
      orderBy: { id: "asc" },
    });
  }

  // 3. Fallback: If difficulty tier is empty in this playlist, relax difficulty
  if (candidateTracks.length === 0 && baseWhere.difficulty) {
    delete baseWhere.difficulty;
    candidateTracks = await prisma.track.findMany({
      where: baseWhere,
      select: { id: true, difficulty: true },
      orderBy: { id: "asc" },
    });
  }

  // 4. Total fallback to playlist genre
  if (candidateTracks.length === 0) {
    delete baseWhere.decade;
    candidateTracks = await prisma.track.findMany({
      where: baseWhere,
      select: { id: true, difficulty: true },
      orderBy: { id: "asc" },
    });
  }

  if (candidateTracks.length === 0) {
    return NextResponse.json({ error: "No track found in playlist" }, { status: 404 });
  }

  const randomIndex = Math.floor(Math.random() * candidateTracks.length);
  const chosenTrack = candidateTracks[randomIndex];

  const sessionId = "playlist_" + slug + "_" + Math.random().toString(36).substring(2, 10);
  const audioToken = generateAudioToken(chosenTrack.id, sessionId);
  const stages = casualMode ? STAGES_CASUAL : STAGES_DEFAULT;

  const response: GameSessionResponse & { poolReset?: boolean } = {
    sessionId,
    audioToken,
    stages,
    maxAttempts: 5,
    difficulty: (chosenTrack.difficulty as DifficultyTier) || difficulty || "medium",
    mode: "playlist",
    playlistName: slug,
    poolReset,
  };

  return NextResponse.json(response);
}
