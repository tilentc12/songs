import Link from "next/link";
import { Music2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/60 py-6 text-center text-xs text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col sm:flex-row items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-lg bg-primary/20 text-primary">
            <Music2 className="size-3.5" />
          </div>
          <span className="font-sans font-bold text-foreground">
            guessable<span className="text-primary font-mono">.plus</span>
          </span>
          <span className="text-muted-foreground/60">— Unlimited Music Guessing</span>
        </div>

        <div className="flex items-center gap-4 text-xs font-medium">
          <Link href="/play" className="hover:text-foreground transition-colors">
            Endless Play
          </Link>
          <Link href="/daily" className="hover:text-foreground transition-colors">
            Daily Puzzles
          </Link>
          <Link href="/playlists" className="hover:text-foreground transition-colors">
            Playlists
          </Link>
          <Link href="/stats" className="hover:text-foreground transition-colors">
            Career Records
          </Link>
        </div>

        <div className="text-[11px] text-muted-foreground/60">
          Audio previews provided via Deezer & Apple Music API.
        </div>
      </div>
    </footer>
  );
}
