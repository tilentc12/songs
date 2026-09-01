import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyAndDecodeAudioToken, encodeChallengeSeed } from "@/lib/crypto";
import { GuessResultResponse, TrackSummary, DifficultyTier, ScoreBreakdown } from "@/lib/types";

const STAGE_BASE_POINTS: Record<number, number> = {
  0: 1000,
  1: 800,
  2: 600,
  3: 400,
  4: 200,
};

const TIER_MULTIPLIERS: Record<DifficultyTier, number> = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
  expert: 2.5,
  impossible: 3.0,
};

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

  // Strip parenthetical/bracketed variant tags: (remix), [feat. ...], (deluxe), (live), (acoustic), (radio edit), (official audio), (bonus track), (anniversary), etc.
  const variantPattern =
    /\s*[\(\[\{](?:feat\.?|ft\.?|featuring|with|remix|acoustic|live|radio\s*edit|deluxe|version|edit|bonus|anniversary|remaster(?:ed)?|official|slowed|sped\s*up|tiktok|extended|club|instrumental|orchestral|from\s+[^)\]\}]+|soundtrack|theme|mono|stereo|re-recorded|re-record|expanded|mix|audio|video|original|session|demo|take\s*\d+|single)[^\)\]\}]*[\)\]\}]/gi;
  t = t.replace(variantPattern, " ");

  // Strip trailing dash suffixes like " - Remix", " - 2011 Remaster", " - Live", " - Feat. ..."
  const trailingDashPattern =
    /\s+-\s+(?:remix|remaster(?:ed)?|live|acoustic|radio\s*edit|deluxe|feat\.?|ft\.?|featuring|with|from\s+.*|bonus|version|original|extended|club|edit|anniversary|instrumental|mono|stereo).*$/gi;
  t = t.replace(trailingDashPattern, " ");

  // Strip trailing "feat. ..." without parenthesis
  t = t.replace(/\s+(?:feat\.?|ft\.?|featuring|with)\s+.*$/gi, " ");

  return normalizeString(t);
}

function canonicalizeArtist(artist: string): string {
  if (!artist) return "";
  const a = artist.trim();

  // Split on featuring/collaborator delimiters to get primary artist
  const primaryArtist = a.split(/\s*(?:,|&|\+|feat\.?|ft\.?|featuring|with|x|\/|\bvs\.?\b)\s*/i)[0];

  return normalizeString(primaryArtist);
}

function generateMaskedArtist(artist: string): string {
  return artist
    .split(" ")
    .map((word) => {
      if (word.length <= 1) return word;
      return word[0] + "•".repeat(Math.max(1, word.length - 1));
    })
    .join(" ");
}

const FRANCHISE_MAP: Record<string, string[]> = {
  naruto: ["naruto", "naruto shippuden", "boruto"],
  demon_slayer: ["demon slayer", "kimetsu no yaiba"],
  attack_on_titan: ["attack on titan", "shingeki no kyojin", "aot"],
  tokyo_ghoul: ["tokyo ghoul"],
  evangelion: ["neon genesis evangelion", "evangelion"],
  jujutsu_kaisen: ["jujutsu kaisen", "jjk"],
  chainsaw_man: ["chainsaw man"],
  one_piece: ["one piece"],
  dragon_ball: ["dragon ball", "dragon ball z", "dragon ball super", "dbz"],
  death_note: ["death note"],
  bleach: ["bleach"],
  fullmetal: ["fullmetal alchemist", "fullmetal alchemist brotherhood", "fma"],
  my_hero_academia: ["my hero academia", "boku no hero academia", "mha"],
  hunter_x_hunter: ["hunter x hunter", "hunter hunter", "hxh"],
  cowboy_bebop: ["cowboy bebop"],
  jojo: ["jojo", "jojo s bizarre adventure", "jojos bizarre adventure"],
  sword_art_online: ["sword art online", "sao"],
  frieren: ["frieren", "frieren beyond journeys end", "sousou no frieren"],
  solo_leveling: ["solo leveling"],
  bocchi: ["bocchi the rock", "bocchi"],
  spy_family: ["spy x family", "spy family"],
  oshi_no_ko: ["oshi no ko"],
  interstellar: ["interstellar"],
  inception: ["inception"],
  minecraft: ["minecraft"],
  undertale: ["undertale", "deltarune"],
  mario: [
    "super mario",
    "mario",
    "super mario bros",
    "super mario 64",
    "mario kart",
    "super mario galaxy",
    "super mario odyssey",
  ],
  zelda: [
    "legend of zelda",
    "the legend of zelda",
    "zelda",
    "ocarina of time",
    "breath of the wild",
    "tears of the kingdom",
    "majoras mask",
    "wind waker",
  ],
  skyrim: ["skyrim", "the elder scrolls", "elder scrolls"],
  witcher: ["the witcher", "witcher", "witcher 3"],
  souls: ["dark souls", "elden ring", "bloodborne", "sekiro", "demons souls"],
  final_fantasy: ["final fantasy", "ffvii", "ff7", "final fantasy vii"],
  halo: ["halo", "halo 3", "halo reach"],
  gta: [
    "grand theft auto",
    "gta",
    "gta v",
    "gta 5",
    "gta san andreas",
    "gta vice city",
  ],
  persona: ["persona", "persona 5", "persona 4", "persona 3"],
  doom: ["doom", "doom eternal"],
  cyberpunk: ["cyberpunk", "cyberpunk 2077", "cyberpunk edgerunners", "edgerunners"],
  last_of_us: ["the last of us", "last of us", "tlou"],
  god_of_war: ["god of war"],
  star_wars: ["star wars", "the empire strikes back", "return of the jedi"],
  lord_of_the_rings: [
    "lord of the rings",
    "lotr",
    "fellowship of the ring",
    "the two towers",
    "return of the king",
  ],
  harry_potter: ["harry potter"],
  pirates: ["pirates of the caribbean"],
  batman: ["the dark knight", "batman"],
  spider_man: ["spider man", "spider verse", "into the spider verse", "across the spider verse"],
  oppenheimer: ["oppenheimer"],
  dune: ["dune"],
  gladiator: ["gladiator"],
  titanic: ["titanic"],
  ghibli: [
    "studio ghibli",
    "ghibli",
    "spirited away",
    "princess mononoke",
    "howls moving castle",
    "my neighbor totoro",
  ],
  pokemon: ["pokemon"],
  sonic: ["sonic", "sonic the hedgehog"],
  portal: ["portal", "portal 2"],
  hollow_knight: ["hollow knight"],
  cuphead: ["cuphead"],
};

