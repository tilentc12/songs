import { NextRequest, NextResponse } from "next/server";
import { verifyAndDecodeAudioToken } from "@/lib/crypto";
import { prisma } from "@/lib/prisma";

// ============================================================================
// 1. IN-MEMORY LRU AUDIO BUFFER CACHE (High-Throughput & Low Latency)
// ============================================================================
interface CachedAudioEntry {
  buffer: Buffer;
  contentType: string;
  cachedAt: number;
}

const AUDIO_CACHE = new Map<string, CachedAudioEntry>();
const MAX_CACHE_ENTRIES = 150;
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutes

function getCachedAudio(key: string): CachedAudioEntry | null {
  const entry = AUDIO_CACHE.get(key);
  if (!entry) return null;
  if (Date.now() - entry.cachedAt > CACHE_TTL_MS) {
    AUDIO_CACHE.delete(key);
    return null;
  }
  return entry;
}

function setCachedAudio(key: string, buffer: Buffer, contentType: string) {
  if (AUDIO_CACHE.size >= MAX_CACHE_ENTRIES) {
    const oldestKey = AUDIO_CACHE.keys().next().value;
    if (oldestKey) AUDIO_CACHE.delete(oldestKey);
  }
  AUDIO_CACHE.set(key, { buffer, contentType, cachedAt: Date.now() });
}

// ============================================================================
// 2. UNIVERSAL CORS & CACHING HEADERS
// ============================================================================
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, Accept, Accept-Encoding, Origin",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges, Content-Type",
  "Accept-Ranges": "bytes",
};

// ============================================================================
// 3. SYNTHESIZED STANDBY AUDIO GENERATOR (Valid RIFF/WAV Binary Stream)
// ============================================================================
function createSynthesizedWavBuffer(): Buffer {
  const sampleRate = 22050;
  const durationSec = 2.0;
  const numSamples = Math.floor(sampleRate * durationSec);
  const blockAlign = 2; // 16-bit mono = 2 bytes
  const byteRate = sampleRate * blockAlign;
  const dataSize = numSamples * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  // RIFF Header
  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);

  // 'fmt ' Chunk
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(16, 34); // 16-bit

  // 'data' Chunk
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  // Harmonically rich chime (440Hz + 880Hz octave decay)
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-2.5 * t);
    const fundamental = Math.sin(2 * Math.PI * 440 * t) * 0.2;
    const harmonic = Math.sin(2 * Math.PI * 880 * t) * 0.08;
    const sample = (fundamental + harmonic) * envelope;
    const int16 = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    buffer.writeInt16LE(int16, 44 + i * 2);
  }

  return buffer;
}

// ============================================================================
// 4. MULTI-TIER LIVE PREVIEW RESOLVERS (Deezer + Apple Music)
// ============================================================================
async function resolveDeezerLive(title: string, artist: string): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
    const cleanArtist = artist.split(/,|&|feat\./i)[0].trim();
    const query = encodeURIComponent(`artist:"${cleanArtist}" track:"${cleanTitle}"`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(`https://api.deezer.com/search?q=${query}&limit=5`, {
      headers: { "User-Agent": "BetterGuessableAudioEngine/1.0" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    if (data.data && data.data.length > 0) {
      const match = data.data.find((item: any) => item.preview);
      if (match?.preview) return match.preview;
    }

    // Broad search
    const broadQuery = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);
    const broadRes = await fetch(`https://api.deezer.com/search?q=${broadQuery}&limit=5`, {
      headers: { "User-Agent": "BetterGuessableAudioEngine/1.0" },
    });
    if (broadRes.ok) {
      const broadData = await broadRes.json();
      const match = broadData.data?.find((item: any) => item.preview);
      if (match?.preview) return match.preview;
    }

    return null;
  } catch {
    return null;
  }
}

async function resolveAppleLive(title: string, artist: string): Promise<string | null> {
  try {
    const cleanTitle = title.replace(/[\(\[\{].*?[\)\]\}]/g, "").trim();
    const cleanArtist = artist.split(/,|&|feat\./i)[0].trim();
    const query = encodeURIComponent(`${cleanArtist} ${cleanTitle}`);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(
      `https://itunes.apple.com/search?term=${query}&entity=song&limit=5`,
      {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
        signal: controller.signal,
      }
    );
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();
    const match = data.results?.find((r: any) => r.previewUrl);
    return match?.previewUrl || null;
  } catch {
    return null;
  }
}

// ============================================================================
// 5. HELPER: RANGE REQUEST PARSING & BUFFER SLICING
// ============================================================================
function serveBufferWithRange(
  buffer: Buffer,
  contentType: string,
  rangeHeader: string | null,
  isHeadMethod = false
): Response {
  const totalLength = buffer.length;
  const headers = new Headers(CORS_HEADERS);
  headers.set("Content-Type", contentType);
  headers.set("Cache-Control", "public, max-age=86400, s-maxage=86400, immutable");

  if (!rangeHeader) {
    headers.set("Content-Length", totalLength.toString());
    return new NextResponse(isHeadMethod ? null : (buffer as unknown as BodyInit), {
      status: 200,
      headers,
    });
  }

  const matches = rangeHeader.match(/bytes=(\d*)-(\d*)/);
  if (!matches) {
    headers.set("Content-Length", totalLength.toString());
    return new NextResponse(isHeadMethod ? null : (buffer as unknown as BodyInit), {
      status: 200,
      headers,
    });
  }

  const start = matches[1] ? parseInt(matches[1], 10) : 0;
  const end = matches[2] ? parseInt(matches[2], 10) : totalLength - 1;

  if (start >= totalLength || end >= totalLength || start > end) {
    headers.set("Content-Range", `bytes */${totalLength}`);
    return new NextResponse(null, { status: 416, headers });
  }

  const chunkSize = end - start + 1;
  headers.set("Content-Range", `bytes ${start}-${end}/${totalLength}`);
  headers.set("Content-Length", chunkSize.toString());

  const slicedBuffer = buffer.subarray(start, end + 1);
  return new NextResponse(isHeadMethod ? null : (slicedBuffer as unknown as BodyInit), {
    status: 206,
    headers,
  });
}

// ============================================================================
// 6. ROUTE HANDLERS: OPTIONS, HEAD, GET
// ============================================================================
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function HEAD(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  return handleAudioRequest(request, context, true);
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ token: string }> }
) {
  return handleAudioRequest(request, context, false);
}

