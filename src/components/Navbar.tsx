"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Music2,
  Flame,
  BarChart2,
  Disc3,
  Calendar,
  Sparkles,
  Zap,
  Headphones,
  Settings,
} from "lucide-react";
import { getLocalStats, getStoredCasualMode, setStoredCasualMode } from "@/lib/stats";
import { StatsModal } from "./StatsModal";
import { SettingsDialog } from "./SettingsDialog";

export function Navbar() {
  const pathname = usePathname();
  const [streak, setStreak] = useState(0);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCasual, setIsCasual] = useState(false);

  useEffect(() => {
    const stats = getLocalStats();
    setStreak(stats.currentStreak);
    setIsCasual(getStoredCasualMode());

    const interval = setInterval(() => {
      const s = getLocalStats();
      setStreak(s.currentStreak);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const toggleCasual = () => {
    const next = !isCasual;
    setIsCasual(next);
    setStoredCasualMode(next);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  const navLinks = [
    { href: "/play", label: "Endless Play", icon: Disc3 },
    { href: "/daily", label: "Daily Hub", icon: Calendar },
    { href: "/playlists", label: "Playlists", icon: Sparkles },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border/80 bg-background/90 backdrop-blur-md">
        {/* Full-screen width with symmetrical 3-column grid layout */}
        <div className="w-full px-4 sm:px-6 lg:px-8 grid grid-cols-[1fr_auto_1fr] items-center h-16">
          {/* Left section: Logo anchored far left */}
          <div className="flex items-center gap-3 justify-start">
            <Link
              href="/"
              title="Go to Home"
              className="group flex items-center gap-2.5 transition-transform active:scale-95"
            >
              <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20 transition-shadow group-hover:shadow-primary/40">
                <Music2 className="size-5 text-primary-foreground transition-transform group-hover:rotate-12" />
              </div>
              <div className="flex flex-col">
                <span className="font-sans text-lg font-black tracking-tight text-foreground">
                  guessable<span className="text-primary font-mono text-sm ml-0.5">.plus</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground -mt-1 hidden sm:block">
                  Unlimited Music
                </span>
              </div>
            </Link>
          </div>

          {/* Center section: Navigation pills centered */}
          <div className="flex items-center gap-1.5 justify-center">
            <nav className="hidden md:flex items-center gap-1.5 bg-surface/70 p-1 rounded-2xl border border-border/60 backdrop-blur-sm shadow-inner">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isActive
                        ? "bg-card text-primary border border-border/80 shadow-sm"
                        : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                    }`}
                  >
                    <Icon className={`size-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right section: Mode switch, Stats, Settings anchored far right */}
          <div className="flex items-center gap-2 sm:gap-3 justify-end">
            {/* Streak Badge */}
            {streak > 0 && (
              <div
                title="Current Career Streak"
                className="flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-400 shadow-sm"
              >
                <Flame className="size-3.5 fill-amber-400 animate-pulse" />
                <span>{streak}</span>
              </div>
            )}

            {/* Mode Selector Pill */}
            <button
              onClick={toggleCasual}
              title={
                isCasual
                  ? "Casual Mode: Starts with 1.0s clip (1s → 2.5s → 5s → 10s → 15s). Click for Pro 0.1s."
                  : "Pro Mode: Starts with 0.1s clip (0.1s → 0.5s → 2s → 8s → 15s). Click for Casual 1.0s."
              }
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black border transition-all active:scale-95 shadow-sm ${
                isCasual
                  ? "bg-cyan-500/15 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500/25"
                  : "bg-emerald-500/15 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/25"
              }`}
            >
              {isCasual ? (
                <>
                  <Headphones className="size-3.5" />
                  <span className="hidden xs:inline">1.0s Casual</span>
                  <span className="xs:hidden">1.0s</span>
                </>
              ) : (
                <>
                  <Zap className="size-3.5" />
                  <span className="hidden xs:inline">0.1s Pro</span>
                  <span className="xs:hidden">0.1s</span>
                </>
              )}
            </button>

            {/* Stats Trigger */}
            <button
              onClick={() => setIsStatsOpen(true)}
              aria-label="View Career Statistics"
              className="grid size-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-sm"
            >
              <BarChart2 className="size-4" />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              aria-label="Open Settings"
              className="grid size-9 place-items-center rounded-xl border border-border bg-surface text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-sm"
            >
              <Settings className="size-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden items-center justify-around border-t border-border/60 bg-surface/50 px-2 py-1.5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-[11px] font-bold transition-colors ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Modals */}
      <StatsModal isOpen={isStatsOpen} onClose={() => setIsStatsOpen(false)} />
      <SettingsDialog isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
