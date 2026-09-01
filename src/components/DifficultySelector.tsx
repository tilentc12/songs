"use client";

import { DifficultyTier, TIER_CONFIG } from "@/lib/types";

interface DifficultySelectorProps {
  selected: DifficultyTier;
  onChange: (tier: DifficultyTier) => void;
  disabled?: boolean;
}

const TIERS: DifficultyTier[] = ["easy", "medium", "hard", "expert", "impossible"];

export function DifficultySelector({
  selected,
  onChange,
  disabled = false,
}: DifficultySelectorProps) {
  return (
    <nav
      aria-label="Difficulty tiers"
      className="flex w-full items-center gap-1.5 rounded-2xl bg-surface/80 p-1 border border-border/80"
    >
      {TIERS.map((tier) => {
        const config = TIER_CONFIG[tier];
        const isSelected = selected === tier;

        return (
          <button
            key={tier}
            type="button"
            disabled={disabled}
            onClick={() => onChange(tier)}
            style={{
              borderColor: isSelected ? config.color : "transparent",
              backgroundColor: isSelected ? `${config.color}18` : "transparent",
              color: isSelected ? config.color : undefined,
            }}
            className={`group relative flex min-h-10 min-w-0 flex-1 flex-col items-center justify-center rounded-xl px-1.5 py-1 text-center transition-all ${
              isSelected
                ? "font-black border shadow-sm scale-[1.02]"
                : "text-muted-foreground hover:bg-card hover:text-foreground font-semibold"
            } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
          >
            <span className="text-[11px] sm:text-xs tracking-tight truncate">
              {config.label}
            </span>
            <span
              className={`text-[9px] font-mono transition-opacity ${
                isSelected ? "opacity-90 font-bold" : "opacity-40 group-hover:opacity-75"
              }`}
            >
              {config.multiplier}x
            </span>
          </button>
        );
      })}
    </nav>
  );
}
