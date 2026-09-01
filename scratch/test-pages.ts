async function testAllPages() {
  console.log("🌐 Testing all Updated Frontend Pages & Routes...\n");

  const baseUrl = "http://localhost:3000";
  const routes = [
    "/",
    "/play",
    "/daily",
    "/daily/easy",
    "/daily/medium",
    "/daily/hard",
    "/daily/expert",
    "/daily/impossible",
    "/playlists",
    "/playlists/80s",
    "/playlists/90s",
    "/playlists/2000s",
    "/playlists/2010s",
    "/playlists/2020s",
    "/playlists/rock",
    "/playlists/hiphop",
    "/playlists/soundtracks",
    "/leaderboard",
    "/stats",
  ];

  let passed = 0;
  for (const route of routes) {
    const url = `${baseUrl}${route}`;
    const res = await fetch(url);
    if (res.status === 200) {
      console.log(`✅ [200 OK] ${route}`);
      passed++;
    } else {
      console.error(`❌ [${res.status}] ${route}`);
    }
  }

  console.log(`\n🎉 Page verification: ${passed}/${routes.length} routes returned 200 OK!`);
  if (passed !== routes.length) {
    process.exit(1);
  }
}

testAllPages();
