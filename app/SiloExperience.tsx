"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  Aperture,
  ArrowLeft,
  BookOpen,
  Box,
  ChevronRight,
  CircleHelp,
  Database,
  DoorOpen,
  Drill,
  Eye,
  EyeOff,
  Gauge,
  Layers3,
  Map as MapIcon,
  Moon,
  Network,
  Pause,
  Pickaxe,
  Play,
  RotateCcw,
  Route,
  ShieldAlert,
  Sun,
  Waves,
  Wind,
  X,
  ZoomIn,
} from "lucide-react";
import * as THREE from "three";

type DetailTag = "ON SCREEN" | "BOOK CANON" | "INFERRED";

type Facility = {
  name: string;
  note: string;
  tag: DetailTag;
};

type Telemetry = {
  label: string;
  value: string;
};

type Zone = {
  id: string;
  name: string;
  kicker: string;
  levels: string;
  level: number;
  code: string;
  group: "internal" | "below" | "network";
  canon: "SERIES" | "BOOKS" | "RECONSTRUCTION";
  scene: "civic" | "judicial" | "it" | "medical" | "residential" | "farm" | "industrial" | "mechanical" | "digger" | "gap" | "tunnel" | "mine" | "network";
  color: string;
  description: string;
  details: Facility[];
  people: string[];
  telemetry: [Telemetry, Telemetry, Telemetry];
  era: string;
  evidence: string;
  status: string;
};

