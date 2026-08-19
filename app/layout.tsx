import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://silo-the-last-city.vercel.app"),
  title: {
    default: "SILO — The Last City",
    template: "%s · SILO — The Last City",
  },
  description:
    "An interactive 3D archive of Silo 18: the cafeteria sensor gallery, one-way cleaning airlock, 144 levels, digger cavern, Algorithm tunnel, mines and inter-silo network.",
  applicationName: "SILO — The Last City",
  authors: [{ name: "Arman Jamshidi" }],
  creator: "Arman Jamshidi",
  keywords: ["Silo", "Silo 18", "Apple TV+", "Three.js", "3D cutaway", "Wool", "Hugh Howey", "interactive archive"],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "SILO — The Last City",
    title: "SILO — The Last City",
    description: "Explore a sourced, interactive 3D cutaway of Silo 18—from the surface sensor to the buried Algorithm door.",
  },
  twitter: {
    card: "summary",
    title: "SILO — The Last City",
    description: "An interactive 3D structural archive of Silo 18.",
  },
  robots: { index: true, follow: true },
  other: {
    "codex-preview": "development",
    "archive-coverage": "Silo series through Season 3 Episode 7; reviewed 2026-08-20",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark light",
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#080906" },
    { media: "(prefers-color-scheme: light)", color: "#e9e3d8" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