async function handleAudioRequest(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
  isHead: boolean
) {
  const { token } = await context.params;
  if (!token) {
    return new NextResponse("Audio token required", { status: 400, headers: CORS_HEADERS });
  }

  const payload = verifyAndDecodeAudioToken(token);
  if (!payload || !payload.trackId) {
    return new NextResponse("Invalid or expired audio token", { status: 403, headers: CORS_HEADERS });
  }

  const rangeHeader = request.headers.get("range");

  // 1. Check in-memory LRU cache
  const cached = getCachedAudio(payload.trackId);
  if (cached) {
    return serveBufferWithRange(cached.buffer, cached.contentType, rangeHeader, isHead);
  }

  // 2. Fetch track metadata from database
  const track = await prisma.track.findUnique({
    where: { id: payload.trackId },
    select: { id: true, title: true, artist: true, previewUrl: true, deezerUrl: true },
  });

  if (!track) {
    return new NextResponse("Track not found", { status: 404, headers: CORS_HEADERS });
  }

  // 3. Multi-tier resolution cascade
  const fetchHeaders: Record<string, string> = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  };
  if (rangeHeader) {
    fetchHeaders["range"] = rangeHeader;
  }

  let finalAudioBuffer: Buffer | null = null;
  let detectedContentType = "audio/mpeg";
  let freshResolvedUrl: string | null = null;
  let freshDeezerUrl: string | null = null;

  // Candidates in prioritized order:
  const candidateUrls: { url: string | null | undefined; type: "primary" | "deezer" }[] = [
    { url: track.previewUrl, type: "primary" },
    { url: track.deezerUrl, type: "deezer" },
  ];

  for (const candidate of candidateUrls) {
    if (!candidate.url || !candidate.url.startsWith("http") || candidate.url.includes("undefined")) {
      continue;
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const upstreamRes = await fetch(candidate.url, {
        headers: fetchHeaders,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (upstreamRes.ok || upstreamRes.status === 206) {
        const arrayBuf = await upstreamRes.arrayBuffer();
        finalAudioBuffer = Buffer.from(arrayBuf);
        detectedContentType =
          upstreamRes.headers.get("content-type") ||
          (candidate.url.includes(".mp3") ? "audio/mpeg" : "audio/mp4");
        break;
      }
    } catch {}
  }

  // 4. Live fallback resolution if stored URLs failed
  if (!finalAudioBuffer) {
    // Attempt Live Deezer
    const deezerPreview = await resolveDeezerLive(track.title, track.artist);
    if (deezerPreview) {
      try {
        const res = await fetch(deezerPreview, { headers: fetchHeaders });
        if (res.ok || res.status === 206) {
          const arrayBuf = await res.arrayBuffer();
          finalAudioBuffer = Buffer.from(arrayBuf);
          detectedContentType = "audio/mpeg";
          freshDeezerUrl = deezerPreview;
        }
      } catch {}
    }

    // Attempt Live Apple Music
    if (!finalAudioBuffer) {
      const applePreview = await resolveAppleLive(track.title, track.artist);
      if (applePreview) {
        try {
          const res = await fetch(applePreview, { headers: fetchHeaders });
          if (res.ok || res.status === 206) {
            const arrayBuf = await res.arrayBuffer();
            finalAudioBuffer = Buffer.from(arrayBuf);
            detectedContentType = res.headers.get("content-type") || "audio/mp4";
            freshResolvedUrl = applePreview;
          }
        } catch {}
      }
    }
  }

  // 5. Self-healing DB write-back in background
  if (freshResolvedUrl || freshDeezerUrl) {
    prisma.track
      .update({
        where: { id: track.id },
        data: {
          ...(freshResolvedUrl ? { previewUrl: freshResolvedUrl } : {}),
          ...(freshDeezerUrl ? { deezerUrl: freshDeezerUrl } : {}),
        },
      })
      .catch((err) => console.warn("Background audio self-healing write-back failed:", err));
  }

  // 6. Final safety fallback: Valid synthesized PCM WAV stream
  if (!finalAudioBuffer) {
    finalAudioBuffer = createSynthesizedWavBuffer();
    detectedContentType = "audio/wav";
  }

  // Cache resolved buffer
  setCachedAudio(payload.trackId, finalAudioBuffer, detectedContentType);

  // Serve with range slicing support
  return serveBufferWithRange(finalAudioBuffer, detectedContentType, rangeHeader, isHead);
}
