"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Flame, Trophy } from "lucide-react";
import { DailyTierCard } from "@/components/DailyTierCard";
import { DifficultyTier } from "@/lib/types";
import { getDailyHistory, DailySolveRecord } from "@/lib/stats";

const TIERS: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];

export default function DailyHubPage() {
  const [timeUntilReset, setTimeUntilReset] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [history, setHistory] = useState<Record<string, DailySolveRecord>>({});

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const today = now.toISOString().split("T")[0];
      setDateStr(today);

      // Next midnight UTC
      const nextReset = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0));
      const diffMs = nextReset.getTime() - now.getTime();

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setTimeUntilReset(
        `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      );
    };

    updateCountdown();
    setHistory(getDailyHistory());

    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const solvedTodayCount = TIERS.filter((tier) => history[`${dateStr}_${tier}`]?.isWin).length;

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:py-12">
      {/* Daily Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <Calendar className="size-4" />
            <span>Daily Challenge</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Today&#39;s Puzzles
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {solvedTodayCount} of 5 tiers solved today · Midnight UTC reset
          </p>
        </div>

        {/* UTC Countdown Timer */}
        <div className="flex items-center gap-2 rounded-2xl bg-surface border border-border px-4 py-2.5 shadow-sm">
          <Clock className="size-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-muted-foreground">
              Next Puzzles in
            </span>
            <span className="font-mono text-sm font-black text-foreground">
              {timeUntilReset || "00:00:00"}
            </span>
          </div>
        </div>
      </div>

      {/* 5 Daily Difficulty Cards */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {TIERS.map((tier) => {
          const record = history[`${dateStr}_${tier}`];
          return (
            <DailyTierCard
              key={tier}
              tier={tier}
              dateStr={dateStr}
              solveRecord={record}
            />
          );
        })}
      </div>
    </div>
  );
}