const ZONES: Zone[] = [
  {
    id: "up-top",
    name: "UP TOP",
    kicker: "Civic core",
    levels: "Levels 1—22",
    level: 7,
    code: "L-007",
    group: "internal",
    canon: "SERIES",
    scene: "civic",
    color: "#d7b26d",
    description:
      "The visible seat of Silo 18: cafeteria, sensor wall, sheriff, mayor and the rooms where the Pact becomes daily life.",
    details: [
      { name: "Cafeteria & sensor wall", note: "Circular exterior display, communal tables and the cleaning gallery.", tag: "ON SCREEN" },
      { name: "Sheriff station", note: "Badge desk, clerical bay, interview room and holding cells.", tag: "ON SCREEN" },
      { name: "Cleaning airlock", note: "Suit prep, inner seal, incinerator and the outer hatch.", tag: "ON SCREEN" },
      { name: "Mayor / deputy offices", note: "The civic chain of command clustered near the upper landings.", tag: "INFERRED" },
      { name: "Upper stair checkpoint", note: "A controlled landing able to channel crowds and raiders.", tag: "INFERRED" },
    ],
    people: ["Holston Becker", "Allison Becker", "Mayor Jahns", "Sam Marnes", "Juliette Nichols"],
    telemetry: [{ label: "SENSOR", value: "EXTERNAL" }, { label: "AIRLOCK", value: "ARMED" }, { label: "ACCESS", value: "CIVIC" }],
    era: "SEASONS 1—2",
    evidence: "The series repeatedly places civic authority, the cafeteria and cleaning infrastructure Up Top; the exact 1—22 band is a reconstruction.",
    status: "MONITORED",
  },
  {
    id: "judicial",
    name: "JUDICIAL",
    kicker: "Authority district",
    levels: "Levels 14—16",
    level: 15,
    code: "L-015",
    group: "internal",
    canon: "SERIES",
    scene: "judicial",
    color: "#b98a58",
    description:
      "Courtrooms and enforcement offices conceal a second purpose: the externally supplied Safeguard delivery line passes through Judicial, physically separate from the buried Algorithm door.",
    details: [
      { name: "Judge Meadows' chamber", note: "Private office, hearing table and sealed personal archive.", tag: "ON SCREEN" },
      { name: "Sims operations office", note: "Judicial command point for investigations and enforcement.", tag: "ON SCREEN" },
      { name: "Raider ready room", note: "Protective equipment, weapons control and rapid stair access.", tag: "ON SCREEN" },
      { name: "Interview & holding", note: "Controlled rooms for suspects before formal disposition.", tag: "INFERRED" },
      { name: "Records / evidence hall", note: "Case files and relic seizures behind restricted counters.", tag: "INFERRED" },
      { name: "Safeguard delivery line", note: "The lethal external line identified on the recovered drive enters through Judicial.", tag: "ON SCREEN" },
      { name: "Concealed service wall", note: "Juliette's group traces the line behind the Judicial fabric and plans a controlled breach.", tag: "ON SCREEN" },
      { name: "Isolation / capping point", note: "A proposed intervention point; striking the line itself could release the agent locally.", tag: "ON SCREEN" },
    ],
    people: ["Mary Meadows", "Robert Sims", "Amundsen", "Paul Billings"],
    telemetry: [{ label: "SAFEGUARD", value: "DELIVERY" }, { label: "LINE", value: "EXTERNAL" }, { label: "ACCESS", value: "SEALED" }],
    era: "SEASONS 1—3",
    evidence: "Season 3 identifies the external line entering Judicial as the likely Safeguard delivery path. The exact room and dispersal branches remain a reconstruction.",
    status: "RESTRICTED",
  },
  {
    id: "it",
    name: "I.T.",
    kicker: "Systems control",
    levels: "Level 18",
    level: 18,
    code: "L-018",
    group: "internal",
    canon: "SERIES",
    scene: "it",
    color: "#82b8bc",
    description:
      "A hardened technical enclave: public workstations at the threshold, dense server aisles behind them, an isolated power bus and the circular Vault containing the Legacy and Algorithm room.",
    details: [
      { name: "I.T. operations floor", note: "Public-facing terminals, repair desks and the controlled approach to the rear.", tag: "ON SCREEN" },
      { name: "Server aisles", note: "Tall rack banks carry silo data, displays, cameras and internal systems.", tag: "ON SCREEN" },
      { name: "Independent power bus", note: "I.T. stays illuminated when Mechanical cuts general power.", tag: "ON SCREEN" },
      { name: "External Silo 1 feeder", note: "A separate line on the recovered schematic supplies I.T. from Silo 1's generators.", tag: "ON SCREEN" },
      { name: "Secure bridge / checkpoint", note: "A narrow defensible approach; its broken Silo 17 counterpart is shown in Season 2.", tag: "ON SCREEN" },
      { name: "The Vault", note: "Circular sealed threshold opened by the illuminated Silo 18 key and code.", tag: "ON SCREEN" },
      { name: "Algorithm chamber", note: "A sparse Y-plan room aimed at one screen, flanked by stepped server and power banks.", tag: "ON SCREEN" },
      { name: "The Legacy", note: "Pre-silo knowledge, models, books, relics, food stores and shadow quarters.", tag: "ON SCREEN" },
    ],
    people: ["Bernard Holland", "Lukas Kyle", "Mary Meadows", "Solo / Jimmy"],
    telemetry: [{ label: "POWER", value: "SILO 1 FEED" }, { label: "ARCHIVE", value: "LEGACY" }, { label: "ACCESS", value: "18-KEY" }],
    era: "SEASONS 2—3 / PRIORITY",
    evidence: "The Vault, Legacy and Algorithm room are shown in Season 2. Season 3 distinguishes I.T.'s external Silo 1 power feeder from the Safeguard line entering Judicial.",
    status: "CLASSIFIED",
  },
  {
    id: "medical",
    name: "MEDICAL & NURSERY",
    kicker: "Population control",
    levels: "Upper Mids / exact level sealed",
    level: 38,
    code: "M-038",
    group: "internal",
    canon: "RECONSTRUCTION",
    scene: "medical",
    color: "#a5aaa0",
    description:
      "Clinics, fertility rooms and the nursery sit inside the administrative health system where every birth is authorized and recorded.",
    details: [
      { name: "Dr. Nichols' clinic", note: "Examination beds, imaging and day-to-day treatment rooms.", tag: "ON SCREEN" },
      { name: "Surgical theatre", note: "Central operating table, overhead lamps and instrument prep.", tag: "ON SCREEN" },
      { name: "Nursery", note: "Bassinet line, observation glazing and controlled family access.", tag: "ON SCREEN" },
      { name: "Fertility procedure room", note: "The hidden population-control intervention behind approved removals.", tag: "ON SCREEN" },
      { name: "Birth lottery records", note: "Authorized pregnancies and family histories kept under seal.", tag: "ON SCREEN" },
      { name: "Pharmacy & cold store", note: "Finite medicines and sterile supplies under counted access.", tag: "INFERRED" },
    ],
    people: ["Dr. Pete Nichols", "Hanna Nichols", "Allison Becker", "Gloria Hildebrandt"],
    telemetry: [{ label: "CLINIC", value: "STERILE" }, { label: "BIRTHS", value: "CONTROLLED" }, { label: "ACCESS", value: "MEDICAL" }],
    era: "SEASONS 1—2",
    evidence: "The rooms and their institutional role are series canon. Their single combined location is a spatial reconstruction because the show withholds a complete level register.",
    status: "CONTROLLED",
  },
  {
    id: "mids",
    name: "THE MIDS",
    kicker: "Population belt",
    levels: "Approx. Levels 47—69",
    level: 56,
    code: "L-056",
    group: "internal",
    canon: "RECONSTRUCTION",
    scene: "residential",
    color: "#c9a778",
    description:
      "Dense residential neighborhoods, clinics, schools and markets form the social hinge between power above and labor below.",
    details: [
      { name: "Residential rings", note: "Compact apartments opening onto shared landings and stair views.", tag: "ON SCREEN" },
      { name: "Market arcade", note: "Food counters, tailors, repair stalls and ration exchange.", tag: "INFERRED" },
      { name: "Schools", note: "Classrooms shaped by the Pact and a deliberately shortened history.", tag: "ON SCREEN" },
      { name: "Public clinic", note: "Routine care between the specialist levels above and below.", tag: "INFERRED" },
      { name: "Porter rest stop", note: "Message sorting, water and sleeping benches for vertical couriers.", tag: "INFERRED" },
      { name: "Communal landing", note: "Dining, notices and neighborhood meetings beside the central stair.", tag: "ON SCREEN" },
    ],
    people: ["Lukas Kyle", "Patrick Kennedy", "Kathleen Billings", "Camille Sims"],
    telemetry: [{ label: "DENSITY", value: "HIGH" }, { label: "MARKET", value: "OPEN" }, { label: "ACCESS", value: "PUBLIC" }],
    era: "SEASONS 1—2",
    evidence: "Both versions place merchants, families and middle-class work between Up Top and the Down Deep; the numeric band is approximate.",
    status: "ACTIVE",
  },
  {
    id: "farms",
    name: "FARMS",
    kicker: "Food production",
    levels: "Levels 70—81",
    level: 76,
    code: "L-076",
    group: "internal",
    canon: "RECONSTRUCTION",
    scene: "farm",
    color: "#99ad73",
    description:
      "Stacked growing decks, livestock rooms and water lines keep ten thousand people alive without sunlight.",
    details: [
      { name: "Stacked grow decks", note: "Long crop beds under the same grow-light logic used across the silo.", tag: "ON SCREEN" },
      { name: "Livestock pens", note: "Protein and breeding stock isolated from the public corridors.", tag: "ON SCREEN" },
      { name: "Irrigation manifold", note: "Measured water lines, drains and nutrient mixing tanks.", tag: "INFERRED" },
      { name: "Seed vault", note: "Controlled seed inventory for replanting and crop recovery.", tag: "BOOK CANON" },
      { name: "Grow-light gantries", note: "Artificial spectrum lighting over each production bed.", tag: "ON SCREEN" },
      { name: "Wash & cold room", note: "Harvest cleaning, weighing and short-term food storage.", tag: "INFERRED" },
    ],
    people: ["Farm crews", "Livestock keepers", "Supply inspectors", "Porters"],
    telemetry: [{ label: "LIGHT", value: "GROW" }, { label: "WATER", value: "RECYCLED" }, { label: "ACCESS", value: "CREW" }],
    era: "SERIES + BOOKS",
    evidence: "Farms and hydroponics are core to book and series worldbuilding. Their precise grouping here follows the Silo's vertical class logic.",
    status: "NOMINAL",
  },
  {
    id: "supply",
    name: "SUPPLY",
    kicker: "Industrial belt",
    levels: "Levels 90—120",
    level: 104,
    code: "L-104",
    group: "internal",
    canon: "RECONSTRUCTION",
    scene: "industrial",
    color: "#c17b58",
    description:
      "Fabrication, recycling and porter depots convert finite material into an endlessly repaired civilization.",
    details: [
      { name: "Warehouse aisles", note: "Counted shelves of tools, cloth, wire, seals and replacement stock.", tag: "ON SCREEN" },
      { name: "Recycling intake", note: "Upper-level waste sorted into repairable material and scrap.", tag: "ON SCREEN" },
      { name: "Fabrication benches", note: "Lathes, presses and hand tools keep obsolete systems alive.", tag: "ON SCREEN" },
      { name: "Porter depot", note: "Packages, paper messages and route boards beside the stair.", tag: "INFERRED" },
      { name: "Tool control cage", note: "High-risk parts and weapons-adjacent stock under lock.", tag: "INFERRED" },
      { name: "Freight gate", note: "A choke point that can become a barricade during rebellion.", tag: "ON SCREEN" },
    ],
    people: ["Carla McLain", "Walker", "Knox", "Shirley Campbell"],
    telemetry: [{ label: "STOCK", value: "COUNTED" }, { label: "RECYCLE", value: "ACTIVE" }, { label: "ACCESS", value: "SUPPLY" }],
    era: "SEASONS 1—2",
    evidence: "Supply, fabrication, recycling and porters are established functions; exact floor boundaries are not publicly mapped.",
    status: "ACTIVE",
  },
  {
    id: "mechanical",
    name: "MECHANICAL",
    kicker: "The Down Deep",
    levels: "Levels 130—144",
    level: 140,
    code: "L-140",
    group: "internal",
    canon: "SERIES",
    scene: "mechanical",
    color: "#e06745",
    description:
      "At the bottom, the generator, steam feed and machine shops turn heat and pressure into the Silo's pulse.",
    details: [
      { name: "Main turbine generator", note: "Jet-engine-like rotor, removable panels and the silo's primary power train.", tag: "ON SCREEN" },
      { name: "Steam bypass chamber", note: "Pressure diversion and the flooded repair pit used during shutdown.", tag: "ON SCREEN" },
      { name: "Generator control", note: "Load board, pressure gauges, emergency signals and restart sequence.", tag: "ON SCREEN" },
      { name: "Machine shop", note: "Heavy repair benches, hoists, welders and improvised replacement parts.", tag: "ON SCREEN" },
      { name: "Walker's workshop", note: "Electronics bench, radio work and the camera hidden in the wall.", tag: "ON SCREEN" },
      { name: "High gantries", note: "Hooks and lifting rails reach the upper turbine panels.", tag: "ON SCREEN" },
      { name: "Cooling / water lines", note: "Dense pipework feeds the generator hall and adjacent systems.", tag: "INFERRED" },
    ],
    people: ["Juliette Nichols", "Knox", "Shirley Campbell", "Martha Walker", "Cooper"],
    telemetry: [{ label: "STEAM", value: "CRITICAL" }, { label: "OUTPUT", value: "94.1%" }, { label: "ACCESS", value: "CREW" }],
    era: "SEASON 1 / MACHINES",
    evidence: "Mechanical and the lowest inhabited levels are series and book canon. The generator model follows the on-screen jet-engine-like turbine, removable panels, pipes, hoists and high repair positions described by the show's VFX team.",
    status: "HIGH LOAD",
  },
  {
    id: "digger",
    name: "DIGGER CAVERN",
    kicker: "Construction void",
    levels: "Below Level 144 · D-01",
    level: 151,
    code: "D-01",
    group: "below",
    canon: "SERIES",
    scene: "digger",
    color: "#c87a4c",
    description:
      "A cathedral-scale excavation chamber holds the abandoned machine that cut the void for Silo 18. Mechanical built walkways and shelters around its fossilized frame.",
    details: [
      { name: "Primary excavator", note: "The abandoned boring machine that cut the construction void.", tag: "ON SCREEN" },
      { name: "Mechanical catwalk", note: "A later platform network suspended above the flooded undercroft.", tag: "ON SCREEN" },
      { name: "George's hideout", note: "Bed, desk, relics, hard-drive work and concealed research space.", tag: "ON SCREEN" },
      { name: "Rope anchor", note: "Juliette's descent point toward the water below the machine.", tag: "ON SCREEN" },
      { name: "Construction power bay", note: "Dead conduits and panels left with the original excavator.", tag: "INFERRED" },
      { name: "Service crane", note: "A heavy rail for cutter parts and later Mechanical salvage.", tag: "INFERRED" },
    ],
    people: ["George Wilkins", "Juliette Nichols", "Shirley Campbell", "Hank"],
    telemetry: [{ label: "MACHINE", value: "DORMANT" }, { label: "VOID", value: "OPEN" }, { label: "ACCESS", value: "OFF-LEDGER" }],
    era: "SEASONS 1—2",
    evidence: "The excavator cavern, George's living space and Juliette's descent are shown in Season 1. Its dimensions are reconstructed from screen scale.",
    status: "OFF-LEDGER",
  },
  {
    id: "gap",
    name: "THE GAP",
    kicker: "Flooded undercroft",
    levels: "Below Digger · D-02",
    level: 157,
    code: "D-02",
    group: "below",
    canon: "SERIES",
    scene: "gap",
    color: "#668f95",
    description:
      "The apparent underground lake is a shallow flooded slab kept low by hidden outflow pumps. George crossed it; Lukas later confirmed the depth and continued beyond it.",
    details: [
      { name: "Shallow water shelf", note: "A flooded slab that reads as a deep lake from the catwalk above.", tag: "ON SCREEN" },
      { name: "Rope descent", note: "The vertical line used by George, Juliette and later Lukas.", tag: "ON SCREEN" },
      { name: "Pump gallery", note: "Outflow equipment keeps the route passable and the water level low.", tag: "ON SCREEN" },
      { name: "Concrete causeway", note: "A submerged walking surface leading away from the digger.", tag: "ON SCREEN" },
      { name: "Tunnel mouth", note: "A dark lateral opening beyond the flooded chamber.", tag: "ON SCREEN" },
      { name: "Drain / outflow pipes", note: "The physical path that prevents the undercroft from filling.", tag: "INFERRED" },
    ],
    people: ["George Wilkins", "Juliette Nichols", "Lukas Kyle"],
    telemetry: [{ label: "DEPTH", value: "SHALLOW" }, { label: "PUMPS", value: "ACTIVE" }, { label: "ACCESS", value: "UNMAPPED" }],
    era: "SEASON 2 / REVEALED",
    evidence: "Season 2 reveals that the water is far shallower than feared and leads toward the hidden tunnel. Pump placement remains inferred.",
    status: "UNMAPPED",
  },
  {
    id: "tunnel",
    name: "ALGORITHM ACCESS TUNNEL",
    kicker: "Buried threshold",
    levels: "Sub-foundation · T-01",
    level: 163,
    code: "T-01",
    group: "below",
    canon: "SERIES",
    scene: "tunnel",
    color: "#7caeb0",
    description:
      "Beyond the water, a concrete tunnel terminates at a circular intelligent door. It recognized Lukas Kyle and named Quinn, Meadows and George as prior visitors.",
    details: [
      { name: "Circular intelligent door", note: "A sealed metal face that activates when a visitor approaches.", tag: "ON SCREEN" },
      { name: "Algorithm voice interface", note: "The system identifies Lukas and issues the Safeguard warning.", tag: "ON SCREEN" },
      { name: "Segmented tunnel shell", note: "Concrete rings, low service lights and a straight controlled approach.", tag: "ON SCREEN" },
      { name: "Safeguard warning point", note: "The Algorithm threatens activation here; the poison does not physically enter the silo at this door.", tag: "ON SCREEN" },
      { name: "Power / data conduits", note: "Independent cables keep the door and voice alive below the silo.", tag: "INFERRED" },
      { name: "Visitor trace", note: "Quinn, Meadows, George and Lukas reached the threshold at different times.", tag: "ON SCREEN" },
      { name: "Unknown space beyond", note: "The series has not yet confirmed the door's destination or whether it is a transit route.", tag: "ON SCREEN" },
    ],
    people: ["Lukas Kyle", "Salvador Quinn", "Mary Meadows", "George Wilkins"],
    telemetry: [{ label: "VOICE", value: "ALGORITHM" }, { label: "ROLE", value: "WARNING NODE" }, { label: "BEYOND", value: "UNKNOWN" }],
    era: "SEASON 2 / THRESHOLD",
    evidence: "The tunnel, intelligent door and Safeguard warning are on-screen canon. No poison inlet is shown here, and the destination beyond the door remains unresolved.",
    status: "BLACK LEVEL",
  },
  {
    id: "mines",
    name: "THE MINES",
    kicker: "Penal extraction zone",
    levels: "Location deliberately undisclosed",
    level: 154,
    code: "MINE-Δ",
    group: "below",
    canon: "RECONSTRUCTION",
    scene: "mine",
    color: "#a58b6b",
    description:
      "A hard-labor extraction complex supplies raw material and punishment. It is mentioned often, yet the series avoids revealing how its shafts fit between tightly packed silos.",
    details: [
      { name: "Ore headings", note: "Hard-rock work faces extending away from the occupied cylinder.", tag: "INFERRED" },
      { name: "Penal cage lift", note: "A controlled descent for sentenced workers and guards.", tag: "INFERRED" },
      { name: "Rail & ore carts", note: "Narrow-gauge haulage toward sorting and counted storage.", tag: "INFERRED" },
      { name: "Ore sorting bay", note: "Rock, metal-bearing material and waste separated by hand.", tag: "INFERRED" },
      { name: "Ventilation trunks", note: "Dust extraction and emergency air through sealed shafts.", tag: "INFERRED" },
      { name: "Restricted lateral cuts", note: "Routes must avoid the tightly spaced neighboring silos.", tag: "INFERRED" },
    ],
    people: ["Penal crews", "Judicial guards", "Lukas Kyle (sentence commuted)"],
    telemetry: [{ label: "AIR", value: "DUSTY" }, { label: "LIFT", value: "GUARDED" }, { label: "ACCESS", value: "PENAL" }],
    era: "MENTIONED / UNSEEN",
    evidence: "The mines and Lukas's sentence are canon; their geometry is not. This model uses steep shafts below Supply and away from the confirmed tunnel corridor.",
    status: "INFERRED",
  },
  {
    id: "network",
    name: "SILO NETWORK",
    kicker: "Operation Fifty",
    levels: "51 structures in series continuity",
    level: 166,
    code: "NET-51",
    group: "network",
    canon: "RECONSTRUCTION",
    scene: "network",
    color: "#d0b070",
    description:
      "The show confirms fifty other silos beyond 18, but not an open transit grid. Utility links to I.T. and Judicial are distinct from the human-scale tunnel below the digger.",
    details: [
      { name: "51-silo field", note: "Silo 18 plus the fifty other structures confirmed in series dialogue.", tag: "ON SCREEN" },
      { name: "Silo 18 → 17 route", note: "A concealed digger route completed in the book continuity.", tag: "BOOK CANON" },
      { name: "Silo 1 control", note: "The book continuity's command silo and monitoring center.", tag: "BOOK CANON" },
      { name: "Seed alignment", note: "Stored machines are oriented toward the long-term survival cache.", tag: "BOOK CANON" },
      { name: "Surface exclusion field", note: "The circular rims remain separated above ground.", tag: "ON SCREEN" },
      { name: "Universal transit grid", note: "Shown only as a hypothesis; no open all-silo metro is confirmed.", tag: "INFERRED" },
      { name: "I.T. external power line", note: "A dedicated utility feed runs from Silo 1 infrastructure to I.T.", tag: "ON SCREEN" },
      { name: "Judicial Safeguard line", note: "A separate external line delivers the Safeguard agent through Judicial.", tag: "ON SCREEN" },
    ],
    people: ["Silo 18", "Silo 17", "Silo 1", "Seed"],
    telemetry: [{ label: "FIELD", value: "51" }, { label: "UTILITY", value: "2 LINES" }, { label: "TRANSIT", value: "UNCONFIRMED" }],
    era: "SERIES + BOOK SYNTHESIS",
    evidence: "The 51-silo count and two external utility lines are series canon. The 18-to-17 excavation and Seed destination are book canon; a pre-opened universal transit network is not confirmed.",
    status: "SYNTHESIS",
  },
];

