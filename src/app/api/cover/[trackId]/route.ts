import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function isPlaceholder(url?: string | null): boolean {
  if (!url || !url.trim()) return true;
  const lower = url.toLowerCase();
  return (
    lower.includes("unsplash.com") ||
    lower.includes("placeholder") ||
    lower.includes("via.placeholder") ||
    lower.includes("placehold.co") ||
    lower.includes("dummyimage")
  );
}

function encodeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function generateSvgFallback(title: string, artist: string): string {
  const initials = (title.charAt(0) + (artist.charAt(0) || "")).toUpperCase();
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#4f46e5" />
        <stop offset="50%" stop-color="#7c3aed" />
        <stop offset="100%" stop-color="#06b6d4" />
      </linearGradient>
    </defs>
    <rect width="600" height="600" fill="url(#bg)" />
    <circle cx="300" cy="300" r="240" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
    <circle cx="300" cy="300" r="180" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="2" />
    <circle cx="300" cy="300" r="120" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="2" />
    <circle cx="300" cy="300" r="70" fill="rgba(0,0,0,0.4)" stroke="rgba(255,255,255,0.2)" stroke-width="2" />
    <text x="300" y="312" font-family="system-ui, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="4">${initials}</text>
    <text x="300" y="470" font-family="system-ui, sans-serif" font-size="28" font-weight="800" fill="#ffffff" text-anchor="middle">${encodeXml(title)}</text>
    <text x="300" y="510" font-family="system-ui, sans-serif" font-size="20" font-weight="600" fill="rgba(255,255,255,0.8)" text-anchor="middle">${encodeXml(artist)}</text>
  </svg>`;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ trackId: string }> }
) {
  const { trackId } = await context.params;
  if (!trackId) {
    return new NextResponse("Missing trackId", { status: 400 });
  }

  const track = await prisma.track.findUnique({
    where: { id: trackId },
  });

  if (!track) {
    const fallbackSvg = generateSvgFallback("Track Not Found", "Better Guessable");
    return new NextResponse(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // If track already has a valid high-res cover, redirect with long-term cache
  if (!isPlaceholder(track.coverUrl) && track.coverUrl.startsWith("http")) {
    return NextResponse.redirect(track.coverUrl, {
      status: 307,
      headers: {
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  }

  // Live query Deezer
  try {
    const cleanTitle = track.title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
    const cleanArtist = track.artist.replace(/feat\..*/i, "").replace(/&.*/, "").trim();
    const q = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);

    const deezerRes = await fetch(`https://api.deezer.com/search?q=${q}&limit=1`, {
      headers: { "User-Agent": "BetterGuessableArtwork/2.0" },
    });

    if (deezerRes.ok) {
      const data = await deezerRes.json();
      const newCover = data.data?.[0]?.album?.cover_xl || data.data?.[0]?.album?.cover_big;
      if (newCover) {
        // Persist to database asynchronously
        prisma.track
          .update({
            where: { id: track.id },
            data: { coverUrl: newCover },
          })
          .catch(console.error);

        return NextResponse.redirect(newCover, {
          status: 307,
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
          },
        });
      }
    }

    // Live query iTunes fallback
    const itunesRes = await fetch(`https://itunes.apple.com/search?term=${q}&entity=song&limit=1`, {
      headers: { "User-Agent": "BetterGuessableArtwork/2.0" },
    });

    if (itunesRes.ok) {
      const itunesData = await itunesRes.json();
      const itunesMatch = itunesData.results?.[0];
      if (itunesMatch?.artworkUrl100) {
        const highRes = itunesMatch.artworkUrl100.replace(/100x100bb/g, "600x600bb");
        prisma.track
          .update({
            where: { id: track.id },
            data: { coverUrl: highRes },
          })
          .catch(console.error);

        return NextResponse.redirect(highRes, {
          status: 307,
          headers: {
            "Cache-Control": "public, max-age=86400, s-maxage=604800",
          },
        });
      }
    }
  } catch (err) {
    console.warn(`Live artwork resolution failed for track ${track.id}:`, err);
  }

  // Graceful SVG image fallback
  const svg = generateSvgFallback(track.title, track.artist);
  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
