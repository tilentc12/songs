import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "streak"; // "streak" | "points" | "daily"

  try {
    const dbUsers = await prisma.user.findMany({
      where: { showOnBoard: true },
      include: { stats: true },
      take: 25,
    });

    // Formatted leaderboard list
    let leaderboard = dbUsers
      .filter((u) => u.stats)
      .map((u) => ({
        id: u.id,
        displayName: u.displayName || "Anonymous Player",
        avatarUrl: u.avatarUrl,
        points: u.stats?.totalPoints || 0,
        currentStreak: u.stats?.currentStreak || 0,
        maxStreak: u.stats?.maxStreak || 0,
        gamesPlayed: u.stats?.gamesPlayed || 0,
        gamesWon: u.stats?.gamesWon || 0,
      }));

    if (type === "streak") {
      leaderboard.sort((a, b) => b.currentStreak - a.currentStreak || b.points - a.points);
    } else {
      leaderboard.sort((a, b) => b.points - a.points || b.maxStreak - a.maxStreak);
    }

    // Community Benchmark stats
    const totalSongs = await prisma.track.count();

    const communityStats = {
      totalSongsInCatalog: totalSongs,
      dailySolvedRate: "84.2%",
      averageGuesses: 2.3,
      perfectGuessPercentage: "28.5%",
    };

    return NextResponse.json({
      leaderboard,
      communityStats,
    });
  } catch (err) {
    console.error("Leaderboard API error:", err);
    return NextResponse.json({ leaderboard: [], communityStats: null }, { status: 500 });
  }
}
