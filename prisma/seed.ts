import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";
import { CURATED_LIST, fetchTrackFromITunes } from "./catalog-importer";
import { INGESTION_TARGETS, fetchIngestionTracks } from "./artist-catalog-builder";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Mega Ingestion for 200+ Artists & 1,000+ Tracks...");

  // Clean old database tables
  await prisma.dailyPuzzle.deleteMany({});
  await prisma.guessHistory.deleteMany({});
  await prisma.userStats.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.track.deleteMany({});

  const allTracksMap = new Map<string, any>();

  // 1. Seed initial curated list
  console.log(`📦 Resolving core master list of ${CURATED_LIST.length} songs...`);
  for (const item of CURATED_LIST) {
    const key = `${item.title.toLowerCase()}___${item.artist.toLowerCase()}`;
    if (!allTracksMap.has(key)) {
      const fetched = await fetchTrackFromITunes(item);
      if (fetched && fetched.previewUrl) {
        allTracksMap.set(key, fetched);
      }
    }
  }

  console.log(`✅ Core dataset loaded (${allTracksMap.size} tracks). Starting high-throughput batch worker pool...`);

  // 2. Concurrently scrape all 200+ artist targets with 8 workers
  const concurrency = 8;
  const targetsQueue = [...INGESTION_TARGETS];
  const totalTargets = targetsQueue.length;
  let processed = 0;

  async function worker() {
    while (targetsQueue.length > 0) {
      const target = targetsQueue.shift();
      if (!target) break;

      try {
        const tracks = await fetchIngestionTracks(target);
        for (const t of tracks) {
          const key = `${t.title.toLowerCase()}___${t.artist.toLowerCase()}`;
          if (!allTracksMap.has(key)) {
            allTracksMap.set(key, t);
          }
        }
        processed++;
        process.stdout.write(`\r🎵 Scraped ${allTracksMap.size} unique songs... [${processed}/${totalTargets} targets processed]`);
      } catch (err) {
        console.warn(`Worker error on ${target.query}:`, err);
      }

      await new Promise((r) => setTimeout(r, 40));
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`\n🎉 Total unique verified tracks collected: ${allTracksMap.size}`);

  const tracksToInsert = Array.from(allTracksMap.values());

  // Batch insert into SQLite in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < tracksToInsert.length; i += chunkSize) {
    const chunk = tracksToInsert.slice(i, i + chunkSize);
    await prisma.track.createMany({ data: chunk });
  }

  const totalInDb = await prisma.track.findMany();
  console.log(`\n🚀 Successfully inserted ${totalInDb.length} verified tracks into database!`);

  // Verify counts per Difficulty Tier
  console.log("\n📊 Verification by Difficulty Tier (Target: >= 100 tracks each):");
  for (const tier of ["easy", "medium", "hard", "expert", "impossible"]) {
    const count = totalInDb.filter((t) => t.difficulty === tier).length;
    console.log(`   - ${tier.toUpperCase()}: ${count} tracks ${count >= 100 ? "✅ PASS (>= 100)" : "⚠️"}`);
  }

  // Verify counts per Playlist
  console.log("\n📻 Verification by Playlist (Target: >= 100 tracks each):");
  const playlists = [
    { name: "80s", filter: (t: any) => t.decade === "80s" },
    { name: "90s", filter: (t: any) => t.decade === "90s" },
    { name: "2000s", filter: (t: any) => t.decade === "00s" },
    { name: "2010s", filter: (t: any) => t.decade === "10s" },
    { name: "2020s", filter: (t: any) => t.decade === "20s" },
    { name: "rock", filter: (t: any) => t.genre === "rock" || t.genre === "indie" },
    { name: "hiphop", filter: (t: any) => t.genre === "hiphop" || t.genre === "rnb" },
    { name: "soundtracks", filter: (t: any) => t.genre === "soundtrack" },
  ];

  for (const p of playlists) {
    const count = totalInDb.filter(p.filter).length;
    console.log(`   - Playlist [${p.name}]: ${count} tracks ${count >= 100 ? "✅ PASS (>= 100)" : "⚠️"}`);
  }

  // Generate Daily Puzzles across all 5 tiers for 60 days
  console.log("\n📅 Generating Daily Puzzles across 5 difficulty tiers...");
  const tiers = ["easy", "medium", "hard", "expert", "impossible"];
  const now = new Date();

  for (let offset = -7; offset <= 60; offset++) {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() + offset);
    const dateStr = d.toISOString().split("T")[0];
    const puzzleNumber = 100 + offset;

    for (const tier of tiers) {
      let tierTracks = totalInDb.filter((t) => t.difficulty === tier);
      if (tierTracks.length === 0) tierTracks = totalInDb;

      const hash = dateStr.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) + tier.length * 17;
      const selectedTrack = tierTracks[hash % tierTracks.length];

      try {
        await prisma.dailyPuzzle.create({
          data: {
            date: dateStr,
            difficulty: tier,
            puzzleNumber: Math.max(1, puzzleNumber),
            trackId: selectedTrack.id,
          },
        });
      } catch {}
    }
  }

  // Build high-speed search index JSON
  console.log("\n⚡ Building client-side Fuse search index...");
  const searchIndex = totalInDb.map((t) => ({
    id: t.id,
    title: t.title,
    artist: t.artist,
    coverUrl: t.coverUrl,
    releaseYear: t.releaseYear,
    genre: t.genre,
    searchStr: `${t.title} ${t.artist}`.toLowerCase(),
  }));

  const publicDataDir = path.join(process.cwd(), "public", "data");
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  fs.writeFileSync(
    path.join(publicDataDir, "search-index.json"),
    JSON.stringify(searchIndex, null, 2),
    "utf8"
  );

  console.log(`🚀 Saved ${searchIndex.length} songs to public/data/search-index.json!`);
  console.log("🎉 Mega seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Mega seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
