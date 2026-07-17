import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";

/**
 * §9.2 two-family system + mono: Space Grotesk (display/headline
 * geometry), Inter (legible UI body), JetBrains Mono (every stat,
 * timestamp, confidence %, ticker value). Variable names here are
 * referenced by app/globals.css's @theme block — keep them in sync.
 */
export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const fontVariables = `${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`;
