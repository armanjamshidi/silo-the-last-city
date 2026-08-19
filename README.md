<div align="center">
  <a href="https://silo-the-last-city.vercel.app/">
    <img src="public/favicon.svg" width="92" height="92" alt="Silo 18 archive mark" />
  </a>

  <h1>SILO — The Last City</h1>

  <p><strong>An interactive 3D structural archive of Silo 18.</strong></p>
  <p>Descend through 144 levels, enter purpose-built room cutaways, trace the systems beneath Mechanical, and compare what is shown on screen with book canon and spatial reconstruction.</p>

  <p>
    <a href="https://silo-the-last-city.vercel.app/"><img alt="Open live archive" src="https://img.shields.io/badge/OPEN_LIVE_ARCHIVE-VERCEL-C9A66B?style=for-the-badge&labelColor=11120F" /></a>
    <a href="https://github.com/armanjamshidi/silo-the-last-city/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/armanjamshidi/silo-the-last-city?style=for-the-badge&color=C9A66B&labelColor=11120F" /></a>
  </p>

  <p>
    <img alt="Next.js 16" src="https://img.shields.io/badge/Next.js-16-11120F?logo=nextdotjs&logoColor=white" />
    <img alt="React 19" src="https://img.shields.io/badge/React-19-11120F?logo=react&logoColor=61DAFB" />
    <img alt="Three.js" src="https://img.shields.io/badge/Three.js-WebGL-11120F?logo=threedotjs&logoColor=white" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5.9-11120F?logo=typescript&logoColor=3178C6" />
    <img alt="Spoilers" src="https://img.shields.io/badge/SPOILERS-SERIES_%26_BOOKS-9B4938" />
  </p>
</div>

> [!WARNING]
> This archive contains major spoilers for the **Silo** television series and Hugh Howey's books.

## Why this exists

Silo 18 is usually experienced one stairwell, room, or secret at a time. This project brings those fragments together as an explorable architectural hypothesis: part 3D cutaway, part evidence ledger, and part lore map.

It does **not** present fan-made geometry as official fact. Every space is labeled as **Series**, **Book Canon**, or **Reconstruction**, and uncertain level numbers remain explicitly undisclosed.

<div align="center">
  <h3>→ <a href="https://silo-the-last-city.vercel.app/">Enter Silo 18</a> ←</h3>
  <sub>Drag to orbit · Scroll to zoom · Open any section for a dedicated 3D diorama</sub>
</div>

## Highlights

- **Full-silo cutaway** — explore the complete 144-level structure and the controlled void below it.
- **Purpose-built 3D sections** — each major district opens into its own modeled room study instead of reusing a generic scene.
- **Up Top reconstructed in detail** — the Cafeteria & Sensor Gallery, one-way Cleaning Facility, and Civic offices are separate spaces.
- **Deep infrastructure** — descend through Mechanical, the Digger cavern, George Wilkins' camp, the flooded Gap, pumps, mines, and the Algorithm access tunnel.
- **Distinct hidden systems** — the I.T. external power feeder and Judicial Safeguard delivery line are shown as separate routes.
- **Operation Fifty view** — inspect the 51-silo field and compare Silo 18, Silo 17, Silo 1, and Seed-related book continuity.
- **Evidence-aware lore** — every facility and route carries an `ON SCREEN`, `BOOK CANON`, or `INFERRED` tag.
- **Resilient rendering** — a detailed CSS cutaway remains usable inside WebGL-restricted browsers and embedded previews.
- **Dark and light themes** — the interface remembers the viewer's preference locally.
- **Responsive controls** — desktop and compact layouts retain the archive, scene controls, and evidence panel.

## Explore the archive

| Layer | Included spaces |
| --- | --- |
| **Up Top** | Cleaning Facility, suit-prep route, fire purge, outer hatch, exterior sensor, Cafeteria & Sensor Gallery, Sheriff and civic offices |
| **Authority & systems** | Judicial, Safeguard delivery line, I.T. operations, server aisles, independent power feeder, Vault, Legacy, Algorithm chamber |
| **Daily life** | Medical & Nursery, residential Mids, Farms, Supply workshops and storage |
| **Down Deep** | Mechanical, generator hall, control deck, workshops and pump infrastructure |
| **Below Level 144** | Digger cavern, George's camp, flooded Gap, Algorithm access tunnel and reconstructed mine routes |
| **Beyond Silo 18** | 51-silo field, Silo 17, Silo 1, utility routes and book-canon Seed alignment |

### The evidence model

