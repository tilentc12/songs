import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeChallengeSeed, generateAudioToken } from "@/lib/crypto";
import { STAGES_DEFAULT, STAGES_CASUAL, DifficultyTier, GameSessionResponse } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const seed = searchParams.get("seed");
  const casualMode = searchParams.get("casual") === "true";

  if (!seed) {
    return NextResponse.json({ error: "Challenge seed required" }, { status: 400 });
  }

  const trackId = decodeChallengeSeed(seed);
  if (!trackId) {
    return NextResponse.json({ error: "Invalid challenge seed" }, { status: 400 });
  }

  const track = await prisma.track.findUnique({
    where: { id: trackId },
  });

  if (!track) {
    return NextResponse.json({ error: "Challenge song not found" }, { status: 404 });
  }

  const sessionId = "challenge_" + seed.substring(0, 8);
  const audioToken = generateAudioToken(track.id, sessionId);
  const stages = casualMode ? STAGES_CASUAL : STAGES_DEFAULT;

  const response: GameSessionResponse = {
    sessionId,
    audioToken,
    stages,
    maxAttempts: 5,
    difficulty: (track.difficulty as DifficultyTier) || "medium",
    mode: "challenge",
    seed,
  };

  return NextResponse.json(response);
}
