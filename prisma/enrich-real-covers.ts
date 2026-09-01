import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

interface SearchIndexTrack {
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
}

async function queryDeezerCover(title: string, artist: string): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
    const cleanArtist = artist.split(/,|&|feat\./i)[0].trim();
    const query = encodeURIComponent(`artist:"${cleanArtist}" track:"${cleanTitle}"`);

    const res = await fetch(`https://api.deezer.com/search?q=${query}&limit=3`, {
      headers: { "User-Agent": "BetterGuessableCoverFetcher/1.0" },
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data && data.data.length > 0) {
        const item = data.data[0];
        if (item.album?.cover_big || item.album?.cover_xl || item.album?.cover_medium) {
          return item.album.cover_big || item.album.cover_xl || item.album.cover_medium;
        }
      }
    }

    // Broad search
    const broadQuery = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const broadRes = await fetch(`https://api.deezer.com/search?q=${broadQuery}&limit=3`, {
      headers: { "User-Agent": "BetterGuessableCoverFetcher/1.0" },
    });
    if (broadRes.ok) {
      const broadData = await broadRes.json();
      if (broadData.data && broadData.data.length > 0) {
        const item = broadData.data[0];
        if (item.album?.cover_big || item.album?.cover_xl || item.album?.cover_medium) {
          return item.album.cover_big || item.album.cover_xl || item.album.cover_medium;
        }
      }
    }
  } catch {}
  return null;
}

async function queryAppleCover(title: string, artist: string): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
    const cleanArtist = artist.split(/,|&|feat\./i)[0].trim();
    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);

    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=3`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
      }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const match = data.results[0];
        if (match.artworkUrl100) {
          return match.artworkUrl100.replace("100x100bb", "600x600bb");
        }
      }
    }
  } catch {}
  return null;
}

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log("🎨 Starting Album Artwork Enrichment for all tracks...");

  const tracksToEnrich = await prisma.track.findMany({
    where: {
      OR: [
        { coverUrl: { contains: "unsplash" } },
        { coverUrl: { contains: "undefined" } },
        { coverUrl: "" },
      ],
    },
    orderBy: { id: "asc" },
  });

  console.log(`📦 Found ${tracksToEnrich.length} tracks needing real album covers.`);

  let updatedCount = 0;
  const BATCH_SIZE = 8;

  for (let i = 0; i < tracksToEnrich.length; i += BATCH_SIZE) {
    const batch = tracksToEnrich.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (track) => {
        let cover = await queryDeezerCover(track.title, track.artist);
        if (!cover) {
          cover = await queryAppleCover(track.title, track.artist);
        }

        if (cover) {
          await prisma.track.update({
            where: { id: track.id },
            data: { coverUrl: cover },
          });
          updatedCount++;
        }
      })
    );

    console.log(
      `   ⏳ Processed ${Math.min(i + BATCH_SIZE, tracksToEnrich.length)} / ${tracksToEnrich.length} tracks (Updated: ${updatedCount})...`
    );
    await delay(200); // Friendly rate-limiting
  }

  console.log(`\n🎉 Finished! Successfully enriched ${updatedCount} tracks with authentic album artwork.`);

  // Sync public/data/search-index.json
  console.log("⚡ Synchronizing public/data/search-index.json...");
  const allTracks = await prisma.track.findMany({
    select: {
      id: true,
      title: true,
      artist: true,
      album: true,
      releaseYear: true,
      genre: true,
      decade: true,
      difficulty: true,
      popularity: true,
      coverUrl: true,
    },
    orderBy: { popularity: "desc" },
  });

  const searchIndexPath = path.join(process.cwd(), "public", "data", "search-index.json");
  fs.writeFileSync(searchIndexPath, JSON.stringify(allTracks, null, 2), "utf-8");
  console.log(`🚀 Saved ${allTracks.length} tracks to ${searchIndexPath}!`);
}

main()
  .catch((e) => {
    console.error("Enrichment error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
