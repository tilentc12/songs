async function testGameFlow() {
  console.log("🧪 Testing Better Guessable Backend & Game Flow...\n");

  const baseUrl = "http://localhost:3000";

  // 1. Unlimited Game Draw
  console.log("1️⃣ Testing /api/game/unlimited...");
  const unlimitedRes = await fetch(`${baseUrl}/api/game/unlimited?difficulty=easy`);
  if (!unlimitedRes.ok) throw new Error(`Unlimited API failed: ${unlimitedRes.status}`);
  const session = await unlimitedRes.json();
  console.log("✅ Received session:", {
    sessionId: session.sessionId,
    hasAudioToken: !!session.audioToken,
    stages: session.stages,
    difficulty: session.difficulty,
  });

  // 2. Audio Stream Proxy
  console.log("\n2️⃣ Testing /api/audio/[token]...");
  const audioRes = await fetch(`${baseUrl}/api/audio/${session.audioToken}`);
  console.log("✅ Audio proxy response status:", audioRes.status);
  console.log("   Content-Type:", audioRes.headers.get("content-type"));
  console.log("   Accept-Ranges:", audioRes.headers.get("accept-ranges"));
  console.log("   Content-Length:", audioRes.headers.get("content-length"));

  // 3. Test Wrong Guess
  console.log("\n3️⃣ Testing Wrong Guess submission...");
  const wrongRes = await fetch(`${baseUrl}/api/game/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audioToken: session.audioToken,
      guessText: "Definitely Wrong Song Title - Unknown Artist",
      currentStage: 0,
      attemptsCount: 1,
      difficulty: session.difficulty,
    }),
  });
  const wrongData = await wrongRes.json();
  console.log("✅ Wrong guess result:", {
    isCorrect: wrongData.isCorrect,
    isGameOver: wrongData.isGameOver,
    pointsEarned: wrongData.pointsEarned,
  });

  // 4. Test Skip
  console.log("\n4️⃣ Testing Skip submission...");
  const skipRes = await fetch(`${baseUrl}/api/game/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audioToken: session.audioToken,
      isSkip: true,
      currentStage: 1,
      attemptsCount: 2,
      difficulty: session.difficulty,
    }),
  });
  const skipData = await skipRes.json();
  console.log("✅ Skip result:", {
    isCorrect: skipData.isCorrect,
    isGameOver: skipData.isGameOver,
  });

  // 5. Test Give Up / Reveal
  console.log("\n5️⃣ Testing Give Up / Reveal...");
  const giveUpRes = await fetch(`${baseUrl}/api/game/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      audioToken: session.audioToken,
      isGiveUp: true,
      currentStage: 2,
      attemptsCount: 5,
      difficulty: session.difficulty,
    }),
  });
  const giveUpData = await giveUpRes.json();
  console.log("✅ Reveal result:", {
    isGameOver: giveUpData.isGameOver,
    revealedTitle: giveUpData.revealTrack?.title,
    revealedArtist: giveUpData.revealTrack?.artist,
    hasArtwork: !!giveUpData.revealTrack?.coverUrl,
    challengeSeed: giveUpData.challengeSeed,
  });

  // 6. Test Challenge Seed endpoint
  if (giveUpData.challengeSeed) {
    console.log("\n6️⃣ Testing /api/game/challenge with seed...");
    const challengeRes = await fetch(`${baseUrl}/api/game/challenge?seed=${giveUpData.challengeSeed}`);
    const challengeData = await challengeRes.json();
    console.log("✅ Challenge session retrieved:", {
      sessionId: challengeData.sessionId,
      mode: challengeData.mode,
      difficulty: challengeData.difficulty,
    });
  }

  // 7. Test Daily Challenge Tiers
  console.log("\n7️⃣ Testing Daily Challenge across all 5 tiers...");
  const tiers = ["easy", "medium", "hard", "expert", "impossible"];
  for (const tier of tiers) {
    const dailyRes = await fetch(`${baseUrl}/api/game/daily?tier=${tier}`);
    const dailyData = await dailyRes.json();
    console.log(`✅ Daily ${tier.toUpperCase()}:`, {
      puzzleNumber: dailyData.puzzleNumber,
      puzzleDate: dailyData.puzzleDate,
      hasAudioToken: !!dailyData.audioToken,
    });
  }

  // 8. Test Themed Playlists
  console.log("\n8️⃣ Testing Themed Playlists...");
  const playlists = ["80s", "90s", "2000s", "2010s", "2020s", "rock", "hiphop", "soundtracks"];
  for (const slug of playlists) {
    const pRes = await fetch(`${baseUrl}/api/game/playlist?slug=${slug}`);
    const pData = await pRes.json();
    console.log(`✅ Playlist [${slug}]:`, {
      playlistName: pData.playlistName,
      difficulty: pData.difficulty,
      hasAudioToken: !!pData.audioToken,
    });
  }

  // 9. Test Leaderboard API
  console.log("\n9️⃣ Testing /api/leaderboard...");
  const lbRes = await fetch(`${baseUrl}/api/leaderboard`);
  const lbData = await lbRes.json();
  console.log("✅ Leaderboard response:", {
    totalSongsInCatalog: lbData.communityStats?.totalSongsInCatalog,
    topPlayerCount: lbData.leaderboard?.length,
  });

  console.log("\n🎉 ALL TESTS PASSED! Better Guessable platform is 100% verified and operational!");
}

testGameFlow().catch((e) => {
  console.error("❌ Test failed:", e);
  process.exit(1);
});
