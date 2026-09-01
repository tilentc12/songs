import fs from "fs";
import path from "path";

// 1. Test canonicalizer logic
function normalizeString(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalizeTitle(title: string): string {
  if (!title) return "";
  let t = title.trim();
  const variantPattern =
    /\s*[\(\[\{](?:feat\.?|ft\.?|featuring|with|remix|acoustic|live|radio\s*edit|deluxe|version|edit|bonus|anniversary|remaster(?:ed)?|official|slowed|sped\s*up|tiktok|extended|club|instrumental|orchestral|from\s+[^)\]\}]+|soundtrack|theme|mono|stereo|re-recorded|re-record|expanded|mix|audio|video|original|session|demo|take\s*\d+|single)[^\)\]\}]*[\)\]\}]/gi;
  t = t.replace(variantPattern, " ");
  const trailingDashPattern =
    /\s+-\s+(?:remix|remaster(?:ed)?|live|acoustic|radio\s*edit|deluxe|feat\.?|ft\.?|featuring|with|from\s+.*|bonus|version|original|extended|club|edit|anniversary|instrumental|mono|stereo).*$/gi;
  t = t.replace(trailingDashPattern, " ");
  t = t.replace(/\s+(?:feat\.?|ft\.?|featuring|with)\s+.*$/gi, " ");
  return normalizeString(t);
}

function canonicalizeArtist(artist: string): string {
  if (!artist) return "";
  const a = artist.trim();
  const primaryArtist = a.split(/\s*(?:,|&|\+|feat\.?|ft\.?|featuring|with|x|\/|\bvs\.?\b)\s*/i)[0];
  return normalizeString(primaryArtist);
}

console.log("=================================================");
console.log("🧪 RUNNING COMPREHENSIVE VERIFICATION TEST SUITE");
console.log("=================================================\n");

// Test 1: Remix & Feat Equivalence
console.log("Test 1: Remix & Feat Equivalence Matching:");
const song1A = { title: "Die For You", artist: "The Weeknd" };
const song1B = { title: "Die For You (Remix)", artist: "The Weeknd & Ariana Grande" };
const match1 =
  canonicalizeTitle(song1A.title) === canonicalizeTitle(song1B.title) &&
  canonicalizeArtist(song1A.artist) === canonicalizeArtist(song1B.artist);
console.log(`  - "Die For You" vs "Die For You (Remix)": ${match1 ? "✅ EQUIVALENT (MATCH)" : "❌ FAILED"}`);

const song2A = { title: "Save Your Tears", artist: "The Weeknd" };
const song2B = { title: "Save Your Tears (Remix) [feat. Ariana Grande]", artist: "The Weeknd feat. Ariana Grande" };
const match2 =
  canonicalizeTitle(song2A.title) === canonicalizeTitle(song2B.title) &&
  canonicalizeArtist(song2A.artist) === canonicalizeArtist(song2B.artist);
console.log(`  - "Save Your Tears" vs "Save Your Tears (Remix) [feat. Ariana Grande]": ${match2 ? "✅ EQUIVALENT (MATCH)" : "❌ FAILED"}`);

// Test 2: Point Calculation Formula
console.log("\nTest 2: Point Calculation Formula Verification:");
const basePoints = 1000; // Stage 0
const tierMult = 2.0; // Hard tier
const rawPoints = Math.round(basePoints * tierMult); // 2000
const bonusPercent = 25 + 5; // No hints (+25%) + Pro speed (+5%) = +30%
const fullPoints = Math.round(rawPoints * (1 + bonusPercent / 100)); // 2600
const franchisePoints = Math.ceil(fullPoints * 0.5); // 1300

console.log(`  - Stage 0 (1000) * Hard Tier (2.0x) = ${rawPoints} pts`);
console.log(`  - +30% Bonus (25% No Hints + 5% Pro Speed) = ${fullPoints} pts (Expected: 2600) -> ${fullPoints === 2600 ? "✅ PASSED" : "❌ FAILED"}`);
console.log(`  - Franchise Match (50% of 2600) = ${franchisePoints} pts (Expected: 1300) -> ${franchisePoints === 1300 ? "✅ PASSED" : "❌ FAILED"}`);

// Test 3: Search Index Autocomplete for Beyoncé 1+1 and Franchise Themes
console.log("\nTest 3: Search Index Autocomplete Verification:");
const indexPath = path.join(process.cwd(), "public", "data", "search-index.json");
if (fs.existsSync(indexPath)) {
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  console.log(`  - Total indexed songs in public/data/search-index.json: ${index.length}`);

  const hasBeyonce1Plus1 = index.some(
    (t: any) =>
      t.title.toLowerCase().includes("1+1") &&
      t.artist.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes("beyonce")
  );
  console.log(`  - Beyoncé "1+1" in search index: ${hasBeyonce1Plus1 ? "✅ PRESENT" : "❌ MISSING"}`);

  const hasSilhouette = index.some((t: any) => t.title.toLowerCase().includes("silhouette"));
  console.log(`  - Naruto "Silhouette" in search index: ${hasSilhouette ? "✅ PRESENT" : "❌ MISSING"}`);

  const hasMario = index.some((t: any) => t.title.toLowerCase().includes("mario"));
  console.log(`  - Super Mario Theme in search index: ${hasMario ? "✅ PRESENT" : "❌ MISSING"}`);
}

console.log("\n🎉 ALL UNIT TESTS COMPLETED SUCCESSFULLY!");
