import { toCanonicalString, normalizeSearchText, getHighlightSegments } from "./test-canonical-highlights";

export function getSearchVariants(text: string): string[] {
  const norm = normalizeSearchText(text);
  const rawClean = text.toLowerCase().replace(/[\u0300-\u036f]/g, "").trim();
  const canonical = toCanonicalString(text).trim();
  const collapsed = norm.replace(/\s+/g, "");
  const withPlus = norm.replace(/\bplus\b/g, "+").replace(/\s+/g, "");
  const withWords = norm.replace(/\+/g, " plus ").replace(/\s+/g, " ").trim();
  const withoutSymbols = text.toLowerCase().replace(/[^\w\s]/gi, " ").replace(/\s+/g, " ").trim();

  return Array.from(new Set([norm, rawClean, canonical, collapsed, withPlus, withWords, withoutSymbols])).filter(Boolean);
}

export function isGuessMatch(
  secretTrack: { id: string; title: string; artist: string },
  guessTrackId?: string,
  guessText?: string
): boolean {
  if (guessTrackId && guessTrackId === secretTrack.id) {
    return true;
  }

  if (!guessText || !guessText.trim()) {
    return false;
  }

  const normGuess = normalizeSearchText(guessText);
  const normTitle = normalizeSearchText(secretTrack.title);
  const normArtist = normalizeSearchText(secretTrack.artist);
  const combined = `${normTitle} ${normArtist}`;
  const revCombined = `${normArtist} ${normTitle}`;

  if (
    normGuess === normTitle ||
    normGuess === combined ||
    normGuess === revCombined ||
    (normGuess.includes(normTitle) && normGuess.includes(normArtist))
  ) {
    return true;
  }

  // Canonical checks
  const canonGuess = toCanonicalString(guessText).replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const canonTitle = toCanonicalString(secretTrack.title).replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const canonArtist = toCanonicalString(secretTrack.artist).replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const canonCombined = `${canonTitle} ${canonArtist}`;
  const canonRev = `${canonArtist} ${canonTitle}`;

  if (
    canonGuess === canonTitle ||
    canonGuess === canonCombined ||
    canonGuess === canonRev ||
    (canonGuess.includes(canonTitle) && canonGuess.includes(canonArtist))
  ) {
    return true;
  }

  // Test search variants
  const titleVariants = getSearchVariants(secretTrack.title);
  const guessVariants = getSearchVariants(guessText);

  for (const gv of guessVariants) {
    if (titleVariants.includes(gv)) return true;
  }

  return false;
}

const matchTests = [
  { track: { id: "1", title: "1+1", artist: "Beyoncé" }, guesses: ["1+1", "1 + 1", "1 plus 1", "beyonce 1+1", "1+1 - Beyoncé", "1+1 - Beyonce", "1+1 beyonce"] },
  { track: { id: "2", title: "Halo", artist: "Beyoncé" }, guesses: ["Halo", "halo", "Halo - Beyoncé", "Halo - Beyonce"] },
  { track: { id: "3", title: "So What", artist: "P!nk" }, guesses: ["So What", "So What - P!nk", "So What - Pink", "so what - pink"] },
  { track: { id: "4", title: "Kickstart My Heart", artist: "Mötley Crüe" }, guesses: ["Kickstart My Heart", "Kickstart My Heart - Motley Crue", "Kickstart My Heart - Mötley Crüe", "kickstart my heart"] },
  { track: { id: "5", title: "TiK ToK", artist: "Ke$ha" }, guesses: ["TiK ToK", "tik tok", "TiK ToK - Ke$ha", "Tik Tok - Kesha"] },
];

for (const t of matchTests) {
  console.log(`\nSecret: "${t.track.title}" by "${t.track.artist}"`);
  for (const g of t.guesses) {
    const matched = isGuessMatch(t.track, undefined, g);
    console.log(`  Guess: "${g.padEnd(35)}" -> ${matched ? "MATCHED ✅" : "FAILED ❌"}`);
  }
}
