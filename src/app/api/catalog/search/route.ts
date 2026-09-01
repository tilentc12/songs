import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase().trim();

  if (!q) {
    // Return all tracks in lightweight summary format for client-side Fuse.js caching
    const tracks = await prisma.track.findMany({
      select: {
        id: true,
        title: true,
        artist: true,
      },
      orderBy: { popularity: "desc" },
    });

    const index = tracks.map((t) => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      searchStr: `${t.title} ${t.artist}`.toLowerCase(),
    }));

    return NextResponse.json(index, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  }

  // Filtered search
  const matches = await prisma.track.findMany({
    where: {
      OR: [
        { title: { contains: q } },
        { artist: { contains: q } },
      ],
    },
    select: {
      id: true,
      title: true,
      artist: true,
    },
    take: 20,
  });

  return NextResponse.json(
    matches.map((m) => ({
      id: m.id,
      title: m.title,
      artist: m.artist,
      searchStr: `${m.title} ${m.artist}`.toLowerCase(),
    }))
  );
}
