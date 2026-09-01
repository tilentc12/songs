import fs from "fs";
import path from "path";

const indexPath = path.join(process.cwd(), "public", "data", "search-index.json");
const tracks = JSON.parse(fs.readFileSync(indexPath, "utf8"));

// Sort tracks alphabetically by Artist, then Title
tracks.sort((a: any, b: any) => {
  const artComp = a.artist.localeCompare(b.artist);
  if (artComp !== 0) return artComp;
  return a.title.localeCompare(b.title);
});

// Group by Artist
const byArtist: Record<string, any[]> = {};
tracks.forEach((t: any) => {
  const art = t.artist.trim();
  if (!byArtist[art]) byArtist[art] = [];
  byArtist[art].push(t);
});

const artists = Object.keys(byArtist).sort((a, b) => a.localeCompare(b));

console.log(`Compiled ${tracks.length} songs across ${artists.length} artists.`);

// Save categorized summary to JSON for reporting
fs.writeFileSync(
  path.join(process.cwd(), "scratch", "all-artists-catalog.json"),
  JSON.stringify({ totalSongs: tracks.length, totalArtists: artists.length, artists, byArtist }, null, 2)
);
