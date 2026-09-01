"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Fuse from "fuse.js";
import { Search, SkipForward, X, Check } from "lucide-react";
import { SearchTrackItem } from "@/lib/types";
import { CoverArtwork } from "./CoverArtwork";

interface SongSearchComboboxProps {
  tracks: SearchTrackItem[];
  onSubmitGuess: (track: SearchTrackItem | null, customText?: string) => void;
  onSkip: () => void;
  disabled?: boolean;
  accentColor?: string;
}

// Normalize text: strip diacritics, lowercase, replace symbols
function normalizeText(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents (e.g. é -> e, ö -> o, ü -> u, ñ -> n)
    .toLowerCase()
    .replace(/[\$]/g, "s")
    .replace(/[&]/g, "and")
    .replace(/[+]/g, " plus ");
}

// Clean text: replaces punctuation with whitespace
function cleanText(str: string): string {
  return normalizeText(str)
    .replace(/[^a-z0-9\s]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Stripped text: removes all non-alphanumerics (e.g. "1+1" -> "11", "Spider-Man" -> "spiderman")
function stripAll(str: string): string {
  return normalizeText(str).replace(/[^a-z0-9]/gi, "");
}

interface IndexedTrack {
  track: SearchTrackItem;
  normTitle: string;
  normArtist: string;
  cleanTitle: string;
  cleanArtist: string;
  strippedTitle: string;
  strippedArtist: string;
  combinedClean: string; // "1 1 beyonce" / "1 plus 1 beyonce"
  combinedStripped: string; // "11beyonce"
  allTokens: string[];
}

export function SongSearchCombobox({
  tracks,
  onSubmitGuess,
  onSkip,
  disabled = false,
  accentColor = "#10b981",
}: SongSearchComboboxProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchTrackItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [isSkipCoolingDown, setIsSkipCoolingDown] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const skipTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Build fast pre-computed index for all tracks
  const indexedTracks = useMemo<IndexedTrack[]>(() => {
    if (!tracks || tracks.length === 0) return [];
    return tracks.map((t) => {
      const normTitle = normalizeText(t.title);
      const normArtist = normalizeText(t.artist);
      const cleanTitle = cleanText(t.title);
      const cleanArtist = cleanText(t.artist);
      const strippedTitle = stripAll(t.title);
      const strippedArtist = stripAll(t.artist);
      const cleanAlbum = t.album ? cleanText(t.album) : "";
      const combinedClean = `${cleanTitle} ${cleanArtist} ${cleanAlbum}`.trim();
      const combinedStripped = `${strippedTitle}${strippedArtist}`;
      const allTokens = Array.from(
        new Set([
          ...cleanTitle.split(" ").filter(Boolean),
          ...cleanArtist.split(" ").filter(Boolean),
          ...cleanAlbum.split(" ").filter(Boolean),
        ])
      );

      return {
        track: t,
        normTitle,
        normArtist,
        cleanTitle,
        cleanArtist,
        strippedTitle,
        strippedArtist,
        combinedClean,
        combinedStripped,
        allTokens,
      };
    });
  }, [tracks]);

  // 2. Secondary Fuse.js index for deep typo tolerance fallback
  const fuse = useMemo(() => {
    if (!tracks || tracks.length === 0) return null;
    return new Fuse(tracks, {
      keys: [
        { name: "title", weight: 0.6 },
        { name: "artist", weight: 0.4 },
        { name: "album", weight: 0.3 },
        { name: "searchStr", weight: 0.5 },
      ],
      threshold: 0.38,
      minMatchCharLength: 2,
      ignoreLocation: true,
    });
  }, [tracks]);

  // 3. Search Executor: Exact -> Token Intersection -> Substring -> Fuse Fallback
  useEffect(() => {
    const rawQ = query.trim();
    if (!rawQ) {
      setResults([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    const normQ = normalizeText(rawQ);
    const cleanQ = cleanText(rawQ);
    const strippedQ = stripAll(rawQ);
    const tokens = cleanQ.split(" ").filter(Boolean);

    // Direct tokenized search scoring
    interface ScoredMatch {
      track: SearchTrackItem;
      score: number;
    }

    const directMatches: ScoredMatch[] = [];

    for (const item of indexedTracks) {
      let score = 0;

      // Exact Title Match ("1+1", "1 1", "11", "Halo")
      if (
        item.normTitle === normQ ||
        item.cleanTitle === cleanQ ||
        item.strippedTitle === strippedQ
      ) {
        score += 1200;
      }
      // Exact Artist Match ("Beyonce", "The Weeknd")
      else if (
        item.normArtist === normQ ||
        item.cleanArtist === cleanQ ||
        item.strippedArtist === strippedQ
      ) {
        score += 800;
      }

      // Title Prefix Match ("1+", "Hal", "Blinding")
      if (
        item.cleanTitle.startsWith(cleanQ) ||
        item.strippedTitle.startsWith(strippedQ) ||
        item.normTitle.startsWith(normQ)
      ) {
        score += 600;
      }

      // Artist Prefix Match ("Bey", "Weekn", "Tayl")
      if (
        item.cleanArtist.startsWith(cleanQ) ||
        item.strippedArtist.startsWith(strippedQ) ||
        item.normArtist.startsWith(normQ)
      ) {
        score += 400;
      }

      // Multi-Token Intersection (Matches "beyonce 1+1", "1+1 beyonce", "naruto silhouette", "minecraft theme")
      if (tokens.length > 1) {
        let matchedTokens = 0;
        for (const token of tokens) {
          const strippedTok = stripAll(token);
          const hasInTokens = item.allTokens.some(
            (t) => t === token || t.startsWith(token)
          );
          const hasInClean =
            item.cleanTitle.includes(token) || item.cleanArtist.includes(token) || item.combinedClean.includes(token);
          const hasInStripped =
            strippedTok.length > 0 &&
            (item.strippedTitle.includes(strippedTok) ||
              item.strippedArtist.includes(strippedTok) ||
              item.combinedStripped.includes(strippedTok));

          if (hasInTokens || hasInClean || hasInStripped) {
            matchedTokens++;
          }
        }

        if (matchedTokens === tokens.length) {
          score += 700 + tokens.length * 50;
        } else if (matchedTokens > 0) {
          score += matchedTokens * 80;
        }
      }

      // Substring Containment
      if (
        item.cleanTitle.includes(cleanQ) ||
        item.normTitle.includes(normQ) ||
        (strippedQ.length >= 2 && item.strippedTitle.includes(strippedQ))
      ) {
        score += 350;
      }

      if (
        item.cleanArtist.includes(cleanQ) ||
        item.normArtist.includes(normQ) ||
        (strippedQ.length >= 2 && item.strippedArtist.includes(strippedQ))
      ) {
        score += 200;
      }

      // Combined Substring ("1+1 beyonce" -> "1 1 beyonce" in "1 1 beyonce")
      if (item.combinedClean.includes(cleanQ)) {
        score += 500;
      }

      if (score > 0) {
        directMatches.push({ track: item.track, score });
      }
    }

    // Sort direct matches descending by score
    directMatches.sort((a, b) => b.score - a.score);
    let finalItems = directMatches.slice(0, 10).map((m) => m.track);

    // If direct token matches are fewer than 8, supplement with Fuse fuzzy matches for typos
    if (finalItems.length < 8 && fuse) {
      const existingIds = new Set(finalItems.map((t) => t.id));
      const fuseResults = fuse.search(rawQ).slice(0, 8);
      for (const fr of fuseResults) {
        if (!existingIds.has(fr.item.id)) {
          finalItems.push(fr.item);
          existingIds.add(fr.item.id);
        }
        if (finalItems.length >= 10) break;
      }
    }

    setResults(finalItems);
    setIsOpen(finalItems.length > 0);
    setSelectedIndex(finalItems.length > 0 ? 0 : -1);
  }, [query, indexedTracks, fuse]);

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex]);

  // Close when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Cooldown timer cleanup
  useEffect(() => {
    return () => {
      if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    };
  }, []);

  const handleSkipWithCooldown = useCallback(() => {
    if (disabled || isSkipCoolingDown) return;
    setIsSkipCoolingDown(true);
    onSkip();
    if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
    skipTimerRef.current = setTimeout(() => {
      setIsSkipCoolingDown(false);
    }, 1000);
  }, [disabled, isSkipCoolingDown, onSkip]);

  const handleSelectTrack = useCallback(
    (track: SearchTrackItem) => {
      onSubmitGuess(track);
      setQuery("");
      setIsOpen(false);
      setSelectedIndex(-1);
    },
    [onSubmitGuess]
  );

  const handleSubmitCustom = useCallback(() => {
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleSelectTrack(results[selectedIndex]);
    } else if (query.trim()) {
      onSubmitGuess(null, query.trim());
      setQuery("");
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }, [selectedIndex, results, query, handleSelectTrack, onSubmitGuess]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!isOpen && results.length > 0) {
        setIsOpen(true);
        setSelectedIndex(0);
      } else {
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSubmitCustom();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  // Safe Multi-Token Highlighting
  const renderHighlighted = (text: string, currentQuery: string) => {
    if (!currentQuery.trim() || !text) return text;

    const cleanQ = cleanText(currentQuery);
    const queryTokens = Array.from(
      new Set([...cleanQ.split(" ").filter(Boolean), stripAll(currentQuery)])
    ).filter((t) => t.length > 0);

    if (queryTokens.length === 0) return text;

    // Build regex pattern safely escaping each token
    const pattern = queryTokens
      .map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
      .join("|");

    if (!pattern) return text;

    try {
      const regex = new RegExp(`(${pattern})`, "gi");
      const parts = text.split(regex);
      return parts.map((part, i) => {
        const isMatch = queryTokens.some(
          (tok) =>
            tok.toLowerCase() === normalizeText(part) ||
            tok.toLowerCase() === stripAll(part)
        );
        return isMatch ? (
          <span key={i} style={{ color: accentColor }} className="font-black underline">
            {part}
          </span>
        ) : (
          part
        );
      });
    } catch {
      return text;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="flex w-full items-center gap-2">
        <div className="relative flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
            <Search className="size-4" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={query}
            disabled={disabled}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (results.length > 0) setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={disabled ? "Round complete" : "Search song title or artist..."}
            className="h-12 w-full rounded-2xl border border-border bg-surface pl-10 pr-10 text-sm font-semibold text-foreground placeholder:text-muted-foreground/60 transition-all focus:border-border focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              ["--tw-ring-color" as any]: `${accentColor}40`,
            }}
          />

          {query && (
            <button
              onClick={() => {
                setQuery("");
                setIsOpen(false);
                inputRef.current?.focus();
              }}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {query.trim().length > 0 ? (
          <button
            onClick={handleSubmitCustom}
            disabled={disabled}
            style={{ backgroundColor: accentColor }}
            className="flex h-12 items-center gap-1.5 rounded-2xl px-5 text-xs font-black text-black shadow-lg transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Check className="size-4 stroke-[3]" />
            <span>Submit</span>
          </button>
        ) : (
          <button
            onClick={handleSkipWithCooldown}
            disabled={disabled || isSkipCoolingDown}
            title={isSkipCoolingDown ? "Please wait a moment..." : "Skip to next audio stage"}
            className={`flex h-12 items-center gap-1.5 rounded-2xl border border-border bg-surface px-4 text-xs font-bold transition-all ${
              isSkipCoolingDown
                ? "opacity-50 cursor-not-allowed text-muted-foreground/60"
                : "text-muted-foreground hover:bg-card hover:text-foreground active:scale-95 disabled:opacity-50"
            }`}
          >
            <SkipForward className={`size-4 ${isSkipCoolingDown ? "animate-pulse" : ""}`} />
            <span>{isSkipCoolingDown ? "Wait 1s" : "Skip"}</span>
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-border bg-card p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-100"
        >
          {results.map((track, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <li
                key={track.id}
                onClick={() => handleSelectTrack(track)}
                onMouseEnter={() => setSelectedIndex(idx)}
                className={`flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                  isSelected
                    ? "bg-surface text-foreground font-semibold border border-border"
                    : "text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-3 truncate">
                  <CoverArtwork
                    coverUrl={track.coverUrl}
                    title={track.title}
                    artist={track.artist}
                    className="size-9 shrink-0 shadow-sm border border-border/60"
                    roundedClassName="rounded-lg"
                  />

                  <div className="flex flex-col truncate">
                    <span className="truncate text-sm font-bold text-foreground">
                      {renderHighlighted(track.title, query)}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {renderHighlighted(track.artist, query)}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <span
                    style={{ color: accentColor }}
                    className="text-[10px] font-mono font-bold shrink-0 pl-2"
                  >
                    Enter ↵
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
