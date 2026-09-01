import fs from "fs";
import path from "path";

const indexPath = path.join(process.cwd(), "public", "data", "search-index.json");
const data = JSON.parse(fs.readFileSync(indexPath, "utf8"));

console.log(`Total songs loaded from index: ${data.length}`);

// Group by difficulty
const byDifficulty: Record<string, any[]> = {
  easy: [],
  medium: [],
  hard: [],
  expert: [],
  impossible: [],
};

// Group by genre / playlist
const byGenre: Record<string, any[]> = {};
const byDecade: Record<string, any[]> = {};

data.forEach((track: any) => {
  const diff = track.difficulty || "medium";
  if (byDifficulty[diff]) {
    byDifficulty[diff].push(track);
  } else {
    byDifficulty[diff] = [track];
  }

  const g = track.genre || "pop";
  if (!byGenre[g]) byGenre[g] = [];
  byGenre[g].push(track);

  const d = track.decade || "20s";
  if (!byDecade[d]) byDecade[d] = [];
  byDecade[d].push(track);
});

console.log("\nCounts by Difficulty:");
Object.keys(byDifficulty).forEach((d) => {
  console.log(`  - ${d}: ${byDifficulty[d].length} tracks`);
});

console.log("\nCounts by Genre / Theme:");
Object.keys(byGenre).forEach((g) => {
  console.log(`  - ${g}: ${byGenre[g].length} tracks`);
});

console.log("\nCounts by Decade:");
Object.keys(byDecade).forEach((d) => {
  console.log(`  - ${d}: ${byDecade[d].length} tracks`);
});

// Count unique artists
const artistsSet = new Set<string>();
data.forEach((t: any) => {
  if (t.artist) artistsSet.add(t.artist.trim());
});
console.log(`\nTotal Unique Artists: ${artistsSet.size}`);