const TAU = Math.PI * 2;
const CUT_START = 0.48;
const CUT_LENGTH = TAU - 0.96;

function levelToY(level: number) {
  return 17 - ((level - 1) / 143) * 34;
}

function zoneViewY(zone: Zone) {
  if (zone.id === "digger") return -22;
  if (zone.id === "gap") return -27;
  if (zone.id === "tunnel") return -29;
  if (zone.id === "mines") return -24;
  return levelToY(Math.min(zone.level, 144));
}

function zoneForLevel(level: number) {
  if (level <= 13) return 0;
  if (level <= 17) return 1;
  if (level <= 22) return 2;
  if (level <= 45) return 3;
  if (level <= 69) return 4;
  if (level <= 81) return 5;
  if (level <= 124) return 6;
  return 7;
}

function seeded(index: number) {
  const value = Math.sin(index * 12.9898 + 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function SiloMark() {
  return (
    <div className="silo-mark" aria-label="Silo 18">
      <span className="silo-mark__ring" />
      <span className="silo-mark__number">18</span>
    </div>
  );
}

export default function SiloExperience() {
  const mountRef = useRef<HTMLDivElement>(null);
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusRef = useRef<(zone: Zone) => void>(() => undefined);
  const sceneModeRef = useRef<(mode: "overview" | "section" | "network", zone: Zone) => void>(() => undefined);
  const resetRef = useRef<() => void>(() => undefined);
  const autoRotateRef = useRef(true);
  const visualRef = useRef<{
    cutShell?: THREE.Object3D;
    fullShell?: THREE.Object3D;
    utility?: THREE.Object3D;
    population?: THREE.Object3D;
    floorMaterials?: THREE.MeshStandardMaterial[];
    scene?: THREE.Scene;
    renderer?: THREE.WebGLRenderer;
    hemisphere?: THREE.HemisphereLight;
    key?: THREE.DirectionalLight;
  }>({});
  const [selected, setSelected] = useState(ZONES[0]);
  const [sectorTab, setSectorTab] = useState<"internal" | "below" | "network">("internal");
  const [viewMode, setViewMode] = useState<"overview" | "section" | "network">("overview");
  const [mode, setMode] = useState<"structure" | "systems" | "life">("structure");
  const [cutaway, setCutaway] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  // Start with the CSS cutaway visible so server-rendered previews and
  // WebGL-restricted iframes never collapse to an empty black stage.
  const [webglUnavailable, setWebglUnavailable] = useState(true);
  const [help, setHelp] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("silo-theme");
    if (saved === "dark" || saved === "light") {
      setTheme(saved);
      return;
    }
    if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("silo-theme", theme);
    document.documentElement.dataset.theme = theme;
    const visuals = visualRef.current;
    if (visuals.scene?.fog instanceof THREE.FogExp2) {
      visuals.scene.fog.color.set(theme === "light" ? 0xe7e1d5 : 0x070806);
      visuals.scene.fog.density = theme === "light" ? 0.012 : 0.0155;
    }
    if (visuals.renderer) visuals.renderer.toneMappingExposure = theme === "light" ? 1.24 : 1.08;
    if (visuals.hemisphere) {
      visuals.hemisphere.color.set(theme === "light" ? 0xf5ead4 : 0x9aa7a1);
      visuals.hemisphere.groundColor.set(theme === "light" ? 0x6f6658 : 0x17130e);
      visuals.hemisphere.intensity = theme === "light" ? 2.25 : 1.5;
    }
    if (visuals.key) {
      visuals.key.color.set(theme === "light" ? 0xffefd1 : 0xe2c99e);
      visuals.key.intensity = theme === "light" ? 4.2 : 3.4;
    }
  }, [theme]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    const visuals = visualRef.current;
    if (visuals.cutShell) visuals.cutShell.visible = cutaway;
    if (visuals.fullShell) visuals.fullShell.visible = !cutaway;
    if (visuals.utility) visuals.utility.visible = mode !== "life";
    if (visuals.population) visuals.population.visible = mode !== "systems";
    visuals.floorMaterials?.forEach((material, index) => {
      material.opacity = mode === "systems" ? 0.2 : mode === "life" ? 0.38 : 0.72;
      material.emissiveIntensity = mode === "life" && index === 3 ? 0.12 : 0.035;
    });
  }, [cutaway, mode]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const capabilityCanvas = document.createElement("canvas");
    let capabilityContext: WebGL2RenderingContext | WebGLRenderingContext | null = null;
    try {
      capabilityContext = capabilityCanvas.getContext("webgl2") || capabilityCanvas.getContext("webgl");
    } catch {
      capabilityContext = null;
    }
    const hasWebGL = Boolean(capabilityContext);
    capabilityContext?.getExtension("WEBGL_lose_context")?.loseContext();
    if (!hasWebGL) {
      setWebglUnavailable(true);
      return;
    }

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070806, 0.0155);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 180);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      setWebglUnavailable(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute("aria-label", "Interactive 3D cutaway of Silo 18");
    renderer.domElement.setAttribute("role", "img");
    mount.appendChild(renderer.domElement);
    const onContextLost = (event: Event) => {
      event.preventDefault();
      setWebglUnavailable(true);
    };
    renderer.domElement.addEventListener("webglcontextlost", onContextLost, false);

    const world = new THREE.Group();
    world.rotation.y = -0.05;
    scene.add(world);
    const hemisphere = new THREE.HemisphereLight(0x9aa7a1, 0x17130e, 1.5);
    scene.add(hemisphere);
    const key = new THREE.DirectionalLight(0xe2c99e, 3.4);
    key.position.set(10, 24, 16);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    visualRef.current.scene = scene;
    visualRef.current.renderer = renderer;
    visualRef.current.hemisphere = hemisphere;
    visualRef.current.key = key;
    const redLight = new THREE.PointLight(0xd7502e, 24, 18, 2);
    redLight.position.set(2, -14, 7);
    scene.add(redLight);
    const topLight = new THREE.PointLight(0x8eb9b7, 18, 28, 2);
    topLight.position.set(-2, 14, 5);
    scene.add(topLight);

    const shellCut = new THREE.Group();
    const shellMaterial = new THREE.MeshStandardMaterial({ color: 0x252722, roughness: 0.92, metalness: 0.08, side: THREE.DoubleSide });
    const outerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(11.25, 11.55, 36, 112, 10, true, CUT_START, CUT_LENGTH),
      shellMaterial,
    );
    outerWall.receiveShadow = true;
    shellCut.add(outerWall);
    world.add(shellCut);

    const fullShell = new THREE.Mesh(
      new THREE.CylinderGeometry(11.35, 11.65, 36, 112, 10, true),
      new THREE.MeshPhysicalMaterial({ color: 0x2b2d28, roughness: 0.8, transparent: true, opacity: 0.34, side: THREE.DoubleSide, depthWrite: false }),
    );
    fullShell.visible = false;
    world.add(fullShell);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x151713, roughness: 0.95 });
    const roof = new THREE.Mesh(new THREE.CylinderGeometry(11.25, 11.25, 0.55, 112), capMat);
    roof.position.y = 18;
    world.add(roof);
    const foundation = roof.clone();
    foundation.scale.set(1.05, 1.2, 1.05);
    foundation.position.y = -18;
    world.add(foundation);

    const zoneColors = [0xd7b26d, 0xb98a58, 0x82b8bc, 0xa5aaa0, 0xc9a778, 0x99ad73, 0xc17b58, 0xe06745];
    const floorMaterials = zoneColors.map(
      (color) => new THREE.MeshStandardMaterial({ color, roughness: 0.72, metalness: 0.1, side: THREE.DoubleSide, transparent: true, opacity: 0.72, emissive: color, emissiveIntensity: 0.035 }),
    );
    const floorGroup = new THREE.Group();
    const floorGeometry = new THREE.CylinderGeometry(10.55, 10.55, 0.055, 64, 1, false, CUT_START, CUT_LENGTH);
    for (let level = 1; level <= 144; level += 1) {
      const floor = new THREE.Mesh(floorGeometry, floorMaterials[zoneForLevel(level)]);
      floor.position.y = levelToY(level);
      floorGroup.add(floor);
    }
    world.add(floorGroup);

    const ribs = new THREE.Group();
    const ribGeo = new THREE.BoxGeometry(0.18, 35.7, 0.35);
    const ribMat = new THREE.MeshStandardMaterial({ color: 0x4c493f, roughness: 0.8, metalness: 0.25 });
    for (let i = 0; i < 22; i += 1) {
      const angle = CUT_START + (i / 21) * CUT_LENGTH;
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(Math.sin(angle) * 10.8, 0, Math.cos(angle) * 10.8);
      rib.rotation.y = angle;
      ribs.add(rib);
    }
    world.add(ribs);

    const core = new THREE.Group();
    core.add(new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.42, 35.4, 16),
      new THREE.MeshStandardMaterial({ color: 0x514c42, roughness: 0.7, metalness: 0.52 }),
    ));
    const helixPoints: THREE.Vector3[] = [];
    for (let i = 0; i <= 960; i += 1) {
      const t = i / 960;
      const angle = t * TAU * 35;
      helixPoints.push(new THREE.Vector3(Math.sin(angle) * 1.72, 17.2 - t * 34.4, Math.cos(angle) * 1.72));
    }
    core.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(helixPoints), 1150, 0.095, 5, false),
      new THREE.MeshStandardMaterial({ color: 0xb67246, roughness: 0.46, metalness: 0.72, emissive: 0x51220f, emissiveIntensity: 0.25 }),
    ));
    const railPoints = helixPoints.map((point) => point.clone().multiply(new THREE.Vector3(1.16, 1, 1.16)).add(new THREE.Vector3(0, 0.33, 0)));
    core.add(new THREE.Mesh(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3(railPoints), 1150, 0.035, 4, false),
      new THREE.MeshStandardMaterial({ color: 0x817465, roughness: 0.42, metalness: 0.78 }),
    ));
    world.add(core);

    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x6d6658, roughness: 0.75, metalness: 0.35 });
    for (let level = 4; level <= 140; level += 8) {
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.08, 7.4), bridgeMat);
      bridge.position.set(0, levelToY(level) + 0.1, 5.1);
      world.add(bridge);
    }

    const population = new THREE.Group();
    const windowGeo = new THREE.BoxGeometry(0.16, 0.08, 0.035);
    const windowMats = [
      new THREE.MeshBasicMaterial({ color: 0xdca55c }),
      new THREE.MeshBasicMaterial({ color: 0x708d82 }),
      new THREE.MeshBasicMaterial({ color: 0x9b6d4d }),
    ];
    let lightIndex = 0;
    for (let level = 2; level <= 143; level += 2) {
      for (let j = 0; j < 11; j += 1) {
        lightIndex += 1;
        if (seeded(lightIndex) < 0.23) continue;
        const angle = CUT_START + 0.12 + seeded(lightIndex + 30) * (CUT_LENGTH - 0.24);
        const light = new THREE.Mesh(windowGeo, windowMats[Math.floor(seeded(lightIndex + 80) * 3)]);
        light.position.set(Math.sin(angle) * 10.2, levelToY(level) + 0.08, Math.cos(angle) * 10.2);
        light.rotation.y = angle;
        population.add(light);
      }
    }
    world.add(population);

    const rooms = new THREE.Group();
    const roomGeo = new THREE.BoxGeometry(1.6, 0.42, 1.1);
    ZONES.filter((zone) => zone.group === "internal").forEach((zone) => {
      for (let j = 0; j < 5; j += 1) {
        const angle = 1.35 + j * 0.72;
        const room = new THREE.Mesh(roomGeo, floorMaterials[zoneForLevel(zone.level)]);
        room.position.set(Math.sin(angle) * 8.6, levelToY(zone.level) + (j % 2) * 0.22, Math.cos(angle) * 8.6);
        room.rotation.y = angle;
        room.castShadow = true;
        rooms.add(room);
      }
    });
    world.add(rooms);

    const utility = new THREE.Group();
    const pipeMat = new THREE.MeshStandardMaterial({ color: 0x8f765d, roughness: 0.38, metalness: 0.76 });
    [-7.7, -8.5, 7.8].forEach((x, index) => {
      const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.12 + index * 0.03, 0.12 + index * 0.03, 31, 12), pipeMat);
      pipe.position.set(x, -0.7, -6.4 + index * 1.2);
      utility.add(pipe);
    });
    for (let y = -12; y <= 12; y += 4) {
      const pipeRing = new THREE.Mesh(new THREE.TorusGeometry(8.9, 0.075, 5, 96, CUT_LENGTH), pipeMat);
      pipeRing.position.y = y;
      pipeRing.rotation.x = Math.PI / 2;
      pipeRing.rotation.z = CUT_START;
      utility.add(pipeRing);
    }
    const addExternalUtilityLine = (points: THREE.Vector3[], color: number, emissive: number) => {
      const material = new THREE.MeshStandardMaterial({ color, emissive, emissiveIntensity: 0.9, roughness: 0.34, metalness: 0.82 });
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Mesh(new THREE.TubeGeometry(curve, 72, 0.2, 12, false), material);
      utility.add(line);
      const endpoint = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 12), material);
      endpoint.position.copy(points[points.length - 1]);
      utility.add(endpoint);
    };
    addExternalUtilityLine(
      [new THREE.Vector3(-19, levelToY(18), -4), new THREE.Vector3(-12, levelToY(18), -4), new THREE.Vector3(-8.4, levelToY(18), -5.1)],
      0x6eabb4,
      0x174d56,
    );
    addExternalUtilityLine(
      [new THREE.Vector3(19, levelToY(15), -4), new THREE.Vector3(12, levelToY(15), -4), new THREE.Vector3(8.4, levelToY(15), -5.1)],
      0xb8563f,
      0x59160c,
    );
    world.add(utility);

    const screenCanvas = document.createElement("canvas");
    screenCanvas.width = 512;
    screenCanvas.height = 512;
    const screenCtx = screenCanvas.getContext("2d");
    if (screenCtx) {
      const gradient = screenCtx.createLinearGradient(0, 0, 0, 512);
      gradient.addColorStop(0, "#88918a");
      gradient.addColorStop(0.58, "#4f584f");
      gradient.addColorStop(0.6, "#31352f");
      gradient.addColorStop(1, "#111410");
      screenCtx.fillStyle = gradient;
      screenCtx.fillRect(0, 0, 512, 512);
      screenCtx.strokeStyle = "#232a22";
      screenCtx.lineWidth = 7;
      screenCtx.beginPath();
      screenCtx.moveTo(286, 320);
      screenCtx.lineTo(276, 180);
      screenCtx.moveTo(279, 226);
      screenCtx.lineTo(214, 172);
      screenCtx.moveTo(281, 244);
      screenCtx.lineTo(348, 194);
      screenCtx.stroke();
    }
    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    const screen = new THREE.Mesh(
      new THREE.CircleGeometry(3.25, 72),
      new THREE.MeshBasicMaterial({ map: screenTexture, color: 0xa3aaa0, toneMapped: false }),
    );
    screen.position.set(0, 14.2, -9.75);
    world.add(screen);
    const screenRim = new THREE.Mesh(
      new THREE.TorusGeometry(3.35, 0.18, 12, 72),
      new THREE.MeshStandardMaterial({ color: 0x363a35, roughness: 0.66, metalness: 0.55 }),
    );
    screenRim.position.copy(screen.position);
    world.add(screenRim);

    const tableMat = new THREE.MeshStandardMaterial({ color: 0x5b574f, roughness: 0.9 });
    for (let i = -2; i <= 2; i += 1) {
      const table = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.12, 16), tableMat);
      table.position.set(i * 1.35, 13.05, 3.7 + Math.abs(i) * 0.28);
      world.add(table);
    }

    const farmMat = new THREE.MeshStandardMaterial({ color: 0x7d9868, emissive: 0x29451e, emissiveIntensity: 1.1 });
    for (let i = 0; i < 8; i += 1) {
      const bed = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.07, 4.6), farmMat);
      bed.position.set(-4.2 + i * 1.2, levelToY(76) + 0.16, -4.1);
      world.add(bed);
    }

    const generator = new THREE.Group();
    generator.position.set(0, levelToY(140) + 0.15, -5.8);
    const genMat = new THREE.MeshStandardMaterial({ color: 0x4a4f49, roughness: 0.42, metalness: 0.82 });
    const rotorMat = new THREE.MeshStandardMaterial({ color: 0xa95b3f, roughness: 0.46, metalness: 0.64, emissive: 0x3a0d05, emissiveIntensity: 0.55 });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.5, 4.8, 28), genMat);
    body.rotation.z = Math.PI / 2;
    generator.add(body);
    [-2.1, -1.05, 0, 1.05, 2.1].forEach((x) => {
      const band = new THREE.Mesh(new THREE.TorusGeometry(1.52, 0.1, 8, 32), rotorMat);
      band.rotation.y = Math.PI / 2;
      band.position.x = x;
      generator.add(band);
    });
    world.add(generator);

    // Everything the official level count tries to hide: the digger void,
    // water shelf, Algorithm threshold and a deliberately non-canonical mine routing.
    const subterranean = new THREE.Group();
    const rockMat = new THREE.MeshStandardMaterial({ color: 0x24231f, roughness: 1, metalness: 0.02, side: THREE.DoubleSide });
    const wetRockMat = new THREE.MeshStandardMaterial({ color: 0x252a27, roughness: 0.88, metalness: 0.08 });
    const belowMetal = new THREE.MeshStandardMaterial({ color: 0x554d42, roughness: 0.52, metalness: 0.7 });
    const cavernRing = new THREE.Mesh(new THREE.TorusGeometry(10.8, 2.1, 12, 72, Math.PI * 1.72), rockMat);
    cavernRing.position.set(0, -21.6, -1.2);
    cavernRing.rotation.x = Math.PI / 2;
    cavernRing.rotation.z = 0.45;
    cavernRing.scale.y = 0.58;
    subterranean.add(cavernRing);
    const water = new THREE.Mesh(
      new THREE.CylinderGeometry(10.2, 10.2, 0.16, 72),
      new THREE.MeshPhysicalMaterial({ color: 0x31525a, roughness: 0.16, metalness: 0.18, transparent: true, opacity: 0.72, transmission: 0.18 }),
    );
    water.position.y = -27.1;
    subterranean.add(water);

    const digger = new THREE.Group();
    digger.position.set(-1.8, -23.1, -4.4);
    const diggerBody = new THREE.Mesh(new THREE.CylinderGeometry(2.05, 2.45, 8.2, 28), belowMetal);
    diggerBody.rotation.z = Math.PI / 2;
    digger.add(diggerBody);
    for (let i = -3; i <= 3; i += 1) {
      const band = new THREE.Mesh(new THREE.TorusGeometry(2.26, 0.12, 8, 36), rotorMat);
      band.rotation.y = Math.PI / 2;
      band.position.x = i * 1.02;
      digger.add(band);
    }
    const cutter = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 2.7, 1.45, 18), rotorMat);
    cutter.rotation.z = -Math.PI / 2;
    cutter.position.x = 4.75;
    digger.add(cutter);
    for (let i = 0; i < 12; i += 1) {
      const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 1.15), belowMetal);
      const angle = (i / 12) * TAU;
      tooth.position.set(5.25, Math.sin(angle) * 2.45, Math.cos(angle) * 2.45);
      tooth.rotation.x = angle;
      digger.add(tooth);
    }
    subterranean.add(digger);

    const catwalk = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.16, 1.1), bridgeMat);
    catwalk.position.set(1.5, -20.15, 3.6);
    subterranean.add(catwalk);
    for (let i = -5; i <= 5; i += 1) {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.85, 0.05), pipeMat);
      post.position.set(i + 1.5, -19.7, 4.05);
      subterranean.add(post);
    }
    const rope = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 7.1, 8), new THREE.MeshStandardMaterial({ color: 0x8d7047, roughness: 1 }));
    rope.position.set(4.7, -23.6, 4.15);
    subterranean.add(rope);
    const campLight = new THREE.PointLight(0xe9a04e, 9, 8, 2);
    campLight.position.set(5.7, -20.4, 2.8);
    subterranean.add(campLight);
    for (let i = 0; i < 5; i += 1) {
      const crate = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.7), new THREE.MeshStandardMaterial({ color: 0x6d5439, roughness: 0.94 }));
      crate.position.set(4.5 + (i % 3) * 0.8, -19.76 + Math.floor(i / 3) * 0.55, 2.8);
      subterranean.add(crate);
    }

    const tunnelShell = new THREE.Mesh(
      new THREE.CylinderGeometry(2.6, 2.9, 18, 32, 1, true),
      new THREE.MeshStandardMaterial({ color: 0x373a36, roughness: 0.88, metalness: 0.08, side: THREE.BackSide }),
    );
    tunnelShell.rotation.x = Math.PI / 2;
    tunnelShell.position.set(0, -27.3, -18.1);
    subterranean.add(tunnelShell);
    for (let z = -10; z >= -26; z -= 2) {
      const brace = new THREE.Mesh(new THREE.TorusGeometry(2.66, 0.09, 8, 28), belowMetal);
      brace.position.set(0, -27.3, z);
      subterranean.add(brace);
    }
    const door = new THREE.Mesh(new THREE.CylinderGeometry(2.56, 2.56, 0.34, 48), belowMetal);
    door.rotation.x = Math.PI / 2;
    door.position.set(0, -27.3, -27.3);
    subterranean.add(door);
    const doorRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.85, 0.14, 10, 48),
      new THREE.MeshStandardMaterial({ color: 0x76aeb0, emissive: 0x235b60, emissiveIntensity: 1.5, metalness: 0.72, roughness: 0.3 }),
    );
    doorRing.position.set(0, -27.3, -27.5);
    subterranean.add(doorRing);

    const mineMat = new THREE.MeshStandardMaterial({ color: 0x6b5c48, roughness: 0.95, metalness: 0.12 });
    const mineEndpoints = [new THREE.Vector3(-19, -24.5, -5), new THREE.Vector3(18, -25.5, -8), new THREE.Vector3(-15, -30, -14)];
    mineEndpoints.forEach((end, index) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(index === 1 ? 8 : -8, -22.5 - index, -2),
        new THREE.Vector3(end.x * 0.55, end.y + 1.2, end.z * 0.55),
        end,
      ]);
      const shaft = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 64, 1.45, 12, false),
        new THREE.MeshStandardMaterial({ color: 0x302d28, roughness: 1, side: THREE.BackSide }),
      );
      subterranean.add(shaft);
      const railGeometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(48));
      subterranean.add(new THREE.Line(railGeometry, new THREE.LineBasicMaterial({ color: 0xa48a64 })));
    });
    world.add(subterranean);

    // Section mode: compact, scene-specific architectural dioramas.
    const detailRoot = new THREE.Group();
    detailRoot.visible = false;
    scene.add(detailRoot);
    const detailGroups = new Map<string, THREE.Group>();
    const detailWallMat = new THREE.MeshStandardMaterial({ color: 0x262923, roughness: 0.9, metalness: 0.08 });
    const detailMetalMat = new THREE.MeshStandardMaterial({ color: 0x5c5b53, roughness: 0.42, metalness: 0.72 });
    const detailDarkMat = new THREE.MeshStandardMaterial({ color: 0x171a17, roughness: 0.72, metalness: 0.38 });
    const detailConcreteMat = new THREE.MeshStandardMaterial({ color: 0x3a3d38, roughness: 0.96, metalness: 0.02 });
    const detailGlassMat = new THREE.MeshPhysicalMaterial({ color: 0x8ca6a1, roughness: 0.2, metalness: 0.05, transparent: true, opacity: 0.36, transmission: 0.18, depthWrite: false });
    const addBox = (group: THREE.Group, size: [number, number, number], position: [number, number, number], material: THREE.Material, rotationY = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.rotation.y = rotationY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };
    const addCylinder = (
      group: THREE.Group,
      radius: number,
      height: number,
      position: [number, number, number],
      material: THREE.Material,
      rotation: [number, number, number] = [0, 0, 0],
      segments = 24,
    ) => {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, segments), material);
      mesh.position.set(...position);
      mesh.rotation.set(...rotation);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
    };
    const addTube = (group: THREE.Group, points: Array<[number, number, number]>, radius: number, material: THREE.Material) => {
      const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)));
      const mesh = new THREE.Mesh(new THREE.TubeGeometry(curve, 42, radius, 8, false), material);
      mesh.castShadow = true;
      group.add(mesh);
      return mesh;
    };
    const addConsole = (group: THREE.Group, position: [number, number, number], material: THREE.Material, width = 1.65, rotationY = 0) => {
      addBox(group, [width, 0.85, 0.65], position, detailDarkMat, rotationY);
      const screen = addBox(group, [width * 0.72, 0.42, 0.035], [position[0], position[1] + 0.16, position[2] + 0.34], material, rotationY);
      screen.material = material;
      return screen;
    };
    const addRail = (group: THREE.Group, xStart: number, xEnd: number, y: number, z: number, material: THREE.Material) => {
      addBox(group, [xEnd - xStart, 0.08, 0.08], [(xStart + xEnd) / 2, y + 0.72, z], material);
      addBox(group, [xEnd - xStart, 0.06, 0.06], [(xStart + xEnd) / 2, y + 0.28, z], material);
      for (let x = xStart; x <= xEnd + 0.01; x += 1.2) addBox(group, [0.06, 0.82, 0.06], [x, y + 0.36, z], material);
    };
    const addDetailTurbine = (group: THREE.Group, color: number, scale = 1) => {
      const machine = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.44, metalness: 0.74, emissive: color, emissiveIntensity: 0.12 });
      const coreMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.25 * scale, 1.45 * scale, 5.8 * scale, 28), detailMetalMat);
      coreMesh.rotation.z = Math.PI / 2;
      machine.add(coreMesh);
      for (let i = -2; i <= 2; i += 1) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(1.48 * scale, 0.12 * scale, 8, 32), mat);
        ring.rotation.y = Math.PI / 2;
        ring.position.x = i * 1.2 * scale;
        machine.add(ring);
      }
      group.add(machine);
      return machine;
    };

    ZONES.filter((zone) => zone.scene !== "network").forEach((zone) => {
      const group = new THREE.Group();
      group.visible = false;
      const tint = new THREE.Color(zone.color);
      const accent = new THREE.MeshStandardMaterial({ color: tint, roughness: 0.48, metalness: 0.48, emissive: tint, emissiveIntensity: 0.12 });
      const glow = new THREE.MeshBasicMaterial({ color: tint, toneMapped: false });
      addBox(group, [14, 0.36, 10], [0, -2.65, 0], detailWallMat);
      addBox(group, [14, 6, 0.35], [0, 0.2, -4.85], detailWallMat);
      addBox(group, [0.35, 6, 10], [-6.85, 0.2, 0], detailWallMat);
      addBox(group, [14, 0.24, 10], [0, 3.08, 0], detailDarkMat);
      for (let x = -6; x <= 6; x += 1.2) addBox(group, [0.035, 0.025, 9.2], [x, -2.44, 0], detailMetalMat);
      for (let z = -4; z <= 4; z += 2) addBox(group, [13.2, 0.16, 0.22], [0, 2.86, z], detailMetalMat);
      for (let x = -5.4; x <= 5.4; x += 2.7) addBox(group, [1.9, 0.045, 0.32], [x, 2.72, -0.25], glow);
      addTube(group, [[-6.5, 2.48, -3.8], [-3, 2.48, -3.8], [0, 2.48, -4.1], [6.2, 2.48, -4.1]], 0.09, accent);
      const localLight = new THREE.PointLight(tint, 12, 18, 2);
      localLight.position.set(3.5, 3.8, 3.5);
      group.add(localLight);

      if (zone.scene === "civic") {
        const display = new THREE.Mesh(new THREE.CircleGeometry(2.25, 48), new THREE.MeshBasicMaterial({ color: 0x718078, toneMapped: false }));
        display.position.set(0.2, 0.95, -4.62);
        group.add(display);
        const displayRim = new THREE.Mesh(new THREE.TorusGeometry(2.32, 0.14, 10, 48), detailMetalMat);
        displayRim.position.copy(display.position);
        group.add(displayRim);
        for (let i = -2; i <= 2; i += 1) {
          const table = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.18, 16), detailMetalMat);
          table.position.set(i * 1.65, -1.62, 0.6 + Math.abs(i) * 0.34);
          group.add(table);
          for (const offset of [-0.82, 0.82]) addCylinder(group, 0.22, 0.35, [i * 1.65 + offset, -1.82, 0.6 + Math.abs(i) * 0.34], detailDarkMat);
        }
        const airlock = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.22, 10, 32), accent);
        airlock.position.set(-5.05, 0.1, -4.58);
        group.add(airlock);
        addCylinder(group, 1.05, 0.24, [-5.05, 0.1, -4.7], detailDarkMat, [Math.PI / 2, 0, 0]);
        addBox(group, [3.5, 0.88, 1.35], [4.65, -1.75, -2.1], detailMetalMat);
        addConsole(group, [4.65, -0.9, -2.25], accent, 2.15);
        for (let x = 3.2; x <= 6; x += 0.38) addBox(group, [0.08, 3.1, 0.08], [x, -0.85, 2.85], detailMetalMat);
        addRail(group, -6, 6, -2.38, 4.1, detailMetalMat);
      } else if (zone.scene === "judicial") {
        addBox(group, [6.4, 0.65, 2.35], [1.1, -1.62, -2.9], detailMetalMat);
        addBox(group, [3.5, 1.35, 1.2], [1.1, -0.7, -3.55], detailDarkMat);
        addConsole(group, [1.1, 0.28, -3.65], accent, 2.5);
        for (let x = -5.75; x <= -2.45; x += 1.1) {
          addBox(group, [0.88, 3.7, 0.62], [x, -0.52, -4.35], detailMetalMat);
          for (let y = -1.65; y <= 1.2; y += 0.62) addBox(group, [0.68, 0.045, 0.04], [x, y, -4.02], accent);
        }
        for (let x = 3.5; x <= 6.1; x += 0.42) addBox(group, [0.08, 3.9, 0.08], [x, -0.55, 2.55], detailMetalMat);
        addBox(group, [3.2, 0.28, 1.25], [-3.9, -1.95, 0.5], detailDarkMat);
        addConsole(group, [-3.9, -1.25, 0.25], accent, 2.5);
        for (let x = -1.4; x <= 1.4; x += 1.4) addBox(group, [0.9, 1.7, 0.48], [x, 0.9, -4.46], detailDarkMat);
        addRail(group, -6, 3.1, -2.38, 4.2, accent);
        const safeguardMat = new THREE.MeshStandardMaterial({ color: 0x8f3f2f, emissive: 0x4f0e09, emissiveIntensity: 0.75, roughness: 0.36, metalness: 0.8 });
        addTube(group, [[6.45, 2.25, -4.1], [4.75, 2.25, -4.1], [4.75, -1.75, -4.1], [2.8, -1.75, -4.1]], 0.24, safeguardMat);
        for (let y = -1.65; y <= 2.15; y += 0.56) addBox(group, [1.25, 0.045, 0.04], [4.75, y, -3.92], safeguardMat);
        const valve = new THREE.Mesh(new THREE.TorusGeometry(0.58, 0.09, 8, 28), safeguardMat);
        valve.position.set(3.55, -1.72, -4.28);
        group.add(valve);
        addBox(group, [0.08, 4.55, 2.4], [2.35, -0.25, -3.55], detailConcreteMat);
        addConsole(group, [5.4, -1.05, -2.9], safeguardMat, 1.2);
      } else if (zone.scene === "it") {
        // Season 2's Vault is deliberately unlike the rest of the silo: a Y-plan
        // focused on the Algorithm screen with stepped server / power banks.
        const bridge = addBox(group, [4.8, 0.18, 4.2], [0, -2.18, 2.55], detailMetalMat);
        bridge.receiveShadow = true;
        addRail(group, -2.35, 2.35, -2.22, 0.6, accent);
        addRail(group, -2.35, 2.35, -2.22, 4.35, accent);
        for (const side of [-1, 1]) {
          for (let i = 0; i < 4; i += 1) {
            const x = side * (2.75 + i * 0.82);
            const z = -2.65 + i * 0.28;
            const height = 1.25 + i * 0.55;
            addBox(group, [0.65, height, 2.2], [x, -2.22 + height / 2, z], i % 2 ? detailMetalMat : detailDarkMat, side * -0.12);
            for (let y = -1.88; y < -1.88 + height - 0.2; y += 0.42) addBox(group, [0.43, 0.035, 0.035], [x, y, z + 1.12], accent, side * -0.12);
          }
          addBox(group, [0.24, 0.06, 6.5], [side * 1.18, -2.23, -0.25], accent, side * 0.42);
          addTube(group, [[side * 5.7, 2.15, -3.9], [side * 5.7, -1.65, -3.9], [side * 3.5, -1.65, -3.1]], 0.12, accent);
        }
        for (const x of [-5.45, 5.45]) {
          addBox(group, [1.05, 4.15, 1.4], [x, -0.45, -3.75], detailMetalMat);
          for (let y = -1.85; y <= 1.25; y += 0.52) addBox(group, [0.72, 0.055, 0.05], [x, y, -3.02], accent);
        }
        const vaultRim = new THREE.Mesh(new THREE.TorusGeometry(2.05, 0.24, 12, 48), accent);
        vaultRim.position.set(0, 0.25, -4.58);
        group.add(vaultRim);
        const vaultFace = new THREE.Mesh(new THREE.CircleGeometry(1.82, 48), detailDarkMat);
        vaultFace.position.set(0, 0.25, -4.595);
        group.add(vaultFace);
        const algorithmScreen = addBox(group, [1.28, 1.55, 0.05], [0, 0.28, -4.64], glow);
        algorithmScreen.material = glow;
        addConsole(group, [0, -1.58, -2.55], accent, 2.1);
        addBox(group, [0.2, 0.06, 4.5], [0, -2.27, -0.5], accent);
        addBox(group, [0.95, 0.12, 0.55], [0, -1.05, -2.22], detailMetalMat);
        addBox(group, [0.13, 0.06, 0.2], [0.28, -0.91, -1.92], new THREE.MeshBasicMaterial({ color: 0xd34d51, toneMapped: false }));
        addBox(group, [2.7, 2.35, 1.55], [-4.45, -1.22, 1.65], detailDarkMat);
        addBox(group, [1.8, 0.18, 0.75], [-4.45, 0.02, 1.92], detailGlassMat);
        addBox(group, [2.35, 1.8, 1.5], [4.5, -1.45, 1.75], detailMetalMat);
        for (let y = -2.1; y <= -0.9; y += 0.4) addBox(group, [1.7, 0.08, 0.08], [4.5, y, 2.52], accent);
        const feederMat = new THREE.MeshStandardMaterial({ color: 0x548e9a, emissive: 0x173e49, emissiveIntensity: 0.72, roughness: 0.34, metalness: 0.82 });
        addTube(group, [[-6.5, 2.52, -4.25], [-5.8, 2.52, -4.25], [-5.8, -1.72, -4.25], [-3.6, -1.72, -3.55]], 0.2, feederMat);
        for (let y = -1.65; y <= 2.2; y += 0.52) addBox(group, [0.9, 0.045, 0.04], [-5.8, y, -4.02], feederMat);
        addBox(group, [1.35, 2.5, 0.82], [-5.75, -1.1, 2.85], detailDarkMat);
        for (let y = -2.05; y <= -0.25; y += 0.38) addBox(group, [0.95, 0.05, 0.05], [-5.75, y, 3.28], feederMat);
      } else if (zone.scene === "medical") {
        const cleanMat = new THREE.MeshStandardMaterial({ color: 0xb6b8ad, roughness: 0.82 });
        for (let x = -4.8; x <= 1.2; x += 3) {
          addBox(group, [2.35, 0.32, 3.7], [x, -1.55, 0.3], cleanMat);
          addBox(group, [1.25, 0.38, 0.65], [x, -1.02, -1.18], accent);
          const surgicalLamp = new THREE.Mesh(new THREE.TorusGeometry(0.68, 0.12, 8, 24), glow);
          surgicalLamp.rotation.x = Math.PI / 2;
          surgicalLamp.position.set(x, 1.1, 0.15);
          group.add(surgicalLamp);
          addCylinder(group, 0.05, 1.5, [x, 2.05, 0.15], detailMetalMat);
        }
        addBox(group, [0.12, 5.4, 8.6], [2.7, 0, -0.1], detailGlassMat);
        for (let x = 3.45; x <= 5.65; x += 1.1) {
          const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.38, 0.85, 4, 12), detailGlassMat);
          pod.rotation.z = Math.PI / 2;
          pod.position.set(x, -1.45, -2.65);
          group.add(pod);
          addBox(group, [0.9, 0.1, 1.4], [x, -2.02, -2.65], detailMetalMat);
        }
        for (let y = -1.55; y <= 1.55; y += 0.78) addBox(group, [2.2, 0.08, 0.55], [4.55, y, -4.35], y > 0.7 ? accent : detailMetalMat);
        addConsole(group, [4.5, -1.28, 1.75], accent, 2.25);
      } else if (zone.scene === "residential") {
        for (let floor = 0; floor < 2; floor += 1) {
          for (let x = -5.2; x <= 5.2; x += 2.6) {
            addBox(group, [2.2, 2.05, 2.1], [x, -1.38 + floor * 2.3, -3.55], floor ? detailDarkMat : detailMetalMat);
            addBox(group, [0.72, 1.15, 0.04], [x, -1.35 + floor * 2.3, -2.47], (Math.round(x) + floor) % 2 ? accent : glow);
          }
          addBox(group, [12.5, 0.13, 1.25], [0, -0.1 + floor * 2.35, -1.9], detailMetalMat);
          addRail(group, -6, 6, -0.18 + floor * 2.35, -1.2, detailMetalMat);
        }
        for (let x = -4.8; x <= 4.8; x += 2.4) {
          addBox(group, [1.8, 1.1, 1.4], [x, -1.85, 1.8], detailDarkMat);
          addBox(group, [2.05, 0.08, 1.7], [x, -1.2, 1.8], accent);
        }
        addBox(group, [12.4, 0.12, 0.15], [0, 1.9, 1.8], accent);
      } else if (zone.scene === "farm") {
        const plantMat = new THREE.MeshStandardMaterial({ color: 0x78965f, roughness: 0.82, emissive: 0x243719, emissiveIntensity: 0.42 });
        for (let x = -5.35; x <= 2.5; x += 1.3) {
          addBox(group, [0.78, 0.28, 7.4], [x, -2.12, 0], detailDarkMat);
          for (let z = -3; z <= 3; z += 0.75) {
            const plant = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22 + seeded(Math.round((x + 6) * 10 + z * 4)) * 0.12, 1), plantMat);
            plant.position.set(x, -1.78, z);
            group.add(plant);
          }
          addBox(group, [0.72, 0.045, 7.1], [x, 1.95, 0], glow);
        }
        for (let x = -4.8; x <= 4.8; x += 2.4) addTube(group, [[x, 2.45, -4], [x, 2.45, 4], [x, -1.9, 4]], 0.06, accent);
        addBox(group, [3.1, 1.2, 6.6], [4.45, -1.75, 0.15], detailConcreteMat);
        for (let z = -2.6; z <= 2.8; z += 0.68) addBox(group, [3.05, 0.07, 0.07], [4.45, -1.05, z], detailMetalMat);
        for (let x = 3; x <= 5.9; x += 0.75) addBox(group, [0.06, 1.4, 0.06], [x, -1.45, -3.12], detailMetalMat);
        addCylinder(group, 0.62, 2.25, [5.45, -1.3, 3.35], detailMetalMat);
      } else if (zone.scene === "industrial") {
        addBox(group, [11.5, 0.3, 1.6], [0, -1.6, 0], detailMetalMat);
        for (let x = -5; x <= 5; x += 1) {
          const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 1.5, 12), accent);
          roller.rotation.x = Math.PI / 2;
          roller.position.set(x, -1.35, 0);
          group.add(roller);
        }
        for (let i = 0; i < 14; i += 1) addBox(group, [0.9, 0.9, 0.9], [-5 + (i % 7) * 1.5, -0.7 + Math.floor(i / 7), -3.5], i % 3 === 0 ? accent : detailWallMat);
        for (const x of [-4.7, 0, 4.7]) {
          addBox(group, [1.35, 2.7, 1.25], [x, -1.15, 2.65], detailDarkMat);
          addCylinder(group, 0.42, 1.4, [x, -0.42, 2.65], accent, [0, 0, Math.PI / 2]);
          addConsole(group, [x, -1.15, 1.82], accent, 1.15);
        }
        addBox(group, [12.2, 0.2, 0.2], [0, 2.25, 2.8], detailMetalMat);
        addCylinder(group, 0.11, 2.2, [2.25, 1.2, 2.8], detailMetalMat);
        const hook = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.08, 8, 18, Math.PI * 1.45), accent);
        hook.position.set(2.25, 0.1, 2.8);
        group.add(hook);
      } else if (zone.scene === "mechanical") {
        const turbine = addDetailTurbine(group, 0xc0583c, 1.18);
        turbine.position.set(0, -0.55, -0.65);
        for (const x of [-5.8, 5.8]) {
          addBox(group, [0.35, 5.4, 0.35], [x, 0, -3.6], accent);
          addTube(group, [[x, 2.35, -3.6], [x, 2.35, 2.8], [x * 0.7, -1.5, 3.5]], 0.16, detailMetalMat);
        }
        const bladeDisc = new THREE.Group();
        for (let i = 0; i < 10; i += 1) {
          const blade = addBox(bladeDisc, [0.32, 1.85, 0.12], [0, 0.92, 0], accent, (i / 10) * TAU);
          blade.rotation.z = (i / 10) * TAU;
        }
        bladeDisc.position.set(3.55, -0.55, -0.65);
        bladeDisc.rotation.y = Math.PI / 2;
        group.add(bladeDisc);
        addBox(group, [12.2, 0.18, 1.1], [0, 1.65, 2.85], detailMetalMat);
        addRail(group, -6, 6, 1.58, 3.3, accent);
        addConsole(group, [-4.7, -1.15, 2.1], accent, 2.25);
        addConsole(group, [4.7, -1.15, 2.1], accent, 2.25);
        for (let x = -3.6; x <= 3.6; x += 1.8) addCylinder(group, 0.42, 2.1, [x, 1.65, -3.9], detailMetalMat, [0, 0, Math.PI / 2]);
      } else if (zone.scene === "digger") {
        const drillMachine = addDetailTurbine(group, 0xb85e3d, 1.32);
        drillMachine.position.set(-0.8, -0.45, -0.45);
        const drillHead = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 2.35, 1.8, 18), accent);
        drillHead.rotation.z = -Math.PI / 2;
        drillHead.position.set(4.05, -0.45, -0.45);
        group.add(drillHead);
        for (let i = 0; i < 12; i += 1) {
          const tooth = addBox(group, [0.18, 0.42, 0.92], [5.02, -0.45 + Math.sin((i / 12) * TAU) * 2, -0.45 + Math.cos((i / 12) * TAU) * 2], detailMetalMat);
          tooth.rotation.x = (i / 12) * TAU;
        }
        addBox(group, [12, 0.16, 1], [0, 1.5, 3.3], detailMetalMat);
        addRail(group, -5.8, 5.8, 1.42, 3.75, accent);
        addBox(group, [3.1, 0.28, 1.2], [-4.45, -1.92, 2.2], detailDarkMat);
        addBox(group, [1.65, 0.2, 0.8], [-4.45, -1.55, 2.2], new THREE.MeshStandardMaterial({ color: 0x6f563d, roughness: 0.94 }));
        addConsole(group, [-4.3, -1.15, 0.9], accent, 2.1);
        for (let i = 0; i < 5; i += 1) addBox(group, [0.65, 0.65, 0.65], [-5.4 + (i % 2) * 0.72, -2 + Math.floor(i / 2) * 0.68, -2.8], i % 2 ? detailMetalMat : detailDarkMat);
        addCylinder(group, 0.035, 4.5, [5.5, -0.1, 3.65], new THREE.MeshStandardMaterial({ color: 0x8d7047, roughness: 1 }));
      } else if (zone.scene === "gap") {
        const basin = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.18, 9), new THREE.MeshPhysicalMaterial({ color: 0x35616a, transparent: true, opacity: 0.7, roughness: 0.12 }));
        basin.position.y = -2.35;
        group.add(basin);
        addBox(group, [12, 0.16, 1.15], [0, -2.15, 2.7], detailConcreteMat);
        for (let i = 0; i < 4; i += 1) {
          const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 2.2, 18), accent);
          pump.position.set(-4.5 + i * 3, -1.25, -3.5);
          group.add(pump);
          addTube(group, [[-4.5 + i * 3, -0.15, -3.5], [-4.5 + i * 3, 1.1, -3.5], [-5.8 + i * 3.8, 1.1, -4.4]], 0.11, detailMetalMat);
        }
        addCylinder(group, 0.04, 5.2, [-5.6, 0.1, 3.7], new THREE.MeshStandardMaterial({ color: 0x8d7047, roughness: 1 }));
        for (let z = 2.4; z >= -2.4; z -= 0.72) addBox(group, [0.9, 0.06, 0.36], [0.2, -2.15, z], accent);
        addBox(group, [1.4, 4.2, 0.12], [5.9, -0.15, -4.4], detailMetalMat);
        for (let y = -1.8; y <= 1.6; y += 0.55) addBox(group, [0.65, 0.045, 0.05], [5.9, y, -4.3], glow);
      } else if (zone.scene === "tunnel") {
        const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 11, 36, 1, true), new THREE.MeshStandardMaterial({ color: 0x41443e, side: THREE.BackSide, roughness: 0.9 }));
        tunnel.rotation.x = Math.PI / 2;
        tunnel.position.z = 0.3;
        group.add(tunnel);
        for (let z = -3.8; z <= 4.5; z += 1.35) {
          const brace = new THREE.Mesh(new THREE.TorusGeometry(3.42, 0.08, 8, 36), detailMetalMat);
          brace.position.z = z;
          group.add(brace);
        }
        const smartDoor = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.25, 0.4, 48), detailMetalMat);
        smartDoor.rotation.x = Math.PI / 2;
        smartDoor.position.z = -4.4;
        group.add(smartDoor);
        const smartRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.17, 10, 48), accent);
        smartRing.position.z = -4.63;
        group.add(smartRing);
        for (let i = 0; i < 8; i += 1) {
          const angle = (i / 8) * TAU;
          const spoke = addBox(group, [0.12, 2.2, 0.1], [Math.sin(angle) * 1.08, Math.cos(angle) * 1.08, -4.65], accent);
          spoke.rotation.z = -angle;
        }
        addCylinder(group, 0.34, 0.32, [0, 0, -4.72], glow, [Math.PI / 2, 0, 0]);
        const dataMat = new THREE.MeshStandardMaterial({ color: 0x52767b, emissive: 0x173b40, emissiveIntensity: 0.45, roughness: 0.48, metalness: 0.72 });
        addTube(group, [[-2.65, -2.15, 4.8], [-2.65, -2.15, -4.25], [-1.8, -1.55, -4.4]], 0.08, dataMat);
        for (let z = -3.4; z <= 4.2; z += 1.9) addBox(group, [0.55, 0.08, 0.2], [0, 2.65, z], glow);
        addConsole(group, [2.3, -1.55, -3.7], accent, 1.25, -0.15);
      } else if (zone.scene === "mine") {
        for (let z = -3.5; z <= 3.5; z += 1.75) {
          addBox(group, [11.5, 0.12, 0.12], [0, -2.2, z], detailMetalMat);
          addBox(group, [0.18, 5.2, 0.18], [-5.5, -0.1, z], mineMat);
          addBox(group, [0.18, 5.2, 0.18], [5.5, -0.1, z], mineMat);
          addBox(group, [11.2, 0.22, 0.22], [0, 2.35, z], mineMat);
        }
        for (const x of [-0.65, 0.65]) addBox(group, [0.12, 0.08, 9], [x, -2.02, 0], accent);
        addBox(group, [2.1, 1.2, 2.4], [2.4, -1.35, -0.5], detailMetalMat);
        for (let i = 0; i < 7; i += 1) {
          const ore = new THREE.Mesh(new THREE.DodecahedronGeometry(0.38 + seeded(i + 85) * 0.3, 0), mineMat);
          ore.position.set(-4.7 + (i % 3) * 0.72, -1.95 + Math.floor(i / 3) * 0.38, -2.8 + seeded(i + 4) * 1.2);
          group.add(ore);
        }
        for (const x of [3.75, 5.55]) for (const z of [1.8, 3.5]) addBox(group, [0.08, 4.1, 0.08], [x, -0.42, z], detailMetalMat);
        for (let y = -2.25; y <= 1.6; y += 0.55) addBox(group, [1.85, 0.07, 0.07], [4.65, y, 1.8], detailMetalMat);
        addCylinder(group, 0.42, 10.5, [-4.9, 1.85, 0], detailMetalMat, [0, 0, Math.PI / 2]);
        for (let z = -3.2; z <= 3.2; z += 1.6) addBox(group, [0.5, 0.06, 0.18], [0, 2.2, z], glow);
      }
      detailGroups.set(zone.id, group);
      detailRoot.add(group);
    });

    // Network mode: series count (18 + fifty others) with book routes marked separately.
    const networkRoot = new THREE.Group();
    networkRoot.visible = false;
    scene.add(networkRoot);
    const networkFloor = new THREE.Mesh(new THREE.PlaneGeometry(34, 25, 16, 12), new THREE.MeshBasicMaterial({ color: 0x282923, wireframe: true, transparent: true, opacity: 0.22 }));
    networkFloor.rotation.x = -Math.PI / 2;
    networkFloor.position.y = -1.7;
    networkRoot.add(networkFloor);
    const siloPositions: THREE.Vector3[] = [];
    for (let i = 0; i < 51; i += 1) {
      const row = Math.floor(i / 9);
      const col = i % 9;
      const position = new THREE.Vector3((col - 4) * 3.05, 0, (row - 2.5) * 3.45);
      siloPositions.push(position);
      const is18 = i === 17;
      const is17 = i === 16;
      const is1 = i === 0;
      const color = is18 ? 0xd8a65f : is17 ? 0x6ea6a9 : is1 ? 0xb6b9ad : 0x484b46;
      const node = new THREE.Group();
      const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.72, is18 ? 3.4 : 2.8, 20), new THREE.MeshStandardMaterial({ color, roughness: 0.68, metalness: 0.35, emissive: color, emissiveIntensity: is18 || is17 ? 0.28 : 0.02 }));
      node.add(cylinder);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.74, 0.06, 6, 24), new THREE.MeshBasicMaterial({ color }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = (is18 ? 3.4 : 2.8) / 2;
      node.add(ring);
      node.position.copy(position);
      networkRoot.add(node);
    }
    const routeMaterial = new THREE.LineBasicMaterial({ color: 0xd69a5d, transparent: true, opacity: 0.9 });
    const confirmedRoute = new THREE.BufferGeometry().setFromPoints([siloPositions[17].clone().setY(-1.2), siloPositions[16].clone().setY(-1.2)]);
    networkRoot.add(new THREE.Line(confirmedRoute, routeMaterial));
    const seedPosition = new THREE.Vector3(16, 0, 0);
    const seed = new THREE.Mesh(new THREE.OctahedronGeometry(1.15, 1), new THREE.MeshStandardMaterial({ color: 0x94a873, emissive: 0x31451f, emissiveIntensity: 0.65, roughness: 0.58 }));
    seed.position.copy(seedPosition);
    networkRoot.add(seed);
    const seedRoute = new THREE.BufferGeometry().setFromPoints([siloPositions[17].clone().setY(-1.25), seedPosition.clone().setY(-1.25)]);
    const seedLine = new THREE.Line(
      seedRoute,
      new THREE.LineDashedMaterial({ color: 0x91a66e, dashSize: 0.45, gapSize: 0.28, transparent: true, opacity: 0.7 }),
    );
    seedLine.computeLineDistances();
    networkRoot.add(seedLine);

    const dustPositions = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i += 1) {
      const radius = 2 + seeded(i + 40) * 16;
      const angle = seeded(i + 500) * TAU;
      dustPositions[i * 3] = Math.sin(angle) * radius;
      dustPositions[i * 3 + 1] = -20 + seeded(i + 1200) * 42;
      dustPositions[i * 3 + 2] = Math.cos(angle) * radius;
    }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xd6bf91, size: 0.045, transparent: true, opacity: 0.42, depthWrite: false }),
    );
    scene.add(dust);
    visualRef.current = { cutShell: shellCut, fullShell, utility, population, floorMaterials };

    const target = new THREE.Vector3(0, -5, 0);
    const cameraState = {
      yaw: 0.02,
      pitch: 0.03,
      distance: 64,
      targetYaw: 0.02,
      targetPitch: 0.03,
      targetDistance: 64,
      targetX: 0,
      targetY: -5,
      targetZ: 0,
    };
    focusRef.current = (zone: Zone) => {
      cameraState.targetY = zoneViewY(zone);
      cameraState.targetX = 0;
      cameraState.targetZ = zone.id === "tunnel" ? -17 : zone.group === "below" ? -3.5 : 0;
      cameraState.targetDistance = zone.group === "below" ? 34 : zone.id === "mechanical" || zone.id === "it" ? 31 : 35;
      cameraState.targetYaw = 0.02;
      cameraState.targetPitch = 0.01;
    };
    sceneModeRef.current = (mode, zone) => {
      world.visible = mode === "overview";
      detailRoot.visible = mode === "section";
      networkRoot.visible = mode === "network";
      detailGroups.forEach((group, id) => { group.visible = mode === "section" && id === zone.id; });
      cameraState.targetX = 0;
      cameraState.targetZ = 0;
      cameraState.targetY = 0;
      if (mode === "section") {
        cameraState.targetDistance = zone.scene === "tunnel" ? 13.5 : 17.5;
        cameraState.targetYaw = zone.scene === "mine" ? 0.28 : 0.06;
        cameraState.targetPitch = 0.08;
      } else if (mode === "network") {
        cameraState.targetDistance = 34;
        cameraState.targetYaw = -0.38;
        cameraState.targetPitch = 0.42;
      } else {
        cameraState.targetX = 0;
        cameraState.targetY = -5;
        cameraState.targetZ = 0;
        cameraState.targetDistance = 64;
        cameraState.targetYaw = 0.02;
        cameraState.targetPitch = 0.03;
      }
    };
    resetRef.current = () => {
      cameraState.targetX = 0;
      cameraState.targetY = -5;
      cameraState.targetZ = 0;
      cameraState.targetDistance = 64;
      cameraState.targetYaw = 0.02;
      cameraState.targetPitch = 0.03;
    };

    let dragging = false;
    let pointerX = 0;
    let pointerY = 0;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      renderer.domElement.setPointerCapture(event.pointerId);
      setAutoRotate(false);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      cameraState.targetYaw -= (event.clientX - pointerX) * 0.005;
      cameraState.targetPitch = THREE.MathUtils.clamp(cameraState.targetPitch + (event.clientY - pointerY) * 0.003, -0.48, 0.48);
      pointerX = event.clientX;
      pointerY = event.clientY;
    };
    const onPointerUp = () => { dragging = false; };
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      cameraState.targetDistance = THREE.MathUtils.clamp(cameraState.targetDistance + event.deltaY * 0.025, 23, 62);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const clock = new THREE.Clock();
    let frame = 0;
    let animationFrame = 0;
    let rendererHealthy = false;
    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      if (autoRotateRef.current && !dragging) cameraState.targetYaw += delta * 0.055;
      cameraState.yaw = THREE.MathUtils.lerp(cameraState.yaw, cameraState.targetYaw, 0.055);
      cameraState.pitch = THREE.MathUtils.lerp(cameraState.pitch, cameraState.targetPitch, 0.055);
      cameraState.distance = THREE.MathUtils.lerp(cameraState.distance, cameraState.targetDistance, 0.045);
      target.x = THREE.MathUtils.lerp(target.x, cameraState.targetX, 0.045);
      target.y = THREE.MathUtils.lerp(target.y, cameraState.targetY, 0.045);
      target.z = THREE.MathUtils.lerp(target.z, cameraState.targetZ, 0.045);
      camera.position.set(
        Math.sin(cameraState.yaw) * Math.cos(cameraState.pitch) * cameraState.distance,
        target.y + Math.sin(cameraState.pitch) * cameraState.distance,
        Math.cos(cameraState.yaw) * Math.cos(cameraState.pitch) * cameraState.distance,
      );
      camera.lookAt(target);
      dust.rotation.y += delta * 0.012;
      generator.rotation.x += delta * 0.18;
      frame += 1;
      if (frame % 2 === 0) {
        ZONES.forEach((zone) => {
          const element = hotspotRefs.current[zone.id];
          if (!element) return;
          if (zone.group === "network") return;
          const position = new THREE.Vector3(0.5, zoneViewY(zone), zone.group === "below" ? 4 : 7.2).project(camera);
          const visible = position.z < 1 && Math.abs(position.x) < 1.05 && Math.abs(position.y) < 1.1;
          element.style.transform = `translate3d(${(position.x * 0.5 + 0.5) * mount.clientWidth}px, ${(-position.y * 0.5 + 0.5) * mount.clientHeight}px, 0)`;
          element.style.opacity = visible ? "1" : "0";
          element.style.pointerEvents = visible ? "auto" : "none";
        });
      }
      try {
        renderer.render(scene, camera);
        if (!rendererHealthy) {
          rendererHealthy = true;
          setWebglUnavailable(false);
        }
      } catch {
        setWebglUnavailable(true);
        return;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
      renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      renderer.domElement.removeEventListener("pointercancel", onPointerUp);
      renderer.domElement.removeEventListener("wheel", onWheel);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      screenTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      visualRef.current = {};
    };
  }, []);

  const chooseZone = (zone: Zone) => {
    setSelected(zone);
    if (zone.scene === "network") {
      setViewMode("network");
      sceneModeRef.current("network", zone);
    } else if (viewMode === "section") {
      sceneModeRef.current("section", zone);
    } else {
      setViewMode("overview");
      sceneModeRef.current("overview", zone);
      window.setTimeout(() => focusRef.current(zone), 30);
    }
    setMobilePanel(true);
  };

  const showOverview = () => {
    setViewMode("overview");
    sceneModeRef.current("overview", selected);
  };

  const showSection = () => {
    if (selected.scene === "network") {
      setViewMode("network");
      sceneModeRef.current("network", selected);
      return;
    }
    setViewMode("section");
    sceneModeRef.current("section", selected);
  };

  const showNetwork = () => {
    const networkZone = ZONES.find((zone) => zone.scene === "network") ?? selected;
    setSelected(networkZone);
    setSectorTab("network");
    setViewMode("network");
    sceneModeRef.current("network", networkZone);
  };

  const visibleZones = ZONES.filter((zone) => zone.group === sectorTab);

  return (
    <main className="silo-app" data-theme={theme}>
      <header className="topbar">
        <div className="brand-lockup"><SiloMark /><div><span className="eyebrow">THE LAST CITY</span><strong>SILO</strong></div></div>
        <div className="archive-title"><span>STRUCTURAL ARCHIVE</span><b>18 / INTERNAL</b></div>
        <div className="topbar__right">
          <span className="system-status"><i /> SYSTEM NOMINAL</span>
          <button className="icon-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => setHelp(true)} aria-label="Open controls help"><CircleHelp size={18} /></button>
        </div>
      </header>

      <aside className="level-index" aria-label="Silo sectors">
        <div className="level-index__head"><span>ARCHIVE</span><b>{sectorTab === "internal" ? "144 LVLS" : sectorTab === "below" ? "SUB-FOUNDATION" : "OP. FIFTY"}</b></div>
        <div className="sector-tabs" role="tablist" aria-label="Archive layer">
          <button className={sectorTab === "internal" ? "active" : ""} onClick={() => setSectorTab("internal")} role="tab">INSIDE</button>
          <button className={sectorTab === "below" ? "active" : ""} onClick={() => setSectorTab("below")} role="tab">BELOW</button>
          <button className={sectorTab === "network" ? "active" : ""} onClick={() => { setSectorTab("network"); showNetwork(); }} role="tab">GRID</button>
        </div>
        <div className="level-list">
          {visibleZones.map((zone, index) => (
            <button key={zone.id} className={`level-button ${selected.id === zone.id ? "level-button--active" : ""}`} onClick={() => chooseZone(zone)} style={{ "--zone": zone.color } as React.CSSProperties}>
              <span className="level-button__number">{String(index + 1).padStart(2, "0")}</span>
              <span><b>{zone.name}</b><small>{zone.levels}</small></span><ChevronRight size={14} />
            </button>
          ))}
        </div>
        <div className="canon-key">
          <span><i className="canon-series" /> SERIES</span><span><i className="canon-books" /> BOOKS</span><span><i className="canon-reconstruction" /> RECONSTRUCTION</span>
        </div>
        <div className="depth-readout"><span>{sectorTab === "network" ? "KNOWN FIELD" : "EST. VERTICAL REACH"}</span><strong>{sectorTab === "network" ? "51" : ">1,440"}<small>{sectorTab === "network" ? " silos" : " m"}</small></strong><div className="depth-scale"><i /></div><small>{sectorTab === "network" ? "18 / 17 / 1 / SEED" : "BEDROCK / CONTROLLED VOID"}</small></div>
      </aside>

      <section className="viewer-shell" aria-label="Silo 18 3D viewer">
        <div ref={mountRef} className="three-stage" />
        {webglUnavailable && viewMode === "overview" && (
          <div className="fallback-silo" aria-label="Silo 18 structural cutaway fallback">
            <div className="fallback-silo__cap" />
            <div className="fallback-silo__body">
              <div className="fallback-silo__floors">
                {Array.from({ length: 72 }, (_, index) => <i key={index} />)}
              </div>
              <div className="fallback-silo__core" />
              <div className="fallback-silo__stair" />
              <div className="fallback-silo__screen" />
              <div className="fallback-silo__generator"><i /><i /><i /></div>
            </div>
            <div className="fallback-silo__underworld">
              <div className="fallback-silo__water" />
              <div className="fallback-silo__drill"><i /><i /><i /></div>
              <div className="fallback-silo__deep-door" />
              <div className="fallback-silo__mine-shaft" />
            </div>
            <div className="fallback-silo__base" />
          </div>
        )}
        {webglUnavailable && viewMode === "section" && (
          <div className={`fallback-section fallback-section--${selected.scene}`} style={{ "--zone": selected.color } as React.CSSProperties}>
            <div className="fallback-section__roof" />
            <div className="fallback-section__room">
              <div className="fallback-section__backwall" />
              <div className="fallback-section__feature">
                {selected.scene === "mine" ? <Pickaxe size={58} /> : selected.scene === "tunnel" ? <DoorOpen size={58} /> : selected.scene === "gap" ? <Waves size={58} /> : selected.scene === "digger" ? <Drill size={58} /> : selected.scene === "it" ? <Database size={58} /> : selected.scene === "mechanical" ? <Gauge size={58} /> : selected.scene === "farm" ? <Activity size={58} /> : <Layers3 size={58} />}
              </div>
              <div className="fallback-section__rails"><i /><i /><i /><i /><i /></div>
              <div className="fallback-section__stations">
                {selected.details.slice(0, 4).map((detail, index) => <span key={detail.name}><i>{String(index + 1).padStart(2, "0")}</i>{detail.name}</span>)}
              </div>
            </div>
            <div className="fallback-section__caption"><span>3D SECTION</span><b>{selected.name}</b><small>{selected.code} / {selected.canon}</small></div>
          </div>
        )}
        {webglUnavailable && viewMode === "network" && (
          <div className="fallback-network" aria-label="Conceptual network of 51 silos">
            <div className="fallback-network__grid">
              {Array.from({ length: 51 }, (_, index) => <i key={index} className={index === 17 ? "silo-18" : index === 16 ? "silo-17" : index === 0 ? "silo-1" : ""}><span>{index + 1}</span></i>)}
            </div>
            <div className="fallback-network__route" />
            <div className="fallback-network__seed">SEED</div>
          </div>
        )}
        <div className="stage-vignette" /><div className="stage-grid" />
        <div className="model-label"><span>{viewMode === "overview" ? "ASSET" : viewMode === "section" ? "SECTION STUDY" : "OPERATION FIELD"}</span><b>{viewMode === "overview" ? "SILO 18 / EXTENDED CUTAWAY" : viewMode === "section" ? `${selected.code} / ${selected.name}` : "SILO GRID / SYNTHESIS"}</b><small>{viewMode === "overview" ? "144 LEVELS · SUB-FOUNDATION · SEALED" : viewMode === "section" ? `${selected.canon} EVIDENCE · INTERACTIVE DIORAMA` : "51 STRUCTURES · 18→17 · SEED ROUTE"}</small></div>
        {viewMode === "section" && (
          <div className="section-schematic" style={{ "--zone": selected.color } as React.CSSProperties}>
            <div><span>DETAILED CUTAWAY</span><b>{selected.era}</b></div>
            <ol>{selected.details.slice(0, 4).map((detail) => <li key={detail.name}>{detail.name}<i className={`detail-tag detail-tag--${detail.tag.toLowerCase().replace(" ", "-")}`}>{detail.tag}</i></li>)}</ol>
          </div>
        )}
        <div className="compass" aria-hidden="true"><span>N</span><i /><b>18</b></div>
        {!webglUnavailable && viewMode === "overview" && ZONES.filter((zone) => zone.group !== "network").map((zone) => (
          <button key={zone.id} ref={(node) => { hotspotRefs.current[zone.id] = node; }} className={`hotspot ${selected.id === zone.id ? "hotspot--active" : ""}`} style={{ "--zone": zone.color } as React.CSSProperties} onClick={() => chooseZone(zone)} aria-label={`Inspect ${zone.name}`}>
            <i /><span>{zone.name}</span>
          </button>
        ))}
        <div className="viewer-toolbar" aria-label="3D viewer controls">
          <button onClick={() => setAutoRotate((value) => !value)} title="Toggle auto rotation" aria-pressed={autoRotate}>{autoRotate ? <Pause size={17} /> : <Play size={17} />}</button>
          <button onClick={() => resetRef.current()} title="Reset view"><RotateCcw size={17} /></button><span />
          <button onClick={() => setCutaway((value) => !value)} className={cutaway ? "is-active" : ""} title="Toggle cutaway" aria-pressed={cutaway}>{cutaway ? <Eye size={17} /> : <EyeOff size={17} />}</button>
          <button onClick={() => setHelp(true)} title="Controls"><ZoomIn size={17} /></button>
        </div>
        <div className="view-switch" aria-label="Scene view">
          <button className={viewMode === "overview" ? "active" : ""} onClick={showOverview}><MapIcon size={14} /> OVERVIEW</button>
          <button className={viewMode === "section" ? "active" : ""} onClick={showSection}><Box size={14} /> SECTION</button>
          <button className={viewMode === "network" ? "active" : ""} onClick={showNetwork}><Network size={14} /> NETWORK</button>
        </div>
        <div className="mode-switch" aria-label="Visualization layer">
          <button className={mode === "structure" ? "active" : ""} onClick={() => setMode("structure")}><Box size={14} /> STRUCTURE</button>
          <button className={mode === "systems" ? "active" : ""} onClick={() => setMode("systems")}><Gauge size={14} /> SYSTEMS</button>
          <button className={mode === "life" ? "active" : ""} onClick={() => setMode("life")}><Aperture size={14} /> LIFE</button>
        </div>
      </section>

      <aside className={`intel-panel ${mobilePanel ? "intel-panel--mobile-open" : ""}`}>
        <button className="intel-panel__close" onClick={() => setMobilePanel(false)} aria-label="Close detail panel"><X size={18} /></button>
        <div className="intel-panel__stripe" style={{ background: selected.color }} />
        <div className="intel-panel__topline"><span>{selected.kicker}</span><b className={`clearance clearance--${selected.status.toLowerCase().replace(" ", "-")}`}>{selected.status}</b></div>
        <div className="zone-meta"><span className="zone-number">{selected.code}</span><b className={`canon-badge canon-badge--${selected.canon.toLowerCase()}`}>{selected.canon}</b><span className="zone-era">{selected.era}</span></div>
        <h1>{selected.name}</h1><p className="zone-levels">{selected.levels}</p><p className="zone-copy">{selected.description}</p>
        <div className="section-actions">
          {viewMode !== "overview" && <button className="section-actions__back" onClick={showOverview}><ArrowLeft size={15} /> FULL SILO</button>}
          <button className="section-actions__primary" onClick={selected.scene === "network" ? showNetwork : showSection}>{selected.scene === "network" ? <Network size={15} /> : <Box size={15} />}{selected.scene === "network" ? "OPEN NETWORK" : "OPEN 3D SECTION"}</button>
        </div>
        <div className="intel-rule" /><span className="section-label">FACILITIES / SET ANCHORS</span>
        <ul className="installation-list">{selected.details.map((detail, index) => <li key={detail.name}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{detail.name}</b><small>{detail.note}</small></div><i className={`detail-tag detail-tag--${detail.tag.toLowerCase().replace(" ", "-")}`}>{detail.tag}</i></li>)}</ul>
        <span className="section-label section-label--people">ASSOCIATED PERSONNEL</span>
        <div className="people-strip">{selected.people.map((person) => <span key={person}>{person}</span>)}</div>
        <div className="system-card">
          {selected.telemetry.map((item, index) => <div key={item.label}>{index === 0 ? <Wind size={16} /> : index === 1 ? <Gauge size={16} /> : <ShieldAlert size={16} />}<span>{item.label}</span><b>{item.value}</b></div>)}
        </div>
        <div className="intel-note"><BookOpen size={16} /><p><b>EVIDENCE LEDGER</b>{selected.evidence}</p></div>
        {selected.group === "below" && <div className="route-note"><Route size={15} /><span>SUB-FOUNDATION ROUTING SHOWN AT INFERRED SCALE</span></div>}
      </aside>

      <footer className="statusbar"><span><i className="status-dot" /> LIVE MODEL</span><span>DRAG TO ORBIT</span><span>SCROLL TO ZOOM</span><span className="statusbar__right">PACT ARCHIVE / ACCESS 02</span></footer>
      {help && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setHelp(false)}>
          <div className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="help-modal__close" onClick={() => setHelp(false)} aria-label="Close"><X size={19} /></button>
            <Layers3 size={24} /><span className="eyebrow">ARCHIVE INTERFACE / SPOILERS</span><h2 id="help-title">Explore the city—and what lies beneath it</h2>
            <div className="help-grid"><div><b>OVERVIEW</b><span>144 levels plus the buried undercroft</span></div><div><b>SECTION</b><span>Enter a purpose-built 3D diorama</span></div><div><b>BELOW</b><span>Digger, water, Algorithm door and mines</span></div><div><b>UTILITY</b><span>I.T. power and Judicial Safeguard are separate lines</span></div><div><b>SERIES</b><span>Directly established on screen</span></div><div><b>BOOKS / RECONSTRUCTION</b><span>Clearly labeled alternate or inferred lore</span></div></div>
            <button className="primary-button" onClick={() => setHelp(false)}>ENTER ARCHIVE <ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </main>
  );
}
