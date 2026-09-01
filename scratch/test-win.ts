import "dotenv/config";
import { verifyAndDecodeAudioToken } from "../src/lib/crypto";
import { prisma } from "../src/lib/prisma";

async function testWinFlow() {
  console.log("🎯 Testing Full Win Flow and Points Calculation...\n");

  const baseUrl = "http://localhost:3000";

  // 1. Draw a session
  const sessionRes = await fetch(`${baseUrl}/api/game/unlimited?difficulty=easy`);
  const session = await sessionRes.json();
  console.log("Session created:", session.sessionId, "Tier:", session.difficulty);

  // 2. Decode audioToken to find out the secret song for this test
  const decoded = verifyAndDecodeAudioToken(session.audioToken);
  if (!decoded) throw new Error("Token decoding failed");
  const secretTrack = await prisma.track.findUnique({ where: { id: decoded.trackId } });
  console.log("Secret Track is:", secretTrack?.title, "-", secretTrack?.artist);

  // 3. Submit 1st stage correct guess (0.1s solve)
  const guessRes = await fetch(`${baseUrl}/api/game/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audioToken: session.audioToken,
      guessTrackId: secretTrack?.id,
      guessText: `${secretTrack?.title} - ${secretTrack?.artist}`,
      currentStage: 0,
      attemptsCount: 1,
      difficulty: session.difficulty,
    }),
  });

  const winResult = await guessRes.json();
  console.log("\nWin Result payload:", {
    isCorrect: winResult.isCorrect,
    isGameOver: winResult.isGameOver,
    stageWon: winResult.stageWon,
    pointsEarned: winResult.pointsEarned,
    revealTitle: winResult.revealTrack?.title,
    revealArtist: winResult.revealTrack?.artist,
    hasArtwork: !!winResult.revealTrack?.coverUrl,
    hasAppleUrl: !!winResult.revealTrack?.appleUrl,
    challengeSeed: winResult.challengeSeed,
  });

  if (winResult.isCorrect && winResult.isGameOver && winResult.pointsEarned > 0) {
    console.log("\n🏆 PERFECT 0.1s GUESS VERIFICATION PASSED!");
  } else {
    throw new Error("Win verification failed");
  }
}

testWinFlow().finally(() => prisma.$disconnect());
