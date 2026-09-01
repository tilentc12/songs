import { prisma } from "../src/lib/prisma";

async function checkAudio() {
  const track = await prisma.track.findFirst();
  console.log("Track:", track?.title, track?.artist);
  console.log("Preview URL:", track?.previewUrl);

  try {
    const res = await fetch(track!.previewUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    console.log("Upstream status:", res.status, res.statusText);
    console.log("Headers:", Object.fromEntries(res.headers.entries()));
    const buf = await res.arrayBuffer();
    console.log("Byte length:", buf.byteLength);
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

checkAudio().finally(() => prisma.$disconnect());
