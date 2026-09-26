import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./usability.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://silo-the-last-city.vercel.app"),
  title: {
    default: "SILO — The Last City",
    template: "%s · SILO — The Last City",
  },
  description:
    "An interactive 3D archive of Silo 18 and a Season 3 atlas of all 50 silos, their control systems, floor maps and fan reconstructions.",
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
    description: "Explore a sourced 3D cutaway of Silo 18 and a Season 3 atlas of all 50 silos, their control systems and competing fan maps.",
  },
  twitter: {
    card: "summary",
    title: "SILO — The Last City",
    description: "A 3D structural archive of Silo 18 and the complete fifty-silo network revealed in Season 3.",
  },
  robots: { index: true, follow: true },
  other: {
    "codex-preview": "development",
    "archive-coverage": "Silo series through Season 3 Episode 10; reviewed 2026-09-12",
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
