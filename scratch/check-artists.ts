import { prisma } from "../src/lib/prisma";

async function main() {
  const tracks = await prisma.track.findMany({
    where: {
      OR: [
        { artist: { contains: "Mötley" } },
        { artist: { contains: "Motley" } },
        { artist: { contains: "Crüe" } },
        { artist: { contains: "Crue" } },
        { artist: { contains: "Kesha" } },
        { artist: { contains: "Ke$ha" } },
        { artist: { contains: "Pink" } },
        { artist: { contains: "P!nk" } },
        { title: { contains: "Kickstart" } },
      ]
    },
    select: { id: true, title: true, artist: true, genre: true, difficulty: true }
  });
  console.log(`Found ${tracks.length} matching tracks in DB:`);
  console.log(tracks);
}

main().catch(console.error).finally(() => prisma.$disconnect());
