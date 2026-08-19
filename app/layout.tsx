import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SILO — The Last City",
  description:
    "An interactive 3D archive of Silo 18: the cafeteria sensor gallery, one-way cleaning airlock, 144 levels, digger cavern, Algorithm tunnel, mines and inter-silo network.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
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
