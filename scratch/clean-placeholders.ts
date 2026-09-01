import { prisma } from "../src/lib/prisma";
import fs from "fs";
import path from "path";

async function main() {
  const result = await prisma.track.updateMany({
    where: { coverUrl: { contains: "unsplash" } },
    data: { coverUrl: "" },
  });
  console.log(`Cleaned ${result.count} leftover placeholder tracks.`);

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
  console.log(`Synchronized search-index.json with ${allTracks.length} tracks.`);
}

main().finally(() => prisma.$disconnect());
