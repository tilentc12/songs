import { getHighlightSegments, normalizeSearchText } from "../src/lib/search";

const testCases = [
  { text: "1+1", query: "beyonce 1+1" },
  { text: "Beyoncé", query: "beyonce 1+1" },
  { text: "1+1", query: "1+1" },
  { text: "1+1", query: "1 + 1" },
  { text: "Beyoncé", query: "beyonce" },
  { text: "Halo", query: "Halo" },
  { text: "P!nk", query: "p!nk" },
  { text: "P!nk", query: "pink" },
  { text: "Pink Floyd", query: "p!nk" },
  { text: "Mötley Crüe", query: "mötley crüe" },
  { text: "Mötley Crüe", query: "motley crue" },
  { text: "Ke$ha", query: "kesha" },
  { text: "Kesha", query: "Ke$ha" },
  { text: "AC/DC", query: "ac dc" },
  { text: "Panic! At The Disco", query: "panic at the disco" },
];

for (const { text, query } of testCases) {
  const segs = getHighlightSegments(text, query);
  const matchedText = segs.filter(s => s.isMatch).map(s => s.text).join("");
  console.log(`Text: "${text}" | Query: "${query}" -> Segments: ${JSON.stringify(segs)} | Matched: "${matchedText}"`);
}
