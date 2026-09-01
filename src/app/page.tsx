import Link from "next/link";
import {
  Play,
  Calendar,
  Zap,
  ArrowRight,
  Disc3,
  Layers,
  Music,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-20">
      {/* Subtle Ambient Radial Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-hidden"
      >
        <div className="h-[420px] w-[640px] rounded-full bg-gradient-to-tr from-emerald-500/10 via-teal-500/5 to-cyan-500/10 blur-[120px]" />
      </div>

      {/* Hero Header */}
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        {/* Minimalist Live Stats / Status Pill */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/80 bg-surface/80 px-3.5 py-1 text-xs font-semibold text-muted-foreground backdrop-blur-md shadow-sm">
          <span className="flex size-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-foreground font-medium">1,600+ Songs</span>
          <span className="text-border">•</span>
          <span>5 Difficulty Tiers</span>
          <span className="text-border">•</span>
          <span>Zero Limits</span>
        </div>

        {/* Crisp High-End Typography */}
        <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-foreground leading-[1.05]">
          GUESS THE SONG{" "}
          <span className="block mt-1 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            IN 0.1 SECONDS.
          </span>
        </h1>

        <p className="mt-5 max-w-lg text-sm sm:text-base text-muted-foreground font-medium leading-relaxed">
          Ultra-short audio snippets. Test your musical instincts across endless tracks, daily puzzles, and curated decade packs.
        </p>

        {/* Primary Instant Action Button */}
        <div className="mt-8 flex w-full max-w-sm flex-col items-center justify-center sm:flex-row gap-3">
          <Link
            href="/play"
            className="group flex h-13 w-full items-center justify-center gap-2.5 rounded-2xl bg-primary px-8 text-base font-black text-black shadow-lg shadow-primary/20 transition-all duration-200 hover:bg-primary-hover hover:scale-[1.02] active:scale-95"
          >
            <Play className="size-4 fill-black" />
            <span>Play Unlimited</span>
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* 3 Instant 1-Click Game Mode Cards */}
      <div className="mt-14 sm:mt-18 grid w-full max-w-4xl grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Mode 1: Play Unlimited */}
        <Link
          href="/play"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-emerald-500/50 hover:bg-card hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Zap className="size-5" />
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                Endless
              </span>
            </div>
            <h2 className="font-sans text-lg font-black text-foreground group-hover:text-emerald-400 transition-colors">
              Play Unlimited
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Continuous song guessing with streak multipliers and difficulty tiers. No cooldowns or daily limits.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
            <span>Start Endless Run</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Mode 2: Daily Challenges */}
        <Link
          href="/daily"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-cyan-500/50 hover:bg-card hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Calendar className="size-5" />
              </div>
              <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[11px] font-bold text-cyan-400">
                5 Tiers
              </span>
            </div>
            <h2 className="font-sans text-lg font-black text-foreground group-hover:text-cyan-400 transition-colors">
              Daily Challenges
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              Curated daily puzzles from Easy to Impossible. Refreshes every midnight UTC.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
            <span>Today&#39;s Puzzles</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>

        {/* Mode 3: Playlists */}
        <Link
          href="/playlists"
          className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border/80 bg-card/60 p-6 backdrop-blur-sm transition-all duration-300 hover:border-purple-500/50 hover:bg-card hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-0.5"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Disc3 className="size-5" />
              </div>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-400">
                9 Packs
              </span>
            </div>
            <h2 className="font-sans text-lg font-black text-foreground group-hover:text-purple-400 transition-colors">
              Curated Playlists
            </h2>
            <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
              80s, 90s, 2000s, 2010s, 2020s, Rock, Hip-Hop, Soundtracks, and Anime packs.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-purple-400">
            <span>Browse Packs</span>
            <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
          </div>
        </Link>
      </div>

      {/* Ultra-Minimal Footer Metrics */}
      <div className="mt-12 sm:mt-16 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground/80 font-medium">
        <div className="flex items-center gap-1.5">
          <Music className="size-3.5 text-primary" />
          <span>1,600+ Verified Audio Tracks</span>
        </div>
        <span className="hidden sm:inline text-border">•</span>
        <div className="flex items-center gap-1.5">
          <Zap className="size-3.5 text-amber-400" />
          <span>0.1s Snippet Mode</span>
        </div>
        <span className="hidden sm:inline text-border">•</span>
        <div className="flex items-center gap-1.5">
          <Layers className="size-3.5 text-cyan-400" />
          <span>5 Difficulty Tiers</span>
        </div>
      </div>
    </div>
  );
}
