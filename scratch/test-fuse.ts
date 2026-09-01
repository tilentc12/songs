import Fuse from "fuse.js";
import fs from "fs";
import path from "path";

const data = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "public", "data", "search-index.json"), "utf8")
);

const fuse = new Fuse(data, {
  keys: [
    { name: "title", weight: 0.7 },
    { name: "artist", weight: 0.5 },
    { name: "searchStr", weight: 0.4 },
  ],
  threshold: 0.35,
  minMatchCharLength: 2,
  ignoreLocation: true,
});

const testQueries = [
  "1+1",
  "beyonce 1+1",
  "beyonce",
  "1 1",
  "die for you",
  "the weekend",
  "weekend",
  "naruto silhouette",
  "attack on titan",
  "super mario",
  "minecraft",
];

for (const q of testQueries) {
  const res = fuse.search(q).slice(0, 5);
  console.log(`\n🔎 Query: "${q}" -> (${res.length} matches)`);
  for (const r of res) {
    console.log(`   - ${r.item.artist} - ${r.item.title}`);
  }
}
