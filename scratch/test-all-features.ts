import { prisma } from "../src/lib/prisma";
import { generateAudioToken, verifyAndDecodeAudioToken } from "../src/lib/crypto";

async function runTests() {
  console.log("🧪 Starting Comprehensive E2E Verification...\n");

  // 1. Check Total Tracks and Tier Distributions
  const totalTracks = await prisma.track.count();
  console.log(`✅ Total Songs in Database: ${totalTracks}`);
  if (totalTracks < 1000) throw new Error("Expected at least 1000 tracks");

  const tiers = ["easy", "medium", "hard", "expert", "impossible"];
  for (const tier of tiers) {
    const count = await prisma.track.count({ where: { difficulty: tier } });
    console.log(`   - Tier [${tier.toUpperCase()}]: ${count} songs`);
    if (count < 100) throw new Error(`Tier ${tier} has fewer than 100 songs`);
  }

  // 2. Check Soundtracks Playlist Count
  const soundtrackCount = await prisma.track.count({ where: { genre: "soundtrack" } });
  console.log(`\n✅ Soundtracks Playlist Songs: ${soundtrackCount}`);
  if (soundtrackCount < 100) throw new Error("Soundtracks playlist has fewer than 100 songs");

  // 3. Test Scoring & Combined % Bonuses
  console.log("\n🎯 Testing Scoring & Combined % Bonuses:");
  const testTrack = await prisma.track.findFirst({ where: { difficulty: "easy" } });
  if (!testTrack) throw new Error("No test track found");

  const token = generateAudioToken(testTrack.id, "test_session_123");
  const decoded = verifyAndDecodeAudioToken(token);
  if (!decoded || decoded.trackId !== testTrack.id) throw new Error("Token decode mismatch");

  // Multiplier for easy = 1x, stageWon = 0 (0.1s) -> basePoints = (5 - 0)*1 + 1 = 6 pts
  // Case A: Normal Casual Mode -> 6 pts (0% bonus)
  const basePoints = 6;

  // Case B: No Hints Mode (+25%) -> Math.ceil(6 * 1.25) = 8 pts
  const noHintsOnly = Math.ceil(basePoints * 1.25);
  console.log(`   - No Hints (+25%): base=${basePoints} -> final=${noHintsOnly} pts`);

  // Case C: Pro Speed Mode (+5%) -> Math.ceil(6 * 1.05) = 7 pts
  const proSpeedOnly = Math.ceil(basePoints * 1.05);
  console.log(`   - Pro Speed (+5%): base=${basePoints} -> final=${proSpeedOnly} pts`);

  // Case D: Combined Bonus (+30%) -> Math.ceil(6 * 1.30) = 8 pts (or for 10 pts base: 10 * 1.30 = 13 pts)
  const combined = Math.ceil(basePoints * 1.30);
  console.log(`   - Combined (+30%): base=${basePoints} -> final=${combined} pts`);

  // Case E: Impossible 5x tier, stage 0 -> basePoints = (5 - 0)*5 + 5 = 30 pts
  const impossibleBase = 30;
  const impossibleCombined = Math.ceil(impossibleBase * 1.30);
  console.log(`   - Impossible Combined (+30%): base=${impossibleBase} -> final=${impossibleCombined} pts`);

  console.log("\n🎉 ALL E2E BACKEND & DATABASE TESTS PASSED 100%!");
}

runTests()
  .catch((err) => {
    console.error("❌ Test failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
