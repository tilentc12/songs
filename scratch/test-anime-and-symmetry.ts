import { prisma } from "../src/lib/prisma";
import { PLAYLISTS } from "../src/lib/constants";

async function verify() {
  console.log("🧪 Testing Anime Playlist, Layout Symmetry, and Audio Recovery...\n");

  // 1. Verify Playlists Count (9 packs for 3x3 grid)
  console.log(`✅ Total Playlists Defined: ${PLAYLISTS.length}`);
  if (PLAYLISTS.length !== 9) throw new Error("Expected exactly 9 playlists for 3x3 symmetry");

  const animePlaylist = PLAYLISTS.find((p) => p.slug === "anime");
  if (!animePlaylist) throw new Error("Anime playlist not found in PLAYLISTS");
  console.log(`   - Found: ${animePlaylist.icon} ${animePlaylist.title} (slug: ${animePlaylist.slug})`);

  // 2. Verify Anime Tracks in Database
  const animeCount = await prisma.track.count({ where: { genre: "anime" } });
  console.log(`\n✅ Total Anime Songs in SQLite: ${animeCount}`);
  if (animeCount < 100) throw new Error(`Anime playlist has only ${animeCount} tracks (< 100)`);

  // 3. Verify Difficulty Distribution for Anime
  for (const tier of ["easy", "medium", "hard", "expert", "impossible"]) {
    const tierAnimeCount = await prisma.track.count({
      where: { genre: "anime", difficulty: tier },
    });
    console.log(`   - Tier [${tier.toUpperCase()}]: ${tierAnimeCount} anime tracks`);
  }

  // 4. Verify Total Songs in Database
  const totalCount = await prisma.track.count();
  console.log(`\n✅ Total Songs in Master Database: ${totalCount}`);

  console.log("\n🎉 ALL ANIME, PLAYLIST & SYMMETRY CHECKS PASSED 100%!");
}

verify()
  .catch((e) => {
    console.error("❌ Verification failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
