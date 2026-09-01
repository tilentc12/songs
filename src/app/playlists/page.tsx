import { Sparkles } from "lucide-react";
import { PlaylistCard } from "@/components/PlaylistCard";
import { PLAYLISTS } from "@/lib/constants";

export default function PlaylistsHubPage() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col gap-2 pb-6 border-b border-border/80">
        <div className="flex items-center gap-2 text-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="size-4" />
          <span>Themed Music Packs</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          Curated Playlists
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a decade, genre, or anime pack and test your musical instincts with unlimited replayability.
        </p>
      </div>

      {/* Symmetrical 3x3 Grid of 9 Playlists */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {PLAYLISTS.map((playlist) => (
          <PlaylistCard key={playlist.slug} playlist={playlist} />
        ))}
      </div>
    </div>
  );
}
