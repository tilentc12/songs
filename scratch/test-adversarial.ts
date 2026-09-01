import { searchTracksEngine, getHighlightSegments, normalizeSearchText, isGuessMatch } from "../src/lib/search";
import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

async function main() {
  console.log("=== ADVERSARIAL TEST SUITE ===");

  // 1. Load catalog from search-index.json or database
  let tracks = [];
  const searchIndexPath = path.join(__dirname, "../public/data/search-index.json");
  if (fs.existsSync(searchIndexPath)) {
    tracks = JSON.parse(fs.readFileSync(searchIndexPath, "utf-8"));
    console.log(`Loaded ${tracks.length} tracks from search-index.json`);
  } else {
    tracks = await prisma.track.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
        popularity: true,
        coverUrl: true,
      }
    });
    console.log(`Loaded ${tracks.length} tracks from DB`);
  }

  // Focus queries:
  const queries = [
    "beyonce 1+1",
    "1+1",
    "1 + 1",
    "beyonce",
    "Halo",
    "p!nk",
    "pink",
    "mötley crüe",
    "motley crue",
    "Ke$ha",
    "kesha",
    "Panic! At The Disco",
    "AC/DC",
    "ac dc"
  ];

  console.log("\n--- SEARCH TEST ---");
  for (const q of queries) {
    const results = searchTracksEngine(tracks, q, null, 5);
    console.log(`\nQuery: "${q}" -> ${results.length} results:`);
    for (const r of results.slice(0, 3)) {
      const hlTitle = getHighlightSegments(r.title, q);
      const hlArtist = getHighlightSegments(r.artist, q);
      console.log(`  - "${r.title}" by "${r.artist}" (id: ${r.id})`);
      console.log(`    HL Title:`, JSON.stringify(hlTitle));
      console.log(`    HL Artist:`, JSON.stringify(hlArtist));
    }
  }

  console.log("\n--- GUESS MATCH TEST ---");
  const matchTests = [
    { track: { id: "1", title: "1+1", artist: "Beyoncé" }, guesses: ["1+1", "1 + 1", "1 plus 1", "beyonce 1+1", "1+1 - Beyoncé", "1+1 - Beyonce", "1+1 beyonce"] },
    { track: { id: "2", title: "Halo", artist: "Beyoncé" }, guesses: ["Halo", "halo", "beyonce", "Halo - Beyoncé", "Halo - Beyonce"] },
    { track: { id: "3", title: "So What", artist: "P!nk" }, guesses: ["So What", "p!nk", "pink", "So What - P!nk", "So What - Pink"] },
    { track: { id: "4", title: "Kickstart My Heart", artist: "Mötley Crüe" }, guesses: ["Kickstart My Heart", "motley crue", "mötley crüe", "Kickstart My Heart - Mötley Crüe"] },
  ];

  for (const t of matchTests) {
    console.log(`\nSecret: "${t.track.title}" by "${t.track.artist}"`);
    for (const g of t.guesses) {
      const matched = isGuessMatch(t.track, undefined, g);
      console.log(`  Guess: "${g}" -> ${matched ? "MATCHED ✅" : "FAILED ❌"}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
