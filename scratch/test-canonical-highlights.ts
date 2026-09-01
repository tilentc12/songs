export function toCanonicalChar(ch: string): string {
  // NFD normalize and remove combining diacritics
  const norm = ch.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  if (norm === "$") return "s";
  if (norm === "!") return "i";
  return norm;
}

export function toCanonicalString(text: string): string {
  if (!text) return "";
  let result = "";
  for (const ch of text) {
    result += toCanonicalChar(ch);
  }
  return result;
}

export function normalizeSearchText(text: string): string {
  if (!text) return "";
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Strip diacritics
    .toLowerCase()
    .replace(/[\u2018\u2019\u201B\u2032]/g, "'") // Normalize smart single quotes
    .replace(/[\u201C\u201D\u2033]/g, '"') // Normalize smart double quotes
    .replace(/\+/g, " + ") // Ensure space around +
    .replace(/&/g, " and ")
    .replace(/\$/g, "s") // Ke$ha, A$AP
    .replace(/([a-z0-9])!([a-z0-9])/gi, "$1i$2") // P!nk -> Pink
    .replace(/[!¡?¿]/g, " ") // Panic!, Chop Suey!
    .replace(/[\/\\#,_.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getHighlightSegments(
  text: string,
  highlight: string
): Array<{ text: string; isMatch: boolean }> {
  if (!text || !highlight.trim()) {
    return [{ text: text || "", isMatch: false }];
  }

  const canonicalText = toCanonicalString(text);
  const rawTextLower = text.toLowerCase();

  // Extract all potential tokens from highlight
  const tokensToSearch = new Set<string>();

  // 1. Raw tokens
  for (const t of highlight.toLowerCase().split(/\s+/)) {
    if (t.length > 0) tokensToSearch.add(t);
  }

  // 2. Canonical tokens (handling !, $, diacritics)
  for (const t of highlight.split(/\s+/)) {
    const canon = toCanonicalString(t);
    if (canon.length > 0) tokensToSearch.add(canon);
  }

  // 3. Normalized tokens from search text normalization
  for (const t of normalizeSearchText(highlight).split(/\s+/)) {
    if (t.length > 0) tokensToSearch.add(t);
  }

  // 4. Compact variants (e.g. "1+1" from "1 + 1" or vice versa)
  const compactHighlight = highlight.replace(/\s+/g, "").toLowerCase();
  if (compactHighlight.length > 0) {
    tokensToSearch.add(compactHighlight);
    tokensToSearch.add(toCanonicalString(compactHighlight));
  }

  const intervals: Array<{ start: number; end: number }> = [];

  for (const token of tokensToSearch) {
    if (!token) continue;

    // Search in canonicalText
    let startIdx = 0;
    while ((startIdx = canonicalText.indexOf(token, startIdx)) !== -1) {
      intervals.push({ start: startIdx, end: Math.min(text.length, startIdx + token.length) });
      startIdx += 1;
    }

    // Search in rawTextLower
    startIdx = 0;
    while ((startIdx = rawTextLower.indexOf(token, startIdx)) !== -1) {
      intervals.push({ start: startIdx, end: Math.min(text.length, startIdx + token.length) });
      startIdx += 1;
    }
  }

  if (intervals.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Merge overlapping intervals
  intervals.sort((a, b) => a.start - b.start);
  const merged: Array<{ start: number; end: number }> = [intervals[0]];

  for (let i = 1; i < intervals.length; i++) {
    const prev = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr.start <= prev.end) {
      prev.end = Math.max(prev.end, curr.end);
    } else {
      merged.push(curr);
    }
  }

  // Map intervals back to original string
  const segments: Array<{ text: string; isMatch: boolean }> = [];
  let cursor = 0;

  for (const interval of merged) {
    const start = Math.max(0, Math.min(text.length, interval.start));
    const end = Math.max(start, Math.min(text.length, interval.end));

    if (start > cursor) {
      segments.push({ text: text.slice(cursor, start), isMatch: false });
    }
    if (end > start) {
      segments.push({ text: text.slice(start, end), isMatch: true });
    }
    cursor = end;
  }

  if (cursor < text.length) {
    segments.push({ text: text.slice(cursor), isMatch: false });
  }

  return segments;
}

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
  { text: "Pink Floyd", query: "pink" },
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
  console.log(`Text: "${text.padEnd(20)}" | Query: "${query.padEnd(20)}" -> Segments: ${JSON.stringify(segs)} | Matched: "${matchedText}"`);
}
