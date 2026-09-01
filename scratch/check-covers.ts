import { prisma } from "../src/lib/prisma";

async function main() {
  const total = await prisma.track.count();
  const unsplashCount = await prisma.track.count({
    where: { coverUrl: { contains: "unsplash" } },
  });
  const emptyCount = await prisma.track.count({
    where: { coverUrl: "" },
  });
  const realCount = total - unsplashCount - emptyCount;

  console.log(`Total tracks: ${total}`);
  console.log(`Real Deezer/iTunes covers: ${realCount}`);
  console.log(`Unsplash placeholders: ${unsplashCount}`);
  console.log(`Empty covers: ${emptyCount}`);
}

main().finally(() => prisma.$disconnect());
