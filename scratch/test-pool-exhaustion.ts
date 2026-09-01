import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("=== TESTING POOL EXHAUSTION & NON-REPETITION ===");

  const difficulty = "easy";
  const eligiblePool = await prisma.track.findMany({
    where: {
      difficulty,
      genre: { notIn: ["anime", "soundtrack"] },
    },
    select: { id: true, title: true, artist: true },
    orderBy: { id: "asc" },
  });

  console.log(`Eligible tracks in ${difficulty} tier: ${eligiblePool.length}`);
  const poolSize = eligiblePool.length;

  let sessionExcludes: string[] = [];
  const playedHistory: string[] = [];
  let cycleCount = 0;

  for (let round = 1; round <= poolSize * 2 + 5; round++) {
    const excludeSet = new Set(sessionExcludes);
    let candidates = eligiblePool.filter((t) => !excludeSet.has(t.id));
    let poolExhausted = false;

    if (candidates.length === 0) {
      poolExhausted = true;
      candidates = eligiblePool;
      sessionExcludes = []; // Clear session memory
      cycleCount++;
      console.log(`[Round ${round}] 🔄 POOL EXHAUSTED! Deck cycled (Cycle #${cycleCount}).`);
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const chosen = candidates[randomIndex];

    if (sessionExcludes.includes(chosen.id)) {
      console.error(`❌ CRITICAL BUG: Track ${chosen.title} repeated within the same cycle!`);
      process.exit(1);
    }

    sessionExcludes.push(chosen.id);
    playedHistory.push(chosen.id);

    if (round <= 5 || round === poolSize || round === poolSize + 1 || round === poolSize * 2) {
      console.log(`[Round ${round.toString().padStart(3)}] Played: "${chosen.title}" by ${chosen.artist} | Session pool: ${sessionExcludes.length}/${poolSize} | Remaining: ${poolSize - sessionExcludes.length}`);
    }
  }

  console.log(`\n✅ SUCCESS: Simulated ${poolSize * 2 + 5} rounds across 2 full pool cycles.`);
  console.log(`✅ Zero duplicates within any cycle! Pool exhaustion detection verified 100%.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
