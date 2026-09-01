import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Guessable+ | Unlimited Music Guessing Game",
  description:
    "Name the song from a tenth of a second. Play unlimited rounds, daily challenges, and themed playlists.",
  openGraph: {
    title: "Guessable+ | Unlimited Music Guessing Game",
    description: "Name the song from a tenth of a second with zero daily limits.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} flex min-h-screen flex-col bg-background antialiased selection:bg-primary selection:text-black`}>
        <Navbar />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
