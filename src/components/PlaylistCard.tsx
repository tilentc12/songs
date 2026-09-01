import Link from "next/link";
import { ArrowRight, Sparkles, Disc } from "lucide-react";
import { PlaylistInfo } from "@/lib/types";

interface PlaylistCardProps {
  playlist: PlaylistInfo;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <Link
      href={`/playlists/${playlist.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-2xl hover:scale-[1.02]"
    >
      {/* Background Gradient Tint */}
      <div
        className={`absolute -right-10 -top-10 size-36 rounded-full blur-3xl opacity-20 transition-opacity group-hover:opacity-40 bg-gradient-to-br ${playlist.gradient}`}
      />

      <div className="relative z-10">
        <div className="flex size-12 items-center justify-center rounded-2xl bg-surface border border-border shadow-sm text-2xl">
          {playlist.icon}
        </div>

        <h3 className="mt-4 text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
          {playlist.title}
        </h3>

        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
          {playlist.description}
        </p>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-border/40 pt-3">
        <span className="text-[11px] font-mono font-bold text-muted-foreground uppercase">
          Unlimited Play
        </span>

        <span className="flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
          <span>Start Pack</span>
          <ArrowRight className="size-3.5" />
        </span>
      </div>
    </Link>
  );
}
