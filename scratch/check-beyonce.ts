import { prisma } from "../src/lib/prisma";

async function main() {
  const beyonceTracks = await prisma.track.findMany({
    where: {
      OR: [
        { artist: { contains: "Beyon" } },
        { artist: { contains: "Destiny" } },
        { title: { contains: "1+1" } },
      ],
    },
  });
  console.log(`Found ${beyonceTracks.length} Beyonce / 1+1 tracks:`);
  for (const t of beyonceTracks) {
    console.log(` - ${t.artist} - ${t.title}`);
  }
}

main().finally(() => prisma.$disconnect());
