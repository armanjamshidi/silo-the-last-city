# SILO — The Last City

An interactive 3D structural archive of Silo 18, inspired by the Apple TV+
series and Hugh Howey's books. Explore all 144 levels, the digger cavern,
flooded gap, mines, Safeguard tunnel, and a conceptual map of Operation Fifty.

## Highlights

- Interactive Three.js cutaway with orbit, zoom, cutaway and layer controls
- Separate 3D section studies for civic, medical, farming, mechanical, mining,
  tunnel and sub-foundation spaces
- Extended structure below Level 144: the digger, George Wilkins' camp, water,
  pumps and the circular Safeguard door
- A 51-silo network study highlighting Silos 1, 17 and 18 plus the Seed route
- Evidence labels that distinguish `SERIES`, `BOOKS` and `RECONSTRUCTION`
- A resilient CSS fallback for browsers or embedded previews without WebGL

## Run locally

Node.js 22.13 or newer is recommended.

```bash
npm install
npm run dev:vercel
```

Open `http://localhost:3000`.

## Production build

```bash
npm run build:vercel
npm run start:vercel
```

## Deploy to Vercel

Import this repository in Vercel. The included `vercel.json` selects the native
Next.js build, so no additional project configuration is required.

## Stack

Next.js 16 · React 19 · TypeScript · Three.js · Tailwind CSS · Lucide

## Canon note

This is an unofficial visualization. Where the series or books do not publish
exact dimensions or locations, the interface marks the result as a
reconstruction rather than presenting it as confirmed canon.
