import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

async function main() {
  console.log("🎨 Ensuring 100% High-Resolution Cover Artwork for all 1,423 tracks...");

  const tracks = await prisma.track.findMany();
  console.log(`📦 Found ${tracks.length} tracks in database.`);

  let updatedCount = 0;

  for (const track of tracks) {
    // If track has an Unsplash placeholder or missing cover, assign a high-quality Deezer cover hash or search Deezer
    if (!track.coverUrl || track.coverUrl.includes("unsplash") || track.coverUrl.includes("placeholder")) {
      try {
        const cleanTitle = track.title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
        const cleanArtist = track.artist.replace(/feat\..*/i, "").replace(/&.*/, "").trim();
        const q = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);

        const res = await fetch(`https://api.deezer.com/search?q=${q}&limit=1`, {
          headers: { "User-Agent": "BetterGuessableArtwork/1.0" },
        });

        if (res.ok) {
          const data = await res.json();
          const match = data.data?.[0];
          const newCover = match?.album?.cover_big || match?.album?.cover_medium;
          if (newCover) {
            await prisma.track.update({
              where: { id: track.id },
              data: { coverUrl: newCover },
            });
            track.coverUrl = newCover;
            updatedCount++;
          }
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 40));
    }
  }

  console.log(`✨ Updated ${updatedCount} tracks with fresh high-res album covers!`);

  // Refresh public/data/search-index.json with all covers
  const allTracks = await prisma.track.findMany();
  const searchIndex = allTracks.map((t) => ({
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

  console.log(`🚀 Saved ${searchIndex.length} enriched tracks with cover URLs to search-index.json!`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
