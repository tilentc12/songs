import fs from "fs";
import path from "path";
import Fuse from "fuse.js";

interface SearchTrackItem {
  id: string;
  title: string;
  artist: string;
  album: string;
  releaseYear: number;
  genre: string;
  decade: string;
  difficulty: string;
  popularity: number;
  coverUrl: string;
  searchStr?: string;
}

const data: SearchTrackItem[] = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "public", "data", "search-index.json"), "utf8")
);

function normalizeText(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s]/g, " ") // replace punctuation with spaces
    .replace(/\s+/g, " ")
    .trim();
}

function searchTracks(tracks: SearchTrackItem[], rawQuery: string): SearchTrackItem[] {
  if (!rawQuery.trim()) return [];

  const normQuery = normalizeText(rawQuery);
  const queryTokens = normQuery.split(" ").filter((t) => t.length > 0);

  if (queryTokens.length === 0) return [];

  // Strategy 1: Exact token match / Substring match
  const scoredTracks: Array<{ track: SearchTrackItem; score: number }> = [];

  for (const track of tracks) {
    const normTitle = normalizeText(track.title);
    const normArtist = normalizeText(track.artist);
    const normAlbum = normalizeText(track.album || "");
    const combined = `${normTitle} ${normArtist} ${normAlbum}`;

    // Check if ALL query tokens are present in the combined string
    const allTokensPresent = queryTokens.every(
      (token) => combined.includes(token) || (token === "1" && normTitle.includes("1"))
    );

    if (allTokensPresent) {
      let score = 0;
      // Exact title match gets massive boost
      if (normTitle === normQuery) score += 1000;
      else if (normTitle.startsWith(normQuery)) score += 500;
      else if (normTitle.includes(normQuery)) score += 300;

      // Artist match
      if (normArtist === normQuery) score += 400;
      else if (normArtist.startsWith(normQuery)) score += 200;
      else if (normArtist.includes(normQuery)) score += 100;

      // Popularity weighting
      score += (track.popularity || 50) * 0.5;

      scoredTracks.push({ track, score });
    }
  }

  // If Strategy 1 returned enough results, sort and return
  if (scoredTracks.length > 0) {
    return scoredTracks
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map((s) => s.track);
  }

  // Strategy 2: Fuzzy Fuse fallback
  const fuse = new Fuse(tracks, {
    keys: ["title", "artist", "album"],
    threshold: 0.4,
    ignoreLocation: true,
  });

  return fuse.search(rawQuery).slice(0, 10).map((r) => r.item);
}

const testQueries = [
  "1+1",
  "beyonce 1+1",
  "beyonce",
  "1 1",
  "die for you",
  "the weekend",
  "weekend",
  "naruto",
  "naruto silhouette",
  "attack on titan",
  "super mario",
  "minecraft",
  "interstellar",
  "star wars",
];

for (const q of testQueries) {
  const matches = searchTracks(data, q);
  console.log(`\n🔎 Query: "${q}" -> (${matches.length} matches)`);
  for (const m of matches.slice(0, 4)) {
    console.log(`   - ${m.artist} - ${m.title} (${m.album || m.genre})`);
  }
}