| Label | Meaning |
| --- | --- |
| `SERIES` / `ON SCREEN` | Directly established by the television series |
| `BOOKS` / `BOOK CANON` | Drawn from Hugh Howey's book continuity, which may differ from the adaptation |
| `RECONSTRUCTION` / `INFERRED` | A spatial interpretation used only where no complete official plan is available |

This distinction is central to the project: the archive should make the world easier to understand without turning speculation into canon.

## Controls

| Action | Control |
| --- | --- |
| Orbit the model | Drag / swipe |
| Zoom | Mouse wheel / trackpad |
| Open a room | Select a zone, then choose **Open 3D Section** |
| Return to the structure | Choose **Full Silo** or **Overview** |
| Inspect utilities | Switch to **Systems** |
| Emphasize inhabited areas | Switch to **Life** |
| Pause motion | Use the play/pause control |
| Change appearance | Use the sun/moon theme toggle |

## Getting started

### Requirements

- Node.js **22.13.0 or newer**
- npm

### Local development

```bash
git clone https://github.com/armanjamshidi/silo-the-last-city.git
cd silo-the-last-city
npm ci
npm run dev:vercel
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

```bash
npm run lint
npm test
npm run build:vercel
```

The default `npm run build` also produces and validates the Cloudflare/Vinext artifact used by the connected Sites deployment.

## Tech stack

- **Next.js 16** and **React 19** for the application shell
- **TypeScript** for the scene and archive model
- **Three.js** for the interactive cutaway and room dioramas
- **Lucide** for interface iconography
- **CSS** for the responsive archive UI, themes, and no-WebGL fallback
- **Vercel** and **Cloudflare/Vinext** compatible production targets

## Project structure

```text
app/
├── SiloExperience.tsx   # Archive data, interaction state and Three.js scenes
├── globals.css          # Interface, themes and CSS fallback cutaways
├── layout.tsx           # Metadata and document shell
└── page.tsx             # Main route

public/
└── favicon.svg          # Silo 18 archive mark

scripts/                 # Verified build and artifact checks
tests/                   # Rendered-output smoke tests
```

## Deploy

The repository is ready for a native Next.js deployment on Vercel:

1. Import the repository into Vercel.
2. Keep the detected framework as **Next.js**.
3. Deploy—`vercel.json` already selects the correct build path.

Every push to `main` updates the public archive at [silo-the-last-city.vercel.app](https://silo-the-last-city.vercel.app/).

## Roadmap

- [ ] More screen-accurate props and room dressing for every department
- [ ] Guided routes for important character journeys
- [ ] Optional Persian interface localization
- [ ] More accessible keyboard navigation and reduced-motion controls
- [ ] Shareable deep links for individual sections
- [ ] Performance-focused loading for the Three.js scene bundle

## Contributing

Corrections, scene improvements, accessibility fixes, and carefully sourced lore notes are welcome.

1. Fork the repository.
2. Create a focused branch.
3. Keep confirmed material and reconstruction clearly separated.
4. Run the quality checks.
5. Open a pull request explaining what changed and which source supports it.

If you are proposing a canon correction, please include the episode, chapter, interview, or production reference that supports it.

<details dir="rtl">
  <summary><strong>معرفی کوتاه فارسی</strong></summary>
  <br />
  این پروژه یک آرشیو تعاملی و سه‌بعدی از سیلوی ۱۸ است. می‌توانید ساختار ۱۴۴ طبقه، کافه‌تریا، مسیر Cleaning، بخش IT و Vault، مکانیکال، حفار، شکاف زیر سیلو، معادن و ارتباط مفهومی سیلوها را بررسی کنید. اطلاعات تأییدشدهٔ سریال، روایت کتاب‌ها و بخش‌های بازسازی‌شده با برچسب‌های جدا نمایش داده می‌شوند تا حدس‌ها به‌جای واقعیت قطعی ارائه نشوند.
</details>

## Disclaimer

This is an unofficial, non-commercial fan visualization created for educational and exploratory purposes. It is not affiliated with or endorsed by Apple, Apple TV+, AMC Studios, Graham Yost, or Hugh Howey. **Silo** and related names, characters, and story elements belong to their respective rights holders.

---

<div align="center">
  <strong>If this archive gives you a new way to see Silo 18, consider starring the repository.</strong>
  <br /><br />
  <a href="https://github.com/armanjamshidi/silo-the-last-city">⭐ Star the project</a>
  &nbsp;·&nbsp;
  <a href="https://silo-the-last-city.vercel.app/">Explore the live archive</a>
</div>