function extractFranchiseKeywords(track: {
  genre: string;
  album?: string | null;
  title: string;
  artist: string;
}): string[] {
  const keywords: Set<string> = new Set();

  if (track.album) {
    const cleanAlbum = track.album
      .replace(
        /\s*[\(\[\{]?(?:original\s*soundtrack|original\s*motion\s*picture\s*soundtrack|music\s*from\s*the\s*motion\s*picture|original\s*game\s*soundtrack|soundtrack|ost|volume\s*alpha|volume\s*beta|kimetsu\s*no\s*yaiba|shingeki\s*no\s*kyojin)[\)\]\}]?/gi,
        ""
      )
      .trim();
    const normalizedAlbum = normalizeString(cleanAlbum);
    if (normalizedAlbum.length >= 3) {
      keywords.add(normalizedAlbum);
    }
  }

  const combinedSearch = normalizeString(
    `${track.album || ""} ${track.title} ${track.artist}`
  );

  for (const group of Object.values(FRANCHISE_MAP)) {
    for (const term of group) {
      if (combinedSearch.includes(term)) {
        group.forEach((kw) => keywords.add(kw));
        break;
      }
    }
  }

  return Array.from(keywords);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      audioToken,
      guessTrackId,
      guessText,
      isSkip = false,
      isGiveUp = false,
      currentStage = 0,
      attemptsCount = 1,
      difficulty = "medium",
      noHintsMode = false,
      isCasual = false,
    } = body;

    if (!audioToken) {
      return NextResponse.json({ error: "Missing audio token" }, { status: 400 });
    }

    const payload = verifyAndDecodeAudioToken(audioToken);
    if (!payload || !payload.trackId) {
      return NextResponse.json({ error: "Invalid audio token" }, { status: 403 });
    }

    const secretTrack = await prisma.track.findUnique({
      where: { id: payload.trackId },
    });

    if (!secretTrack) {
      return NextResponse.json({ error: "Track not found" }, { status: 404 });
    }

    const tierMultiplier = TIER_MULTIPLIERS[difficulty as DifficultyTier] || 1.5;

    let isMatch = false;
    let isFranchiseMatch = false;

    if (!isSkip && !isGiveUp) {
      // 1. Exact ID Match
      if (guessTrackId && guessTrackId === secretTrack.id) {
        isMatch = true;
      }

      // 2. Guessed Track Variant / Remix / Feat Matching via DB track
      let guessedDbTrack = null;
      if (!isMatch && guessTrackId) {
        guessedDbTrack = await prisma.track.findUnique({
          where: { id: guessTrackId },
        });
      }

      const secretCanonicalTitle = canonicalizeTitle(secretTrack.title);
      const secretCanonicalArtist = canonicalizeArtist(secretTrack.artist);

      if (!isMatch && guessedDbTrack) {
        const guessCanonicalTitle = canonicalizeTitle(guessedDbTrack.title);
        const guessCanonicalArtist = canonicalizeArtist(guessedDbTrack.artist);

        const isTitleMatch =
          guessCanonicalTitle === secretCanonicalTitle ||
          (guessCanonicalTitle.length > 3 &&
            secretCanonicalTitle.length > 3 &&
            (guessCanonicalTitle.includes(secretCanonicalTitle) ||
              secretCanonicalTitle.includes(guessCanonicalTitle)));

        const isArtistMatch =
          guessCanonicalArtist === secretCanonicalArtist ||
          guessCanonicalArtist.includes(secretCanonicalArtist) ||
          secretCanonicalArtist.includes(guessCanonicalArtist) ||
          guessCanonicalArtist.replace(/^the\s+/, "") ===
            secretCanonicalArtist.replace(/^the\s+/, "");

        if (isTitleMatch && isArtistMatch) {
          isMatch = true;
        }
      }

      // 3. Guessed text match
      if (!isMatch && guessText) {
        const normGuess = normalizeString(guessText);
        const normTitle = normalizeString(secretTrack.title);
        const normArtist = normalizeString(secretTrack.artist);
        const canGuess = canonicalizeTitle(guessText);

        if (
          normGuess === normTitle ||
          normGuess === `${normTitle} ${normArtist}` ||
          normGuess === `${normArtist} ${normTitle}` ||
          (canGuess === secretCanonicalTitle &&
            normGuess.includes(secretCanonicalArtist)) ||
          (normGuess.includes(normTitle) &&
            (normGuess.includes(normArtist) || normTitle.length > 6))
        ) {
          isMatch = true;
        }
      }

      // 4. Franchise Match (50% Partial Credit for Anime & Soundtrack)
      const isAnimeOrSoundtrack =
        secretTrack.genre === "anime" ||
        secretTrack.genre === "soundtrack" ||
        (secretTrack.album && /soundtrack|theme|anime|ost/i.test(secretTrack.album));

      if (!isMatch && isAnimeOrSoundtrack) {
        const franchiseKeywords = extractFranchiseKeywords(secretTrack);

        if (franchiseKeywords.length > 0) {
          // Check if guessed database track shares the same franchise
          if (guessedDbTrack) {
            const guessedSearchStr = normalizeString(
              `${guessedDbTrack.album || ""} ${guessedDbTrack.title} ${guessedDbTrack.artist}`
            );
            if (franchiseKeywords.some((kw) => guessedSearchStr.includes(kw))) {
              isFranchiseMatch = true;
              isMatch = true;
            }
          }

          // Check if custom guess text contains the franchise keyword
          if (!isFranchiseMatch && guessText) {
            const normGuessText = normalizeString(guessText);
            if (
              franchiseKeywords.some(
                (kw) =>
                  normGuessText === kw ||
                  normGuessText.includes(kw) ||
                  (kw.includes(normGuessText) && normGuessText.length >= 4)
              )
            ) {
              isFranchiseMatch = true;
              isMatch = true;
            }
          }
        }
      }
    }

    const isGameOver = isMatch || isGiveUp || attemptsCount >= 5;
    const stageWon = isMatch ? Math.max(0, Math.min(4, currentStage)) : null;

    // Base point calculation
    const basePoints =
      isMatch && stageWon !== null ? STAGE_BASE_POINTS[stageWon] || 200 : 0;
    const rawPoints = Math.round(basePoints * tierMultiplier);

    // Percentage bonuses
    const noHintsBonusPercent = isMatch && noHintsMode ? 25 : 0;
    const proSpeedBonusPercent =
      isMatch && !isCasual && stageWon !== null && stageWon <= 2 ? 5 : 0;
    const totalBonusPercent = noHintsBonusPercent + proSpeedBonusPercent;

    const fullPoints = Math.round(rawPoints * (1 + totalBonusPercent / 100));

    // If franchise match, award 50% partial credit
    const pointsEarned = isMatch
      ? isFranchiseMatch
        ? Math.ceil(fullPoints * 0.5)
        : fullPoints
      : 0;

    const scoreBreakdown: ScoreBreakdown | undefined = isMatch
      ? {
          basePoints,
          tierMultiplier,
          noHintsBonusPercent,
          proSpeedBonusPercent,
          totalBonusPercent,
          isFranchiseMatch,
          finalPoints: pointsEarned,
        }
      : undefined;

    const revealTrack: TrackSummary | undefined = isGameOver
      ? {
          id: secretTrack.id,
          title: secretTrack.title,
          artist: secretTrack.artist,
          album: secretTrack.album,
          releaseYear: secretTrack.releaseYear,
          genre: secretTrack.genre,
          decade: secretTrack.decade,
          difficulty: secretTrack.difficulty as DifficultyTier,
          popularity: secretTrack.popularity,
          coverUrl: secretTrack.coverUrl,
          spotifyUrl: secretTrack.spotifyUrl,
          appleUrl: secretTrack.appleUrl,
        }
      : undefined;

    const challengeSeed = isGameOver ? encodeChallengeSeed(secretTrack.id) : undefined;

    // Progressive hints
    const nextStage = Math.min(4, currentStage + 1);
    const hints =
      !isGameOver && !noHintsMode
        ? {
            decade: nextStage >= 1 ? secretTrack.decade : undefined,
            releaseYear: nextStage >= 1 ? secretTrack.releaseYear : undefined,
            genre: nextStage >= 2 ? secretTrack.genre : undefined,
            artistMasked:
              nextStage >= 3 ? generateMaskedArtist(secretTrack.artist) : undefined,
          }
        : undefined;

    const response: GuessResultResponse = {
      isCorrect: isMatch,
      isGameOver,
      stageWon,
      pointsEarned,
      attemptsUsed: attemptsCount,
      revealTrack,
      challengeSeed,
      hints,
      scoreBreakdown,
      isFranchiseMatch,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Guess verification error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
