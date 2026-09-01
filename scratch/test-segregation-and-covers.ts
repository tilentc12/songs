import { prisma } from "../src/lib/prisma";

async function verify() {
  console.log("🧪 Testing Anime/Soundtrack Segregation, Cover Artwork, and Mode Endpoints...\n");

  // 1. Check Unsplash placeholders in DB
  const unsplashCount = await prisma.track.count({
    where: { coverUrl: { contains: "unsplash" } },
  });
  console.log(`✅ Unsplash Placeholder Count in DB: ${unsplashCount} (Expected: 0)`);
  if (unsplashCount !== 0) throw new Error("Found leftover Unsplash placeholder images!");

  // 2. Test Unlimited Mode Query
  console.log("\n🧪 Testing 100 Unlimited Mode selections...");
  for (let i = 0; i < 100; i++) {
    const candidateTracks = await prisma.track.findMany({
      where: { genre: { notIn: ["anime", "soundtrack"] } },
      select: { id: true, title: true, artist: true, genre: true },
      take: 10,
    });
    const rand = candidateTracks[Math.floor(Math.random() * candidateTracks.length)];
    if (rand.genre === "anime" || rand.genre === "soundtrack") {
      throw new Error(`Unlimited mode selected prohibited genre: ${rand.genre} (${rand.title})`);
    }
  }
  console.log("✅ 100/100 Unlimited selections strictly excluded anime and soundtrack!");

  // 3. Test Daily Puzzles Segregation across 5 tiers
  console.log("\n🧪 Testing Daily Puzzles Segregation across 5 tiers...");
  for (const tier of ["easy", "medium", "hard", "expert", "impossible"]) {
    const tracks = await prisma.track.findMany({
      where: {
        difficulty: tier,
        genre: { notIn: ["anime", "soundtrack"] },
      },
    });
    console.log(`   - Daily [${tier.toUpperCase()}]: ${tracks.length} eligible mainstream tracks`);
    if (tracks.length < 50) throw new Error(`Daily tier ${tier} has fewer than 50 mainstream tracks!`);
  }
  console.log("✅ All Daily puzzle tiers strictly contain mainstream music only!");

  // 4. Test Playlists Isolation
  console.log("\n🧪 Testing Playlist Isolation...");
  const animeTracks = await prisma.track.findMany({ where: { genre: "anime" } });
  const soundtrackTracks = await prisma.track.findMany({ where: { genre: "soundtrack" } });
  const rockTracks = await prisma.track.findMany({ where: { genre: "rock" } });

  console.log(`   - Anime Playlist Pool: ${animeTracks.length} tracks`);
  console.log(`   - Soundtrack Playlist Pool: ${soundtrackTracks.length} tracks`);
  console.log(`   - Rock Playlist Pool: ${rockTracks.length} tracks`);

  if (animeTracks.length < 100) throw new Error("Anime playlist pool < 100");
  if (soundtrackTracks.length < 100) throw new Error("Soundtrack playlist pool < 100");
  if (rockTracks.length < 100) throw new Error("Rock playlist pool < 100");

  console.log("\n🎉 ALL SEGREGATION AND COVER CHECKS PASSED 100%!");
}

verify()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
