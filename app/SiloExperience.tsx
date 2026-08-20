"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  BookOpen,
  Box,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  DoorOpen,
  Drill,
  Eye,
  EyeOff,
  ExternalLink,
  Gauge,
  Layers3,
  Languages,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Moon,
  Network,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Pause,
  Pickaxe,
  Play,
  RotateCcw,
  Route,
  Search,
  Share2,
  ShieldAlert,
  Sun,
  Trees,
  Waves,
  Wind,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import * as THREE from "three";
import { makeArchiveHash, parseArchiveHash } from "./archive-url.mjs";

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

type SceneKind =
  | "surface"
  | "cafeteria"
  | "airlock"
  | "civic"
  | "judicial"
  | "it"
  | "medical"
  | "residential"
  | "farm"
  | "utilities"
  | "industrial"
  | "mechanical"
  | "digger"
  | "gap"
  | "tunnel"
  | "mine"
  | "network";

type Zone = {
  id: string;
  name: string;
  kicker: string;
  levels: string;
  level: number;
  code: string;
  group: "internal" | "below" | "network";
  canon: "SERIES" | "BOOKS" | "RECONSTRUCTION";
  scene: SceneKind;
  color: string;
  description: string;
  details: Facility[];
  people: string[];
  telemetry: [Telemetry, Telemetry, Telemetry];
  era: string;
  evidence: string;
  status: string;
};

type SourceReference = {
  label: string;
  coverage: string;
  kind: "SERIES" | "BOOKS" | "PRODUCTION";
  url: string;
};

type Journey = {
  id: string;
  name: string;
  subtitle: string;
  zones: string[];
};

const ARCHIVE_UPDATED = "20 AUG 2026";
const SERIES_COVERAGE = "SERIES THROUGH S3E7";
const APPLE_SERIES_URL = "https://www.apple.com/tv-pr/originals/silo/";
const APPLE_EPISODES_URL = "https://www.apple.com/tv-pr/originals/silo/episodes-images/";
const APPLE_SEASON_THREE_URL = "https://www.apple.com/tv-pr/news/2026/04/apples-globally-acclaimed-drama-silo-starring-and-executive-produced-by-rebecca-ferguson-returns-for-season-three-on-july-3-2026/";
const HOWEY_WOOL_URL = "https://hughhowey.com/books/wool/";
const LUX_SILO_URL = "https://www.luxmc.com/silo";

const ZONES: Zone[] = [
  {
    id: "surface",
    name: "SURFACE & SENSOR FIELD",
    kicker: "The world above",
    levels: "Exterior · beyond the outer hatch",
    level: 0,
    code: "EXT-18",
    group: "internal",
    canon: "SERIES",
    scene: "surface",
    color: "#9aa58e",
    description:
      "The buried rim of Silo 18 opens behind an earthen berm. A short cleaning path leads to the exterior sensor while the apparently empty landscape conceals a wider field of silo crowns.",
    details: [
      { name: "Buried silo crown", note: "Only the armored hatch, ramp and sensor assembly break the surface above the cylinder.", tag: "ON SCREEN" },
      { name: "Outer hatch ramp", note: "The cleaner emerges behind the berm and climbs into the sensor field.", tag: "ON SCREEN" },
      { name: "Exterior sensor mast", note: "A protected lens supplies the public cafeteria image and is cleaned with wool.", tag: "ON SCREEN" },
      { name: "Cleaning path", note: "A short exposed route passes the remains of prior cleaners before reaching the lens.", tag: "ON SCREEN" },
      { name: "Berm and false horizon", note: "The local ridge blocks nearby silo crowns until a cleaner crosses it.", tag: "ON SCREEN" },
      { name: "Distant silo rims", note: "Neighboring circular crowns occupy the same devastated field beyond Silo 18.", tag: "ON SCREEN" },
      { name: "Toxic exclusion zone", note: "The archive visualizes an uninhabitable exterior without claiming a precise toxin mechanism.", tag: "INFERRED" },
    ],
    people: ["Allison Becker", "Holston Becker", "Juliette Nichols", "Silo 18 cleaners"],
    telemetry: [{ label: "AIR", value: "LETHAL" }, { label: "SENSOR", value: "ONLINE" }, { label: "ACCESS", value: "ONE WAY" }],
    era: "SEASONS 1—3",
    evidence: "The hatch, berm, sensor, cleaners and neighboring silo field are shown on screen. Distances and topography in this model are reconstructed from the available views.",
    status: "EXTERIOR",
  },
  {
    id: "cleaning-facility",
    name: "CLEANING FACILITY",
    kicker: "One-way surface threshold",
    levels: "Uppermost structure · exact level undisclosed",
    level: 1,
    code: "UP-CL",
    group: "internal",
    canon: "SERIES",
    scene: "airlock",
    color: "#c66b4e",
    description:
      "The controlled route from custody to the surface: a cleaner is prepared and sealed inside, the inner hatch closes, the airlock cycles, and the outer hatch opens onto the sensor ramp.",
    details: [
      { name: "Final holding room", note: "The last controlled room before a condemned or voluntary cleaner enters suit preparation.", tag: "INFERRED" },
      { name: "Suit preparation bay", note: "Technicians fit the white cleaning suit, oxygen pack, gloves, boots and hood.", tag: "ON SCREEN" },
      { name: "Heat-tape sealing station", note: "Tape closes the vulnerable wrist, ankle and hood interfaces before the cycle begins.", tag: "ON SCREEN" },
      { name: "Inner pressure hatch", note: "A heavy circular door isolates the silo before the cleaner enters the purge chamber.", tag: "ON SCREEN" },
      { name: "Airlock / fire purge", note: "The sealed chamber cycles and is burned clean after the outer route has been used.", tag: "ON SCREEN" },
      { name: "Outer hatch & ramp", note: "The one-way surface exit opens behind the berm and leads toward the sensor mast.", tag: "ON SCREEN" },
      { name: "Exterior sensor", note: "The lens assembly supplies the cafeteria feed; wool carried by the cleaner is used on its cover.", tag: "ON SCREEN" },
    ],
    people: ["Allison Becker", "Holston Becker", "Juliette Nichols", "Bernard Holland", "Cleaning technicians"],
    telemetry: [{ label: "INNER HATCH", value: "SEALED" }, { label: "PURGE", value: "ARMED" }, { label: "ROUTE", value: "ONE WAY" }],
    era: "SEASONS 1—2",
    evidence: "Every major station in this route is established across the series' cleaning sequences. The show does not publish a numbered level for the facility, so its position at the top of this model is spatial—not a claimed canon level.",
    status: "ONE WAY",
  },
  {
    id: "cafeteria",
    name: "CAFETERIA & SENSOR GALLERY",
    kicker: "The silo's public window",
    levels: "Up Top · exact level undisclosed",
    level: 4,
    code: "UP-CF",
    group: "internal",
    canon: "SERIES",
    scene: "cafeteria",
    color: "#c9aa72",
    description:
      "A broad communal mess hall organized around the curved exterior-feed wall—the place residents eat beneath aging disc lights, gather for a cleaning, and read the outside world through a controlled, visibly weathered image.",
    details: [
      { name: "Curved exterior display wall", note: "The dominant wide LED surface carries the live feed from the sensor above the silo.", tag: "ON SCREEN" },
      { name: "Dust & damaged LED modules", note: "The production display accumulates dust and failed panels as the silo ages.", tag: "ON SCREEN" },
      { name: "Long communal tables", note: "Rows of hard-wearing tables and benches make the room both mess hall and assembly space.", tag: "ON SCREEN" },
      { name: "Disc ceiling luminaires", note: "Low, warm circular fixtures break up the heavy industrial ceiling above the dining floor.", tag: "ON SCREEN" },
      { name: "Cleaning observation floor", note: "Residents gather here as the outer hatch opens and the cleaner approaches the lens.", tag: "ON SCREEN" },
      { name: "Serving line & kitchen edge", note: "A practical food-service counter, trays and storage support the room's daily civic role.", tag: "INFERRED" },
      { name: "Sensor feed conduit", note: "A protected signal path links the exterior lens to the public display system.", tag: "INFERRED" },
      { name: "Upper landing & entries", note: "Controlled side entries spill residents from the main circulation route into the gallery.", tag: "INFERRED" },
    ],
    people: ["Holston Becker", "Allison Becker", "Juliette Nichols", "Mayor Jahns", "Silo 18 residents"],
    telemetry: [{ label: "DISPLAY", value: "CURVED LED" }, { label: "SOURCE", value: "EXT. SENSOR" }, { label: "ACCESS", value: "PUBLIC" }],
    era: "SEASONS 1—2",
    evidence: "The wide curved display, communal furniture, disc lighting and use of the room during cleanings are shown on screen and documented by the LED-wall production team. The service edge, signal conduit and exact numbered level remain reconstructed because the series withholds a complete upper-level plan.",
    status: "PUBLIC",
  },
  {
    id: "up-top",
    name: "UP TOP CIVIC",
    kicker: "Civic administration",
    levels: "Upper civic band · exact register partial",
    level: 10,
    code: "UP-CV",
    group: "internal",
    canon: "SERIES",
    scene: "civic",
    color: "#d7b26d",
    description:
      "The visible seat of local government: sheriff, mayor, deputy desks, public records and the controlled rooms where the Pact becomes daily life.",
    details: [
      { name: "Sheriff station", note: "Badge desk, clerical bay, interview room and holding cells.", tag: "ON SCREEN" },
      { name: "Mayor / deputy offices", note: "The civic chain of command clustered near the upper landings.", tag: "INFERRED" },
      { name: "Public service counter", note: "Permits, complaints and routine civic administration at a controlled desk line.", tag: "INFERRED" },
      { name: "Interview & holding", note: "Secure rooms attached to the sheriff's operational floor.", tag: "ON SCREEN" },
      { name: "Records & Pact notices", note: "Case records, public rulings and the text that governs daily life.", tag: "INFERRED" },
      { name: "Upper stair checkpoint", note: "A controlled landing able to channel crowds and raiders.", tag: "INFERRED" },
    ],
    people: ["Holston Becker", "Mayor Jahns", "Sam Marnes", "Juliette Nichols", "Paul Billings"],
    telemetry: [{ label: "SHERIFF", value: "ACTIVE" }, { label: "RECORDS", value: "CONTROLLED" }, { label: "ACCESS", value: "CIVIC" }],
    era: "SEASONS 1—2",
    evidence: "The sheriff's and mayoral functions are series canon. This archive separates them from the cafeteria and cleaning facility; their combined placement within one upper civic band remains a reconstruction.",
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
    id: "life-support",
    name: "LIFE SUPPORT",
    kicker: "Air, water and waste",
    levels: "Distributed utility band · modeled at Level 86",
    level: 86,
    code: "U-086",
    group: "internal",
    canon: "RECONSTRUCTION",
    scene: "utilities",
    color: "#74a3a0",
    description:
      "A systems reconstruction of the machinery a sealed city requires: air handling, water treatment, heat exchange, waste recovery and the vertical trunks that connect every inhabited level.",
    details: [
      { name: "Air-handling hall", note: "Filter banks, blowers and pressure dampers circulate breathable air through the vertical trunks.", tag: "INFERRED" },
      { name: "Water treatment gallery", note: "Settling tanks, pumps and polishing filters return counted water to the inhabited rings.", tag: "INFERRED" },
      { name: "Waste & recycling intake", note: "Organic waste and reusable material are separated before treatment or return to Supply.", tag: "INFERRED" },
      { name: "Heat-exchange deck", note: "Closed-loop exchangers reject heat from inhabited rooms, farms and machinery.", tag: "INFERRED" },
      { name: "Fire-water reservoir", note: "A protected emergency reserve feeds standpipes and compartment suppression.", tag: "INFERRED" },
      { name: "Vertical utility trunks", note: "Redundant pipe and duct risers branch into every major band of the silo.", tag: "ON SCREEN" },
      { name: "Maintenance control room", note: "Pressure, flow, contamination and reserve levels are monitored from a sealed console line.", tag: "INFERRED" },
    ],
    people: ["Maintenance crews", "Mechanical engineers", "Supply recyclers", "Farm technicians"],
    telemetry: [{ label: "AIR LOOP", value: "CLOSED" }, { label: "WATER", value: "RECYCLED" }, { label: "MODEL", value: "INFERRED" }],
    era: "SYSTEMS RECONSTRUCTION",
    evidence: "The series shows utility pipes, ducts, recycling and water infrastructure but has not published a complete life-support plant. This room is deliberately labeled as a functional reconstruction.",
    status: "ESSENTIAL",
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

const SERIES_SOURCE: SourceReference = {
  label: "Apple TV+ — Silo",
  coverage: SERIES_COVERAGE,
  kind: "SERIES",
  url: APPLE_SERIES_URL,
};

const EPISODE_SOURCE: SourceReference = {
  label: "Official episode & image guide",
  coverage: "S1—S3 episode index",
  kind: "SERIES",
  url: APPLE_EPISODES_URL,
};

const BOOK_SOURCE: SourceReference = {
  label: "Hugh Howey — Wool",
  coverage: "Book continuity",
  kind: "BOOKS",
  url: HOWEY_WOOL_URL,
};

const SEASON_THREE_SOURCE: SourceReference = {
  label: "Apple — Season 3 release note",
  coverage: "Premiered 03 JUL 2026",
  kind: "PRODUCTION",
  url: APPLE_SEASON_THREE_URL,
};

const CAFETERIA_PRODUCTION_SOURCE: SourceReference = {
  label: "Lux Machina — Silo LED wall",
  coverage: "Season 1 cafeteria production design",
  kind: "PRODUCTION",
  url: LUX_SILO_URL,
};

const ZONE_REFERENCES: Record<string, SourceReference[]> = {
  surface: [EPISODE_SOURCE, SERIES_SOURCE],
  "cleaning-facility": [EPISODE_SOURCE, SERIES_SOURCE],
  cafeteria: [EPISODE_SOURCE, CAFETERIA_PRODUCTION_SOURCE, SERIES_SOURCE],
  "up-top": [EPISODE_SOURCE, SERIES_SOURCE],
  judicial: [EPISODE_SOURCE, SEASON_THREE_SOURCE],
  it: [EPISODE_SOURCE, SEASON_THREE_SOURCE],
  medical: [EPISODE_SOURCE, SERIES_SOURCE],
  mids: [EPISODE_SOURCE, BOOK_SOURCE],
  farms: [EPISODE_SOURCE, BOOK_SOURCE],
  "life-support": [SERIES_SOURCE, BOOK_SOURCE],
  supply: [EPISODE_SOURCE, BOOK_SOURCE],
  mechanical: [EPISODE_SOURCE, SERIES_SOURCE],
  digger: [EPISODE_SOURCE, SERIES_SOURCE],
  gap: [EPISODE_SOURCE, SERIES_SOURCE],
  tunnel: [EPISODE_SOURCE, SEASON_THREE_SOURCE],
  mines: [SERIES_SOURCE, BOOK_SOURCE],
  network: [EPISODE_SOURCE, BOOK_SOURCE, SEASON_THREE_SOURCE],
};

const JOURNEYS: Journey[] = [
  {
    id: "cleaning-route",
    name: "THE CLEANING ROUTE",
    subtitle: "Cafeteria to the surface sensor",
    zones: ["cafeteria", "up-top", "cleaning-facility", "surface"],
  },
  {
    id: "juliette-descent",
    name: "JULIETTE'S DESCENT",
    subtitle: "From Up Top into the buried threshold",
    zones: ["up-top", "medical", "mechanical", "digger", "gap", "tunnel"],
  },
  {
    id: "george-lukas",
    name: "GEORGE → LUKAS",
    subtitle: "The hard drive, the Gap and the Algorithm door",
    zones: ["it", "digger", "gap", "tunnel"],
  },
  {
    id: "hidden-systems",
    name: "HIDDEN SYSTEMS",
    subtitle: "Safeguard, I.T. power and silo utilities",
    zones: ["judicial", "it", "life-support", "mechanical", "network"],
  },
];

const UI_COPY = {
  en: {
    archive: "ARCHIVE",
    inside: "INSIDE",
    below: "BELOW",
    grid: "GRID",
    search: "Search rooms, systems or people",
    noResults: "No archive sections match this search.",
    overview: "OVERVIEW",
    section: "SECTION",
    network: "NETWORK",
    structure: "STRUCTURE",
    systems: "SYSTEMS",
    life: "LIFE",
    fullSilo: "FULL SILO",
    openSection: "OPEN 3D SECTION",
    openNetwork: "OPEN NETWORK",
    overviewTab: "BRIEFING",
    facilitiesTab: "FACILITIES",
    sourcesTab: "SOURCES",
    personnel: "ASSOCIATED PERSONNEL",
    evidence: "EVIDENCE LEDGER",
    guided: "GUIDED ROUTES",
    share: "SHARE VIEW",
    copied: "LINK COPIED",
  },
  fa: {
    archive: "آرشیو",
    inside: "داخل سیلو",
    below: "زیر سازه",
    grid: "شبکه",
    search: "جست‌وجوی فضا، سیستم یا شخصیت",
    noResults: "بخشی با این جست‌وجو پیدا نشد.",
    overview: "نمای کلی",
    section: "نمای بخش",
    network: "شبکه",
    structure: "سازه",
    systems: "سیستم‌ها",
    life: "زندگی",
    fullSilo: "کل سیلو",
    openSection: "بازکردن نمای سه‌بعدی",
    openNetwork: "بازکردن شبکه",
    overviewTab: "خلاصه",
    facilitiesTab: "فضاها",
    sourcesTab: "منابع",
    personnel: "افراد مرتبط",
    evidence: "دفتر شواهد",
    guided: "مسیرهای راهنما",
    share: "اشتراک نما",
    copied: "پیوند کپی شد",
  },
} as const;

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

function readArchiveHash(): { zone: Zone; view: "overview" | "section" | "network" } | null {
  if (typeof window === "undefined") return null;
  const archived = parseArchiveHash(window.location.hash, ZONES.map((item) => item.id));
  const zone = ZONES.find((item) => item.id === archived?.zoneId);
  if (!zone || !archived) return null;
  const view = archived.view === "section" || archived.view === "network" ? archived.view : "overview";
  return { zone, view: zone.scene === "network" ? "network" : view };
}

function writeArchiveHash(zone: Zone, view: "overview" | "section" | "network") {
  if (typeof window === "undefined") return;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${makeArchiveHash(zone.id, view)}`);
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
  const viewerRef = useRef<HTMLElement>(null);
  const hotspotRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const focusRef = useRef<(zone: Zone) => void>(() => undefined);
  const sceneModeRef = useRef<(mode: "overview" | "section" | "network", zone: Zone) => void>(() => undefined);
  const resetRef = useRef<() => void>(() => undefined);
  const panRef = useRef<(delta: number) => void>(() => undefined);
  const zoomRef = useRef<(delta: number) => void>(() => undefined);
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
  const [cutaway, setCutaway] = useState(true);
  const [autoRotate, setAutoRotate] = useState(true);
  // Start with the CSS cutaway visible so server-rendered previews and
  // WebGL-restricted iframes never collapse to an empty black stage.
  const [webglUnavailable, setWebglUnavailable] = useState(true);
  const [help, setHelp] = useState(false);
  const [mobilePanel, setMobilePanel] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [language, setLanguage] = useState<"en" | "fa">("en");
  const [query, setQuery] = useState("");
  const [detailTab, setDetailTab] = useState<"briefing" | "facilities" | "sources">("briefing");
  const [journeyId, setJourneyId] = useState(JOURNEYS[0].id);
  const [journeyStep, setJourneyStep] = useState(0);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const [shared, setShared] = useState(false);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  const [focusMode, setFocusMode] = useState(false);
  const copy = UI_COPY[language];

  const activeJourney = JOURNEYS.find((journey) => journey.id === journeyId) ?? JOURNEYS[0];

  const visibleZones = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return ZONES.filter((zone) => {
      if (zone.group !== sectorTab) return false;
      if (!normalized) return true;
      return [zone.name, zone.kicker, zone.levels, zone.description, ...zone.people, ...zone.details.flatMap((detail) => [detail.name, detail.note])]
        .some((value) => value.toLocaleLowerCase().includes(normalized));
    });
  }, [query, sectorTab]);

  useEffect(() => {
    const saved = window.localStorage.getItem("silo-theme");
    const preferredTheme = saved === "dark" || saved === "light"
      ? saved
      : window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    const frame = window.requestAnimationFrame(() => setTheme(preferredTheme));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("silo-language");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const frame = window.requestAnimationFrame(() => {
      if (savedLanguage === "fa" || savedLanguage === "en") setLanguage(savedLanguage);
      if (reducedMotion.matches) setAutoRotate(false);
    });
    const onMotionChange = (event: MediaQueryListEvent) => {
      if (event.matches) setAutoRotate(false);
    };
    reducedMotion.addEventListener("change", onMotionChange);
    return () => {
      window.cancelAnimationFrame(frame);
      reducedMotion.removeEventListener("change", onMotionChange);
    };
  }, []);

  useEffect(() => {
    window.localStorage.setItem("silo-language", language);
  }, [language]);

  useEffect(() => {
    const applyHash = () => {
      const archived = readArchiveHash();
      if (!archived) return;
      setSelected(archived.zone);
      setSectorTab(archived.zone.group);
      setViewMode(archived.view);
      window.requestAnimationFrame(() => sceneModeRef.current(archived.view, archived.zone));
    };
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
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
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) setFocusMode(false);
      else if (document.fullscreenElement === viewerRef.current) setFocusMode(true);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    if (!focusMode) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFocusMode(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [focusMode]);

  useEffect(() => {
    const visuals = visualRef.current;
    if (visuals.cutShell) visuals.cutShell.visible = cutaway;
    if (visuals.fullShell) visuals.fullShell.visible = !cutaway;
    if (visuals.utility) visuals.utility.visible = true;
    if (visuals.population) visuals.population.visible = true;
    visuals.floorMaterials?.forEach((material, index) => {
      material.opacity = 0.72;
      material.emissiveIntensity = index === 3 ? 0.05 : 0.035;
    });
  }, [cutaway]);

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
    if (!hasWebGL) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070806, 0.0155);
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 180);
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
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
    renderer.domElement.setAttribute("role", "application");
    renderer.domElement.setAttribute("tabindex", "0");
    renderer.domElement.setAttribute("aria-description", "Drag to orbit, Shift-drag to move vertically, scroll or plus and minus to zoom, and R to reset the view.");
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

    const surfaceGround = new THREE.Mesh(
      new THREE.RingGeometry(11.7, 25, 96),
      new THREE.MeshStandardMaterial({ color: 0x34382f, roughness: 1, metalness: 0.02, side: THREE.DoubleSide }),
    );
    surfaceGround.rotation.x = -Math.PI / 2;
    surfaceGround.position.y = 18.25;
    surfaceGround.receiveShadow = true;
    world.add(surfaceGround);
    const surfaceBerm = new THREE.Mesh(
      new THREE.TorusGeometry(13.4, 1.05, 10, 96),
      new THREE.MeshStandardMaterial({ color: 0x4a493b, roughness: 1 }),
    );
    surfaceBerm.rotation.x = Math.PI / 2;
    surfaceBerm.position.y = 18.45;
    surfaceBerm.scale.z = 0.58;
    world.add(surfaceBerm);
    const surfaceHatch = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.55, 2.7), capMat);
    surfaceHatch.position.set(-4.8, 18.65, 1.4);
    surfaceHatch.rotation.y = -0.18;
    world.add(surfaceHatch);
    const sensorMast = new THREE.Group();
    sensorMast.position.set(4.6, 18.3, 0.2);
    const sensorPole = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.27, 2.55, 14),
      new THREE.MeshStandardMaterial({ color: 0x5d625a, roughness: 0.48, metalness: 0.72 }),
    );
    sensorPole.position.y = 1.25;
    sensorMast.add(sensorPole);
    const sensorLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.48, 24, 16),
      new THREE.MeshStandardMaterial({ color: 0x7fa2a0, emissive: 0x1e5154, emissiveIntensity: 0.9, roughness: 0.18, metalness: 0.56 }),
    );
    sensorLens.position.set(0, 2.52, 0.18);
    sensorMast.add(sensorLens);
    world.add(sensorMast);
    [[-20, 4], [19, -7], [-15, -17], [13, 15]].forEach(([x, z]) => {
      const distantRim = new THREE.Mesh(
        new THREE.TorusGeometry(2.45, 0.24, 8, 48),
        new THREE.MeshStandardMaterial({ color: 0x51534a, roughness: 0.9, metalness: 0.16 }),
      );
      distantRim.rotation.x = Math.PI / 2;
      distantRim.position.set(x, 18.35, z);
      world.add(distantRim);
    });

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

    const cafeteriaFeedCanvas = document.createElement("canvas");
    cafeteriaFeedCanvas.width = 1024;
    cafeteriaFeedCanvas.height = 384;
    const cafeteriaFeedContext = cafeteriaFeedCanvas.getContext("2d");
    if (cafeteriaFeedContext) {
      const sky = cafeteriaFeedContext.createLinearGradient(0, 0, 0, cafeteriaFeedCanvas.height);
      sky.addColorStop(0, "#717d76");
      sky.addColorStop(0.52, "#56615b");
      sky.addColorStop(1, "#222925");
      cafeteriaFeedContext.fillStyle = sky;
      cafeteriaFeedContext.fillRect(0, 0, cafeteriaFeedCanvas.width, cafeteriaFeedCanvas.height);

      cafeteriaFeedContext.fillStyle = "rgba(196,205,195,.09)";
      for (let band = 0; band < 6; band += 1) {
        cafeteriaFeedContext.fillRect(0, 74 + band * 31, cafeteriaFeedCanvas.width, 10 + band * 4);
      }

      cafeteriaFeedContext.beginPath();
      cafeteriaFeedContext.moveTo(0, 284);
      for (let x = 0; x <= cafeteriaFeedCanvas.width; x += 42) {
        const ridge = 252 + Math.sin(x * 0.019) * 17 + Math.sin(x * 0.051) * 8;
        cafeteriaFeedContext.lineTo(x, ridge);
      }
      cafeteriaFeedContext.lineTo(cafeteriaFeedCanvas.width, cafeteriaFeedCanvas.height);
      cafeteriaFeedContext.lineTo(0, cafeteriaFeedCanvas.height);
      cafeteriaFeedContext.closePath();
      cafeteriaFeedContext.fillStyle = "#252c28";
      cafeteriaFeedContext.fill();

      cafeteriaFeedContext.strokeStyle = "rgba(25,30,27,.72)";
      cafeteriaFeedContext.lineWidth = 5;
      for (let tree = 0; tree < 11; tree += 1) {
        const x = 55 + tree * 94 + seeded(tree + 340) * 28;
        const baseY = 292 + seeded(tree + 390) * 26;
        const height = 24 + seeded(tree + 410) * 42;
        cafeteriaFeedContext.beginPath();
        cafeteriaFeedContext.moveTo(x, baseY);
        cafeteriaFeedContext.lineTo(x + 2, baseY - height);
        cafeteriaFeedContext.moveTo(x + 1, baseY - height * 0.55);
        cafeteriaFeedContext.lineTo(x - 13, baseY - height * 0.76);
        cafeteriaFeedContext.moveTo(x + 1, baseY - height * 0.7);
        cafeteriaFeedContext.lineTo(x + 14, baseY - height * 0.9);
        cafeteriaFeedContext.stroke();
      }

      const haze = cafeteriaFeedContext.createLinearGradient(0, 185, 0, 342);
      haze.addColorStop(0, "rgba(190,199,190,.16)");
      haze.addColorStop(1, "rgba(70,78,72,0)");
      cafeteriaFeedContext.fillStyle = haze;
      cafeteriaFeedContext.fillRect(0, 170, cafeteriaFeedCanvas.width, 180);

      cafeteriaFeedContext.strokeStyle = "rgba(22,26,23,.28)";
      cafeteriaFeedContext.lineWidth = 2;
      for (let x = 0; x <= cafeteriaFeedCanvas.width; x += 64) {
        cafeteriaFeedContext.beginPath();
        cafeteriaFeedContext.moveTo(x, 0);
        cafeteriaFeedContext.lineTo(x, cafeteriaFeedCanvas.height);
        cafeteriaFeedContext.stroke();
      }
      for (let y = 0; y <= cafeteriaFeedCanvas.height; y += 48) {
        cafeteriaFeedContext.beginPath();
        cafeteriaFeedContext.moveTo(0, y);
        cafeteriaFeedContext.lineTo(cafeteriaFeedCanvas.width, y);
        cafeteriaFeedContext.stroke();
      }

      cafeteriaFeedContext.fillStyle = "rgba(8,10,9,.72)";
      [[65, 38], [129, 38], [833, 278], [897, 278], [705, 86]].forEach(([x, y], index) => {
        cafeteriaFeedContext.fillRect(x, y, index === 4 ? 61 : 62, index === 4 ? 46 : 45);
      });
      cafeteriaFeedContext.fillStyle = "rgba(222,207,168,.13)";
      for (let speck = 0; speck < 260; speck += 1) {
        const radius = 0.4 + seeded(speck + 810) * 2.5;
        cafeteriaFeedContext.beginPath();
        cafeteriaFeedContext.arc(
          seeded(speck + 910) * cafeteriaFeedCanvas.width,
          seeded(speck + 1010) * cafeteriaFeedCanvas.height,
          radius,
          0,
          TAU,
        );
        cafeteriaFeedContext.fill();
      }
    }
    const cafeteriaFeedTexture = new THREE.CanvasTexture(cafeteriaFeedCanvas);
    cafeteriaFeedTexture.colorSpace = THREE.SRGBColorSpace;
    cafeteriaFeedTexture.anisotropy = Math.min(renderer.capabilities.getMaxAnisotropy(), 4);

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

      if (zone.scene === "surface") {
        const earthMat = new THREE.MeshStandardMaterial({ color: 0x4b4b3e, roughness: 1, metalness: 0.01 });
        const toxicMat = new THREE.MeshStandardMaterial({ color: 0x687264, roughness: 0.92, emissive: 0x182019, emissiveIntensity: 0.28 });
        addBox(group, [14, 0.52, 10], [0, -2.35, 0], earthMat);
        for (let x = -5.8; x <= 5.8; x += 1.15) {
          const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + seeded(Math.round((x + 9) * 13)) * 0.42, 0), earthMat);
          rubble.position.set(x, -1.95, -1.6 + seeded(Math.round((x + 9) * 17)) * 5.3);
          rubble.scale.y = 0.45;
          group.add(rubble);
        }
        const berm = new THREE.Mesh(new THREE.TorusGeometry(4.5, 1.15, 8, 58, Math.PI * 1.35), earthMat);
        berm.rotation.x = Math.PI / 2;
        berm.rotation.z = 0.42;
        berm.position.set(0.8, -1.35, -1.5);
        berm.scale.z = 0.62;
        group.add(berm);
        addBox(group, [3.25, 0.58, 2.65], [-4.4, -1.65, -1.15], detailDarkMat, -0.12);
        const ramp = addBox(group, [4.7, 0.18, 1.75], [-2.0, -1.9, 0.2], detailMetalMat, -0.12);
        ramp.rotation.z = 0.06;
        addRail(group, -4.2, 0.1, -1.88, 1.05, detailMetalMat);
        addCylinder(group, 0.19, 3.55, [3.6, -0.45, -0.1], detailMetalMat);
        const lens = new THREE.Mesh(new THREE.SphereGeometry(0.58, 24, 16), glow);
        lens.position.set(3.6, 1.36, 0.15);
        group.add(lens);
        const lensCage = new THREE.Mesh(new THREE.TorusGeometry(0.73, 0.08, 8, 28), detailMetalMat);
        lensCage.position.set(3.6, 1.36, 0.15);
        group.add(lensCage);
        for (const x of [-0.7, 1.1, 5.2]) {
          addCylinder(group, 0.18, 1.25, [x, -1.55, 2.4 + seeded(Math.round(x * 10))], toxicMat, [0, 0, 1.1]);
          addBox(group, [0.8, 0.2, 0.42], [x + 0.38, -1.84, 2.4 + seeded(Math.round(x * 10))], toxicMat, 0.35);
        }
        for (const x of [-5.2, -1.7, 1.8, 5.3]) {
          const rim = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.09, 8, 28), detailMetalMat);
          rim.rotation.x = Math.PI / 2;
          rim.position.set(x, -1.92, -4.1);
          group.add(rim);
        }
        const haze = new THREE.PointLight(0x87937f, 14, 18, 2);
        haze.position.set(0, 5, 2);
        group.add(haze);
      } else if (zone.scene === "cafeteria") {
        const cafeteriaConcrete = new THREE.MeshStandardMaterial({ color: 0x34352f, roughness: 0.98, metalness: 0.02 });
        const agedSteel = new THREE.MeshStandardMaterial({ color: 0x484840, roughness: 0.64, metalness: 0.58 });
        const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x3f3a30, roughness: 0.86, metalness: 0.22 });
        const warmFixture = new THREE.MeshStandardMaterial({ color: 0xc6a56d, emissive: 0x8f5d27, emissiveIntensity: 1.35, roughness: 0.5, metalness: 0.38 });
        const screenSeam = new THREE.MeshBasicMaterial({ color: 0x111512, transparent: true, opacity: 0.32, toneMapped: false });
        const failedPanel = new THREE.MeshStandardMaterial({ color: 0x090b09, roughness: 0.93, metalness: 0.18 });
        const aisleMat = new THREE.MeshStandardMaterial({ color: 0x7d6c4f, transparent: true, opacity: 0.22, roughness: 1 });
        const screenMaterial = new THREE.MeshBasicMaterial({ map: cafeteriaFeedTexture, color: 0xe0e6df, toneMapped: false });

        addBox(group, [14, 0.22, 10], [0, -2.38, 0], cafeteriaConcrete);
        addBox(group, [2.05, 0.025, 8.2], [0, -2.25, 0.42], aisleMat);
        for (let x = -6.2; x <= 6.2; x += 1.55) addBox(group, [0.035, 0.028, 9.2], [x, -2.24, 0.05], agedSteel);

        const display = new THREE.Mesh(new THREE.CircleGeometry(1, 96), screenMaterial);
        display.position.set(0, 0.35, -4.6);
        display.scale.set(5.32, 1.84, 1);
        display.receiveShadow = false;
        group.add(display);
        const displayRim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.055, 10, 96), agedSteel);
        displayRim.position.set(0, 0.35, -4.53);
        displayRim.scale.set(5.47, 1.99, 1);
        group.add(displayRim);
        const innerRim = new THREE.Mesh(new THREE.TorusGeometry(1, 0.018, 8, 96), warmFixture);
        innerRim.position.set(0, 0.35, -4.48);
        innerRim.scale.set(5.28, 1.81, 1);
        group.add(innerRim);

        for (let x = -4.45; x <= 4.45; x += 0.67) {
          const height = 3.36 * Math.sqrt(Math.max(0, 1 - (x / 5.28) ** 2));
          addBox(group, [0.018, height, 0.012], [x, 0.35, -4.46], screenSeam);
        }
        for (let y = -1.02; y <= 1.72; y += 0.46) {
          const width = 10.08 * Math.sqrt(Math.max(0, 1 - ((y - 0.35) / 1.8) ** 2));
          addBox(group, [width, 0.018, 0.012], [0, y, -4.46], screenSeam);
        }
        [[-4.25, 1.28], [-3.58, 1.28], [3.86, -0.62], [4.53, -0.62], [2.56, 1.02]].forEach(([x, y], index) => {
          addBox(group, [index === 4 ? 0.61 : 0.62, index === 4 ? 0.43 : 0.41, 0.026], [x, y, -4.41], failedPanel);
        });
        addBox(group, [11.45, 0.38, 0.58], [0, 2.36, -4.38], detailDarkMat);
        addBox(group, [11.2, 0.26, 0.52], [0, -1.62, -4.4], agedSteel);
        for (const x of [-5.92, 5.92]) {
          addBox(group, [0.6, 5.18, 0.75], [x, 0.12, -4.35], cafeteriaConcrete);
          addBox(group, [0.18, 4.55, 0.82], [x * 0.99, 0.1, -4.28], agedSteel);
        }

        const screenSpill = new THREE.PointLight(0x9db1aa, 13, 12, 2);
        screenSpill.position.set(0, 0.65, -2.7);
        group.add(screenSpill);

        const addCeilingFixture = (x: number, z: number, radius: number) => {
          addCylinder(group, radius, 0.13, [x, 2.62, z], agedSteel);
          addCylinder(group, radius * 0.74, 0.06, [x, 2.53, z], warmFixture);
          for (let petal = 0; petal < 8; petal += 1) {
            const angle = (TAU / 8) * petal;
            addCylinder(group, radius * 0.13, 0.035, [x + Math.cos(angle) * radius * 0.38, 2.48, z + Math.sin(angle) * radius * 0.38], warmFixture, [0, 0, 0], 10);
          }
        };
        [[-4.55, -1.55, 0.7], [-2.28, -1.55, 0.7], [0, -1.55, 0.76], [2.28, -1.55, 0.7], [4.55, -1.55, 0.7], [-3.45, 1.35, 0.66], [-1.15, 1.35, 0.66], [1.15, 1.35, 0.66], [3.45, 1.35, 0.66]].forEach(([x, z, radius]) => addCeilingFixture(x, z, radius));
        for (const x of [-3.4, 0, 3.4]) {
          const pool = new THREE.PointLight(0xd2aa6a, 3.1, 7.5, 2);
          pool.position.set(x, 2.15, 0.65);
          group.add(pool);
        }

        const addMessTable = (x: number, z: number) => {
          const table = new THREE.Group();
          addBox(table, [2.85, 0.13, 0.76], [0, 1.08, 0], tableTopMat);
          for (const legX of [-1.05, 1.05]) {
            for (const legZ of [-0.23, 0.23]) addBox(table, [0.12, 0.93, 0.12], [legX, 0.55, legZ], agedSteel);
          }
          for (const benchZ of [-0.69, 0.69]) {
            addBox(table, [2.55, 0.13, 0.3], [0, 0.76, benchZ], tableTopMat);
            for (const legX of [-0.92, 0.92]) addBox(table, [0.1, 0.67, 0.1], [legX, 0.38, benchZ], agedSteel);
          }
          for (const cupX of [-0.72, 0.08, 0.78]) addCylinder(table, 0.095, 0.15, [cupX, 1.23, cupX === 0.08 ? -0.14 : 0.12], agedSteel, [0, 0, 0], 12);
          table.position.set(x, -2.3, z);
          group.add(table);
        };
        for (const z of [0.05, 2.18]) {
          for (const x of [-3.75, 0, 3.75]) addMessTable(x, z);
        }

        const clothing = [
          new THREE.MeshStandardMaterial({ color: 0x625342, roughness: 1 }),
          new THREE.MeshStandardMaterial({ color: 0x4c594a, roughness: 1 }),
          new THREE.MeshStandardMaterial({ color: 0x5b504d, roughness: 1 }),
          new THREE.MeshStandardMaterial({ color: 0x6b624e, roughness: 1 }),
        ];
        const skin = new THREE.MeshStandardMaterial({ color: 0x9a7960, roughness: 0.95 });
        const addResident = (x: number, z: number, index: number, seated = false) => {
          const resident = new THREE.Group();
          const outfit = clothing[index % clothing.length];
          const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.29, seated ? 0.68 : 0.82, 8), outfit);
          torso.position.y = seated ? 1.08 : 1.0;
          torso.castShadow = true;
          resident.add(torso);
          const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), skin);
          head.position.y = seated ? 1.6 : 1.56;
          head.castShadow = true;
          resident.add(head);
          for (const side of [-1, 1]) {
            const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.58, 8), outfit);
            arm.position.set(side * 0.28, seated ? 0.98 : 0.95, seated ? -0.12 : 0);
            arm.rotation.z = side * (seated ? 0.46 : 0.12);
            arm.castShadow = true;
            resident.add(arm);
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.09, seated ? 0.62 : 0.78, 8), detailDarkMat);
            leg.position.set(side * 0.12, seated ? 0.38 : 0.4, seated ? -0.2 : 0);
            leg.rotation.x = seated ? Math.PI * 0.34 : 0;
            resident.add(leg);
          }
          resident.position.set(x, -2.28, z);
          resident.rotation.y = Math.PI + (seeded(index + 1600) - 0.5) * 0.16;
          group.add(resident);
        };
        [[-4.45, 0.73], [-3.1, -0.64], [-0.65, 0.74], [0.72, -0.64], [3.1, 0.74], [4.48, -0.64], [-4.42, 2.88], [-3.08, 1.48], [-0.68, 2.88], [0.7, 1.48], [3.08, 2.88], [4.46, 1.48]].forEach(([x, z], index) => addResident(x, z, index, true));
        [-4.7, -3.15, -1.55, 0, 1.62, 3.18, 4.72].forEach((x, index) => addResident(x, -2.4 + Math.abs(x) * 0.035, index + 20));

        addBox(group, [1.25, 1.18, 5.5], [-5.93, -1.72, 0.58], detailConcreteMat);
        addBox(group, [1.55, 0.14, 5.72], [-5.93, -1.08, 0.58], agedSteel);
        addBox(group, [0.32, 2.65, 5.5], [-6.48, -0.36, 0.58], detailDarkMat);
        for (const z of [-1.45, -0.1, 1.25, 2.6]) {
          addBox(group, [0.72, 0.12, 0.88], [-5.68, -0.92, z], tableTopMat);
          addCylinder(group, 0.18, 0.3, [-5.65, -0.82, z], agedSteel, [0, 0, 0], 16);
        }
        addBox(group, [0.12, 0.16, 4.8], [-5.28, 1.22, 0.58], warmFixture);

        for (let step = 0; step < 5; step += 1) {
          addBox(group, [1.35, 0.2, 0.72], [5.55, -2.16 + step * 0.22, 3.42 - step * 0.58], cafeteriaConcrete);
        }
        addBox(group, [1.48, 0.18, 2.15], [5.55, -1.19, 0.42], agedSteel);
        addRail(group, 4.86, 6.24, -1.2, 1.46, agedSteel);
        addBox(group, [0.16, 2.62, 1.62], [6.5, -0.18, 0.38], detailDarkMat);
        addBox(group, [0.18, 2.25, 1.25], [6.39, -0.22, 0.38], agedSteel);
        addBox(group, [0.21, 0.12, 1.02], [6.27, 0.72, 0.38], warmFixture);

        addTube(group, [[-6.25, 2.32, 3.86], [-1.4, 2.32, 3.86], [1.5, 2.15, 3.55], [6.15, 2.15, 3.55]], 0.17, agedSteel);
        addTube(group, [[-6.25, 2.05, 4.22], [-2.2, 2.05, 4.22], [1.2, 1.9, 4.05], [5.95, 1.9, 4.05]], 0.09, accent);
        addRail(group, -6, 6, -2.32, 4.25, agedSteel);
      } else if (zone.scene === "airlock") {
        const warningMat = new THREE.MeshStandardMaterial({ color: 0xd15e3e, emissive: 0x6e170a, emissiveIntensity: 0.82, roughness: 0.4, metalness: 0.62 });
        const suitMat = new THREE.MeshStandardMaterial({ color: 0xd7d5c8, roughness: 0.72, metalness: 0.12 });
        const visorMat = new THREE.MeshStandardMaterial({ color: 0x243438, emissive: 0x16333a, emissiveIntensity: 0.45, roughness: 0.18, metalness: 0.55 });
        addBox(group, [0.16, 5.2, 8.7], [-2.45, 0, -0.05], detailGlassMat);
        addBox(group, [0.16, 5.2, 8.7], [2.65, 0, -0.05], detailGlassMat);
        const innerRim = new THREE.Mesh(new THREE.TorusGeometry(1.48, 0.23, 12, 48), detailMetalMat);
        innerRim.position.set(-4.55, 0.12, -4.56);
        group.add(innerRim);
        const innerDoor = new THREE.Mesh(new THREE.CircleGeometry(1.28, 48), detailDarkMat);
        innerDoor.position.set(-4.55, 0.12, -4.59);
        group.add(innerDoor);
        for (let spoke = 0; spoke < 8; spoke += 1) {
          const bar = addBox(group, [0.07, 1.08, 0.035], [-4.55, 0.12, -4.54], detailMetalMat);
          bar.rotation.z = (Math.PI / 4) * spoke;
        }
        const outerRim = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.27, 12, 48), warningMat);
        outerRim.position.set(4.62, 0.18, -4.56);
        group.add(outerRim);
        const outerDoor = new THREE.Mesh(new THREE.CircleGeometry(1.5, 48), detailDarkMat);
        outerDoor.position.set(4.62, 0.18, -4.59);
        group.add(outerDoor);
        for (let y = -2.25; y <= 2.3; y += 0.58) {
          addBox(group, [4.5, 0.055, 0.06], [0.12, y, -4.47], y > 1.7 || y < -1.7 ? warningMat : detailMetalMat);
        }
        const suit = new THREE.Group();
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.48, 1.12, 6, 16), suitMat);
        torso.position.y = -0.25;
        suit.add(torso);
        const hood = new THREE.Mesh(new THREE.SphereGeometry(0.48, 20, 16), suitMat);
        hood.position.y = 1.0;
        suit.add(hood);
        const visor = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 12, 0, Math.PI * 2, 0, Math.PI * 0.52), visorMat);
        visor.rotation.x = Math.PI / 2;
        visor.position.set(0, 1.03, 0.24);
        suit.add(visor);
        for (const side of [-1, 1]) {
          const arm = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.9, 4, 10), suitMat);
          arm.rotation.z = side * -0.18;
          arm.position.set(side * 0.56, -0.15, 0);
          suit.add(arm);
          addCylinder(suit, 0.19, 0.16, [side * 0.65, -0.42, 0], warningMat);
        }
        for (const side of [-1, 1]) {
          const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.19, 0.94, 4, 10), suitMat);
          leg.position.set(side * 0.24, -1.42, 0);
          suit.add(leg);
          addCylinder(suit, 0.22, 0.16, [side * 0.24, -1.62, 0], warningMat);
        }
        addBox(suit, [0.92, 0.11, 0.76], [0, 0.02, 0], warningMat);
        suit.position.set(-0.05, -0.55, -1.5);
        group.add(suit);
        for (const x of [-1.7, -0.85, 0, 0.85, 1.7]) {
          addBox(group, [0.42, 0.06, 5.9], [x, -2.35, 0.15], warningMat);
          addBox(group, [0.28, 0.06, 5.9], [x, 2.58, 0.15], warningMat);
        }
        const ramp = addBox(group, [3.65, 0.22, 5.35], [4.6, -2.05, 1.8], detailMetalMat);
        ramp.rotation.x = -0.08;
        addConsole(group, [-4.95, -1.05, -2.15], accent, 1.55);
        addConsole(group, [3.55, -1.05, -2.1], warningMat, 1.35);
        addTube(group, [[-6.35, 2.28, -4.0], [-2.65, 2.28, -4.0], [-2.65, -1.75, -4.0]], 0.17, accent);
      } else if (zone.scene === "civic") {
        for (const x of [-4.7, -1.55, 1.6, 4.75]) {
          addBox(group, [2.55, 0.72, 1.45], [x, -1.72, -1.45], detailMetalMat);
          addConsole(group, [x, -0.93, -1.65], accent, 1.65);
        }
        addBox(group, [5.25, 0.8, 1.55], [0, -1.55, -3.6], detailDarkMat);
        addBox(group, [4.25, 0.25, 1.1], [0, -0.92, -3.72], accent);
        for (let x = 3.35; x <= 6.15; x += 0.42) addBox(group, [0.08, 4.05, 0.08], [x, -0.52, 2.75], detailMetalMat);
        for (let x = -5.8; x <= -3.2; x += 1.3) {
          addBox(group, [1.02, 3.75, 0.75], [x, -0.5, -4.22], detailMetalMat);
          for (let y = -1.7; y <= 1.15; y += 0.6) addBox(group, [0.74, 0.05, 0.04], [x, y, -3.82], accent);
        }
        addBox(group, [2.7, 2.35, 0.14], [4.7, 0.65, -4.56], detailDarkMat);
        for (let y = -0.15; y <= 1.45; y += 0.4) addBox(group, [2.25, 0.045, 0.04], [4.7, y, -4.46], y > 1 ? accent : detailMetalMat);
        addRail(group, -6, 3.05, -2.38, 4.2, detailMetalMat);
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
        for (const x of [-5.65, -2.65, 0.35]) {
          addCylinder(group, 0.045, 2.45, [x, -0.45, 2.75], detailMetalMat);
          addBox(group, [0.5, 0.28, 0.06], [x, 0.82, 2.75], glow);
          addTube(group, [[x, 0.55, 2.75], [x + 0.35, -0.4, 2.75]], 0.025, accent);
        }
        addBox(group, [2.65, 4.65, 0.16], [-5.25, -0.05, -4.45], detailDarkMat);
        for (let y = -1.8; y <= 1.55; y += 0.56) addBox(group, [2.15, 0.06, 0.04], [-5.25, y, -4.34], y > 0.9 ? accent : detailMetalMat);
        addBox(group, [0.12, 5.2, 3.25], [-1.25, -0.05, 3.15], detailGlassMat);
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
        addBox(group, [3.2, 2.1, 0.15], [-4.35, 0.45, -4.5], detailDarkMat);
        for (let row = 0; row < 3; row += 1) for (let col = 0; col < 4; col += 1) addBox(group, [0.5, 0.3, 0.05], [-5.1 + col * 0.5, -0.15 + row * 0.48, -4.4], (row + col) % 3 === 0 ? accent : detailMetalMat);
        addBox(group, [2.6, 1.1, 1.25], [4.3, -1.75, 3.25], detailMetalMat);
        addBox(group, [2.35, 0.08, 1.05], [4.3, -1.12, 3.25], glow);
        for (let step = 0; step < 7; step += 1) addBox(group, [1.75, 0.13, 0.56], [0.2, -2.05 + step * 0.42, 3.75 - step * 0.42], detailMetalMat);
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
        addCylinder(group, 0.72, 3.1, [3.55, -0.85, 3.25], accent);
        addTube(group, [[3.55, 0.7, 3.25], [3.55, 2.35, 3.25], [-5.6, 2.35, 3.25]], 0.11, accent);
        addBox(group, [2.7, 3.55, 0.68], [4.45, -0.45, -4.25], detailDarkMat);
        for (let y = -1.85; y <= 1.05; y += 0.58) addBox(group, [2.25, 0.07, 0.08], [4.45, y, -3.88], y > 0.75 ? glow : detailMetalMat);
        addConsole(group, [5.1, -1.18, 2.0], accent, 1.25);
      } else if (zone.scene === "utilities") {
        const waterMat = new THREE.MeshPhysicalMaterial({ color: 0x38676c, transparent: true, opacity: 0.72, roughness: 0.16, metalness: 0.2 });
        const airMat = new THREE.MeshStandardMaterial({ color: 0x6e9692, emissive: 0x173c3a, emissiveIntensity: 0.55, roughness: 0.42, metalness: 0.68 });
        for (const x of [-4.8, -1.65, 1.65, 4.8]) {
          addCylinder(group, 1.05, 3.65, [x, -0.65, -2.55], x < 0 ? waterMat : detailMetalMat);
          const crown = new THREE.Mesh(new THREE.TorusGeometry(1.06, 0.09, 8, 28), accent);
          crown.rotation.x = Math.PI / 2;
          crown.position.set(x, 1.18, -2.55);
          group.add(crown);
          addTube(group, [[x, 1.25, -2.55], [x, 2.25, -2.55], [x * 0.72, 2.25, 0.2]], 0.12, x < 0 ? accent : airMat);
        }
        for (let i = 0; i < 3; i += 1) {
          const fan = new THREE.Group();
          const ring = new THREE.Mesh(new THREE.TorusGeometry(0.92, 0.14, 8, 32), detailMetalMat);
          fan.add(ring);
          for (let blade = 0; blade < 8; blade += 1) {
            const angle = (blade / 8) * TAU;
            const fin = addBox(fan, [0.18, 0.78, 0.08], [Math.sin(angle) * 0.39, Math.cos(angle) * 0.39, 0], airMat);
            fin.rotation.z = -angle;
          }
          fan.position.set(-3.5 + i * 3.5, 0.65, -4.56);
          group.add(fan);
        }
        addBox(group, [12.2, 0.24, 2.25], [0, -2.1, 2.6], detailConcreteMat);
        for (let x = -5.5; x <= 5.5; x += 1.1) addBox(group, [0.78, 0.05, 1.85], [x, -1.93, 2.6], waterMat);
        addTube(group, [[-6.3, 2.45, 3.7], [-3, 2.45, 3.7], [-3, -1.1, 3.7]], 0.2, airMat);
        addTube(group, [[6.3, 1.85, 3.45], [3.25, 1.85, 3.45], [3.25, -1.1, 3.45]], 0.17, accent);
        addConsole(group, [0, -1.05, 1.35], accent, 2.8);
        addRail(group, -6, 6, -2.35, 4.35, detailMetalMat);
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
        for (let x = -5.8; x <= -3.2; x += 0.52) addBox(group, [0.08, 3.85, 0.08], [x, -0.5, 3.8], detailMetalMat);
        addBox(group, [3.0, 0.28, 1.15], [-4.5, -1.9, 2.65], detailDarkMat);
        addConsole(group, [-4.5, -1.18, 2.15], accent, 1.9);
        for (let x = 3.4; x <= 5.8; x += 0.8) for (let y = -1.8; y <= 1.45; y += 0.65) addBox(group, [0.55, 0.44, 0.65], [x, y, -4.18], (Math.round(x * 10 + y * 10) % 3 === 0) ? accent : detailWallMat);
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
        const vent = addCylinder(group, 0.58, 10.8, [4.95, 1.72, -1.2], accent, [0, 0, Math.PI / 2]);
        vent.castShadow = true;
        for (let x = -4.3; x <= 4.3; x += 1.4) {
          const cart = addBox(group, [1.15, 0.72, 1.1], [x, -1.58, 2.85], detailDarkMat);
          cart.rotation.x = -0.08;
          addCylinder(group, 0.16, 1.3, [x - 0.38, -2.02, 2.85], detailMetalMat, [Math.PI / 2, 0, 0], 12);
          addCylinder(group, 0.16, 1.3, [x + 0.38, -2.02, 2.85], detailMetalMat, [Math.PI / 2, 0, 0], 12);
        }
        addBox(group, [2.35, 4.6, 2.1], [5.25, -0.2, 3.1], detailMetalMat);
        for (let x = 4.35; x <= 6.15; x += 0.45) addBox(group, [0.07, 4.1, 0.07], [x, -0.25, 2.0], accent);
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
    panRef.current = (delta: number) => {
      cameraState.targetY = THREE.MathUtils.clamp(cameraState.targetY + delta, -30, 24);
    };
    zoomRef.current = (delta: number) => {
      cameraState.targetDistance = THREE.MathUtils.clamp(cameraState.targetDistance + delta, 10, 120);
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
        cameraState.targetDistance = zone.scene === "tunnel" ? 13.5 : zone.scene === "cafeteria" ? 19.2 : 17.5;
        cameraState.targetYaw = zone.scene === "mine" ? 0.28 : 0.06;
        cameraState.targetPitch = zone.scene === "cafeteria" ? 0.045 : 0.08;
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
    let panning = false;
    let pointerX = 0;
    let pointerY = 0;
    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      pointerX = event.clientX;
      pointerY = event.clientY;
      panning = event.shiftKey || event.button === 1 || event.button === 2;
      renderer.domElement.setPointerCapture(event.pointerId);
      setAutoRotate(false);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const deltaX = event.clientX - pointerX;
      const deltaY = event.clientY - pointerY;
      if (panning || event.shiftKey) {
        cameraState.targetY = THREE.MathUtils.clamp(cameraState.targetY + deltaY * 0.055, -30, 24);
        cameraState.targetX = THREE.MathUtils.clamp(cameraState.targetX - deltaX * 0.035, -14, 14);
      } else {
        cameraState.targetYaw -= deltaX * 0.005;
        cameraState.targetPitch = THREE.MathUtils.clamp(cameraState.targetPitch + deltaY * 0.003, -0.48, 0.48);
      }
      pointerX = event.clientX;
      pointerY = event.clientY;
    };
    const onPointerUp = () => { dragging = false; panning = false; };
    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      if (event.shiftKey) cameraState.targetY = THREE.MathUtils.clamp(cameraState.targetY + event.deltaY * 0.02, -30, 24);
      else cameraState.targetDistance = THREE.MathUtils.clamp(cameraState.targetDistance + event.deltaY * 0.04, 10, 120);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "+", "=", "-", "_", "r", "R"].includes(event.key)) event.preventDefault();
      if (event.key === "ArrowLeft") cameraState.targetYaw -= 0.12;
      if (event.key === "ArrowRight") cameraState.targetYaw += 0.12;
      if (event.key === "ArrowUp" && event.shiftKey) panRef.current(2.8);
      else if (event.key === "ArrowUp") cameraState.targetPitch = THREE.MathUtils.clamp(cameraState.targetPitch + 0.08, -0.48, 0.48);
      if (event.key === "ArrowDown" && event.shiftKey) panRef.current(-2.8);
      else if (event.key === "ArrowDown") cameraState.targetPitch = THREE.MathUtils.clamp(cameraState.targetPitch - 0.08, -0.48, 0.48);
      if (event.key === "PageUp") panRef.current(3.5);
      if (event.key === "PageDown") panRef.current(-3.5);
      if (event.key === "+" || event.key === "=") cameraState.targetDistance = Math.max(10, cameraState.targetDistance - 2.5);
      if (event.key === "-" || event.key === "_") cameraState.targetDistance = Math.min(120, cameraState.targetDistance + 3.5);
      if (event.key === "r" || event.key === "R") resetRef.current();
      if (event.key !== "Tab") setAutoRotate(false);
    };
    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    renderer.domElement.addEventListener("pointercancel", onPointerUp);
    renderer.domElement.addEventListener("contextmenu", onContextMenu);
    renderer.domElement.addEventListener("wheel", onWheel, { passive: false });
    renderer.domElement.addEventListener("keydown", onKeyDown);

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
    let pageVisible = !document.hidden;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onVisibilityChange = () => {
      pageVisible = !document.hidden;
      if (pageVisible) clock.getDelta();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    const animate = () => {
      if (!pageVisible) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }
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
      if (!reducedMotion.matches) {
        dust.rotation.y += delta * 0.012;
        generator.rotation.x += delta * 0.18;
      }
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
      renderer.domElement.removeEventListener("contextmenu", onContextMenu);
      renderer.domElement.removeEventListener("wheel", onWheel);
      renderer.domElement.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry?.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((item) => item.dispose());
          else material?.dispose();
        }
      });
      screenTexture.dispose();
      cafeteriaFeedTexture.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      visualRef.current = {};
    };
  }, []);

  const chooseZone = (zone: Zone) => {
    setSelected(zone);
    setDetailTab("briefing");
    setSectorTab(zone.group);
    if (window.matchMedia("(max-width: 780px)").matches) setRightPanelOpen(true);
    if (zone.scene === "network") {
      setViewMode("network");
      sceneModeRef.current("network", zone);
      writeArchiveHash(zone, "network");
    } else if (viewMode === "section") {
      sceneModeRef.current("section", zone);
      writeArchiveHash(zone, "section");
    } else {
      setViewMode("overview");
      sceneModeRef.current("overview", zone);
      window.setTimeout(() => focusRef.current(zone), 30);
      writeArchiveHash(zone, "overview");
    }
    setMobilePanel(true);
  };

  const showOverview = () => {
    setViewMode("overview");
    sceneModeRef.current("overview", selected);
    window.setTimeout(() => focusRef.current(selected), 30);
    writeArchiveHash(selected, "overview");
  };

  const showSection = () => {
    if (selected.scene === "network") {
      setViewMode("network");
      sceneModeRef.current("network", selected);
      writeArchiveHash(selected, "network");
      return;
    }
    setViewMode("section");
    sceneModeRef.current("section", selected);
    writeArchiveHash(selected, "section");
  };

  const showNetwork = () => {
    const networkZone = ZONES.find((zone) => zone.scene === "network") ?? selected;
    setSelected(networkZone);
    setSectorTab("network");
    setViewMode("network");
    sceneModeRef.current("network", networkZone);
    setDetailTab("briefing");
    writeArchiveHash(networkZone, "network");
  };

  const moveJourney = (nextStep: number, journey = activeJourney) => {
    const boundedStep = Math.max(0, Math.min(journey.zones.length - 1, nextStep));
    const zone = ZONES.find((item) => item.id === journey.zones[boundedStep]);
    if (!zone) return;
    setJourneyStep(boundedStep);
    chooseZone(zone);
  };

  const changeJourney = (nextJourneyId: string) => {
    const journey = JOURNEYS.find((item) => item.id === nextJourneyId) ?? JOURNEYS[0];
    setJourneyId(journey.id);
    moveJourney(0, journey);
  };

  const shareView = async () => {
    writeArchiveHash(selected, viewMode);
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      window.setTimeout(() => setShared(false), 1800);
    } catch {
      if (navigator.share) await navigator.share({ title: `SILO 18 — ${selected.name}`, url: window.location.href });
    }
  };

  const toggleFocusMode = async () => {
    if (focusMode) {
      setFocusMode(false);
      if (document.fullscreenElement) {
        try { await document.exitFullscreen(); } catch { /* CSS focus mode still exits. */ }
      }
      return;
    }
    setFocusMode(true);
    try { await viewerRef.current?.requestFullscreen?.(); } catch { /* CSS focus mode remains available. */ }
  };

  return (
    <main className={`silo-app ${leftPanelOpen ? "" : "silo-app--left-collapsed"} ${rightPanelOpen ? "" : "silo-app--right-collapsed"} ${focusMode ? "silo-app--focus" : ""}`} data-theme={theme} data-language={language} dir={language === "fa" ? "rtl" : "ltr"}>
      <a className="skip-link" href="#archive-details">Skip to archive details</a>
      <header className="topbar">
        <div className="brand-lockup"><SiloMark /><div><span className="eyebrow">THE LAST CITY</span><strong>SILO</strong></div></div>
        <div className="archive-title"><span>STRUCTURAL ARCHIVE</span><b>18 / INTERNAL</b><em>{SERIES_COVERAGE}</em></div>
        <div className="topbar__right">
          <span className="system-status"><i /> UPDATED {ARCHIVE_UPDATED}</span>
          <button className={`icon-button icon-button--wide ${shared ? "is-success" : ""}`} onClick={shareView} aria-label={copy.share} title={copy.share}>
            {shared ? <Check size={16} /> : <Share2 size={16} />}<span>{shared ? copy.copied : copy.share}</span>
          </button>
          <button className="icon-button" onClick={() => setLanguage((value) => value === "en" ? "fa" : "en")} aria-label={`Switch interface to ${language === "en" ? "Persian" : "English"}`} title={`Switch to ${language === "en" ? "Persian" : "English"}`}>
            <Languages size={17} /><small>{language === "en" ? "FA" : "EN"}</small>
          </button>
          <button className="icon-button" onClick={() => setTheme((value) => value === "dark" ? "light" : "dark")} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="icon-button" onClick={() => setHelp(true)} aria-label="Open controls help"><CircleHelp size={18} /></button>
        </div>
      </header>

      <aside className="level-index" aria-label="Silo sectors" aria-hidden={!leftPanelOpen || focusMode}>
        <div className="level-index__head"><span>{copy.archive}</span><b>{sectorTab === "internal" ? `${ZONES.filter((zone) => zone.group === "internal").length} SECTIONS` : sectorTab === "below" ? "SUB-FOUNDATION" : "OP. FIFTY"}</b></div>
        <div className="sector-tabs" role="tablist" aria-label="Archive layer">
          <button className={sectorTab === "internal" ? "active" : ""} onClick={() => setSectorTab("internal")} role="tab" aria-selected={sectorTab === "internal"} tabIndex={sectorTab === "internal" ? 0 : -1}>{copy.inside}</button>
          <button className={sectorTab === "below" ? "active" : ""} onClick={() => setSectorTab("below")} role="tab" aria-selected={sectorTab === "below"} tabIndex={sectorTab === "below" ? 0 : -1}>{copy.below}</button>
          <button className={sectorTab === "network" ? "active" : ""} onClick={() => { setSectorTab("network"); showNetwork(); }} role="tab" aria-selected={sectorTab === "network"} tabIndex={sectorTab === "network" ? 0 : -1}>{copy.grid}</button>
        </div>
        <div className="archive-search"><Search size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.search} aria-label={copy.search} />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={13} /></button>}</div>
        <div className="level-list" role="tabpanel" aria-label={`${sectorTab} archive sections`}>
          {visibleZones.map((zone, index) => (
            <button key={zone.id} className={`level-button ${selected.id === zone.id ? "level-button--active" : ""}`} onClick={() => chooseZone(zone)} style={{ "--zone": zone.color } as React.CSSProperties} aria-current={selected.id === zone.id ? "location" : undefined}>
              <span className="level-button__number">{String(index + 1).padStart(2, "0")}</span>
              <span><b>{zone.name}</b><small>{zone.levels}</small></span><ChevronRight size={14} />
            </button>
          ))}
          {visibleZones.length === 0 && <p className="archive-empty">{copy.noResults}</p>}
        </div>
        <div className="canon-key">
          <span><i className="canon-series" /> SERIES</span><span><i className="canon-books" /> BOOKS</span><span><i className="canon-reconstruction" /> RECONSTRUCTION</span>
        </div>
        <div className="depth-readout"><span>{sectorTab === "network" ? "KNOWN FIELD" : "EST. VERTICAL REACH"}</span><strong>{sectorTab === "network" ? "51" : ">1,440"}<small>{sectorTab === "network" ? " silos" : " m"}</small></strong><div className="depth-scale"><i /></div><small>{sectorTab === "network" ? "18 / 17 / 1 / SEED" : "BEDROCK / CONTROLLED VOID"}</small></div>
      </aside>

      <section ref={viewerRef} className="viewer-shell" aria-label="Silo 18 3D viewer">
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
                {selected.scene === "surface" ? <Trees size={58} /> : selected.scene === "utilities" ? <Wind size={58} /> : selected.scene === "mine" ? <Pickaxe size={58} /> : selected.scene === "airlock" ? <DoorOpen size={58} /> : selected.scene === "cafeteria" ? <Eye size={58} /> : selected.scene === "tunnel" ? <DoorOpen size={58} /> : selected.scene === "gap" ? <Waves size={58} /> : selected.scene === "digger" ? <Drill size={58} /> : selected.scene === "it" ? <Database size={58} /> : selected.scene === "mechanical" ? <Gauge size={58} /> : selected.scene === "farm" ? <Activity size={58} /> : <Layers3 size={58} />}
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
          <button onClick={() => panRef.current(3.5)} title="Move view up" aria-label="Move view up"><ArrowUp size={17} /></button>
          <button onClick={() => panRef.current(-3.5)} title="Move view down" aria-label="Move view down"><ArrowDown size={17} /></button><span />
          <button onClick={() => zoomRef.current(7)} title="Zoom out" aria-label="Zoom out"><ZoomOut size={17} /></button>
          <button onClick={() => zoomRef.current(-7)} title="Zoom in" aria-label="Zoom in"><ZoomIn size={17} /></button>
          <button onClick={toggleFocusMode} className={focusMode ? "is-active" : ""} title={focusMode ? "Exit full-screen viewer" : "Open full-screen viewer"} aria-label={focusMode ? "Exit full-screen viewer" : "Open full-screen viewer"} aria-pressed={focusMode}>{focusMode ? <Minimize2 size={17} /> : <Maximize2 size={17} />}</button>
        </div>
        <button className="side-panel-toggle side-panel-toggle--left" onClick={() => setLeftPanelOpen((value) => !value)} aria-label={leftPanelOpen ? "Hide archive panel" : "Show archive panel"} title={leftPanelOpen ? "Hide archive panel" : "Show archive panel"}>{leftPanelOpen ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}</button>
        <button className="side-panel-toggle side-panel-toggle--right" onClick={() => setRightPanelOpen((value) => !value)} aria-label={rightPanelOpen ? "Hide details panel" : "Show details panel"} title={rightPanelOpen ? "Hide details panel" : "Show details panel"}>{rightPanelOpen ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}</button>
        <div className="view-switch" aria-label="Scene view">
          <button className={viewMode === "overview" ? "active" : ""} onClick={showOverview} aria-pressed={viewMode === "overview"}><MapIcon size={14} /> {copy.overview}</button>
          <button className={viewMode === "section" ? "active" : ""} onClick={showSection} aria-pressed={viewMode === "section"}><Box size={14} /> {copy.section}</button>
          <button className={viewMode === "network" ? "active" : ""} onClick={showNetwork} aria-pressed={viewMode === "network"}><Network size={14} /> {copy.network}</button>
        </div>
        <div className={`journey-dock ${journeyOpen ? "journey-dock--open" : "journey-dock--collapsed"}`} aria-label="Guided archive routes">
          <button className="journey-dock__toggle" onClick={() => setJourneyOpen((value) => !value)} aria-expanded={journeyOpen} aria-controls="guided-routes-content" aria-label={journeyOpen ? "Hide guided routes" : "Open guided routes"} title={journeyOpen ? "Hide guided routes" : "Open guided routes"}>
            <Route size={16} /><span>{copy.guided}</span>{journeyOpen && <b>{journeyStep + 1}/{activeJourney.zones.length}</b>}{journeyOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
          {journeyOpen && <div id="guided-routes-content" className="journey-dock__body">
            <select value={journeyId} onChange={(event) => changeJourney(event.target.value)} aria-label="Choose a guided route">
              {JOURNEYS.map((journey) => <option key={journey.id} value={journey.id}>{journey.name}</option>)}
            </select>
            <small>{activeJourney.subtitle}</small>
            <div className="journey-dock__steps" role="list" aria-label={activeJourney.name}>
              {activeJourney.zones.map((zoneId, index) => {
                const zone = ZONES.find((item) => item.id === zoneId);
                return <button key={zoneId} className={index === journeyStep ? "active" : ""} onClick={() => moveJourney(index)} aria-label={`Step ${index + 1}: ${zone?.name ?? zoneId}`} aria-current={index === journeyStep ? "step" : undefined}><i />{zone?.name ?? zoneId}</button>;
              })}
            </div>
            <div className="journey-dock__nav"><button onClick={() => moveJourney(journeyStep - 1)} disabled={journeyStep === 0}><ChevronLeft size={15} /> PREV</button><button onClick={() => moveJourney(journeyStep + 1)} disabled={journeyStep === activeJourney.zones.length - 1}>NEXT <ChevronRight size={15} /></button></div>
          </div>
          }
        </div>
      </section>

      <aside id="archive-details" className={`intel-panel ${mobilePanel ? "intel-panel--mobile-open" : ""}`} aria-label={`${selected.name} archive details`} aria-hidden={!rightPanelOpen || focusMode}>
        <button className="intel-panel__close" onClick={() => setMobilePanel(false)} aria-label="Close detail panel"><X size={18} /></button>
        <div className="intel-panel__stripe" style={{ background: selected.color }} />
        <div className="intel-panel__topline"><span>{selected.kicker}</span><b className={`clearance clearance--${selected.status.toLowerCase().replace(" ", "-")}`}>{selected.status}</b></div>
        <div className="zone-meta"><span className="zone-number">{selected.code}</span><b className={`canon-badge canon-badge--${selected.canon.toLowerCase()}`}>{selected.canon}</b><span className="zone-era">{selected.era}</span></div>
        <h1>{selected.name}</h1><p className="zone-levels">{selected.levels}</p>
        <div className="section-actions">
          {viewMode !== "overview" && <button className="section-actions__back" onClick={showOverview}><ArrowLeft size={15} /> {copy.fullSilo}</button>}
          <button className="section-actions__primary" onClick={selected.scene === "network" ? showNetwork : showSection}>{selected.scene === "network" ? <Network size={15} /> : <Box size={15} />}{selected.scene === "network" ? copy.openNetwork : copy.openSection}</button>
        </div>
        <div className="intel-tabs" role="tablist" aria-label="Archive detail view">
          <button id="tab-briefing" role="tab" aria-selected={detailTab === "briefing"} aria-controls="panel-briefing" tabIndex={detailTab === "briefing" ? 0 : -1} className={detailTab === "briefing" ? "active" : ""} onClick={() => setDetailTab("briefing")}>{copy.overviewTab}</button>
          <button id="tab-facilities" role="tab" aria-selected={detailTab === "facilities"} aria-controls="panel-facilities" tabIndex={detailTab === "facilities" ? 0 : -1} className={detailTab === "facilities" ? "active" : ""} onClick={() => setDetailTab("facilities")}>{copy.facilitiesTab}<span>{selected.details.length}</span></button>
          <button id="tab-sources" role="tab" aria-selected={detailTab === "sources"} aria-controls="panel-sources" tabIndex={detailTab === "sources" ? 0 : -1} className={detailTab === "sources" ? "active" : ""} onClick={() => setDetailTab("sources")}>{copy.sourcesTab}<span>{ZONE_REFERENCES[selected.id]?.length ?? 0}</span></button>
        </div>

        {detailTab === "briefing" && <div id="panel-briefing" className="intel-tabpanel" role="tabpanel" aria-labelledby="tab-briefing">
          <p className="zone-copy">{selected.description}</p>
          {selected.scene === "airlock" && (
            <div className="sequence-strip" aria-label="One-way cleaning route">
              <Route size={15} /><div className="sequence-strip__steps"><span>HOLDING</span><i>→</i><span>SUIT PREP</span><i>→</i><span>INNER HATCH</span><i>→</i><span>FIRE PURGE</span><i>→</i><span>OUTER HATCH</span><i>→</i><span>SENSOR</span></div>
            </div>
          )}
          {selected.scene === "cafeteria" && (
            <div className="sequence-strip sequence-strip--sensor" aria-label="Exterior sensor feed route">
              <Eye size={15} /><div className="sequence-strip__steps"><span>EXTERIOR SENSOR</span><i>→</i><span>LIVE FEED</span><i>→</i><span>WALL DISPLAY</span><i>→</i><span>PUBLIC VIEWING</span></div>
            </div>
          )}
          {selected.scene === "surface" && (
            <div className="sequence-strip sequence-strip--sensor" aria-label="Surface cleaning path">
              <Trees size={15} /><div className="sequence-strip__steps"><span>OUTER HATCH</span><i>→</i><span>BERM</span><i>→</i><span>PRIOR CLEANERS</span><i>→</i><span>SENSOR</span><i>→</i><span>SILO FIELD</span></div>
            </div>
          )}
          <span className="section-label section-label--people">{copy.personnel}</span>
          <div className="people-strip">{selected.people.map((person) => <span key={person}>{person}</span>)}</div>
          <div className="system-card">
            {selected.telemetry.map((item, index) => <div key={item.label}>{index === 0 ? <Wind size={16} /> : index === 1 ? <Gauge size={16} /> : <ShieldAlert size={16} />}<span>{item.label}</span><b>{item.value}</b></div>)}
          </div>
          <div className="intel-note"><BookOpen size={16} /><p><b>{copy.evidence}</b>{selected.evidence}</p></div>
          {selected.group === "below" && <div className="route-note"><Route size={15} /><span>SUB-FOUNDATION ROUTING SHOWN AT INFERRED SCALE</span></div>}
        </div>}

        {detailTab === "facilities" && <div id="panel-facilities" className="intel-tabpanel" role="tabpanel" aria-labelledby="tab-facilities">
          <span className="section-label">FACILITIES / SET ANCHORS</span>
          <ul className="installation-list">{selected.details.map((detail, index) => <li key={detail.name}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{detail.name}</b><small>{detail.note}</small></div><i className={`detail-tag detail-tag--${detail.tag.toLowerCase().replace(" ", "-")}`}>{detail.tag}</i></li>)}</ul>
        </div>}

        {detailTab === "sources" && <div id="panel-sources" className="intel-tabpanel" role="tabpanel" aria-labelledby="tab-sources">
          <div className="coverage-card"><span>ARCHIVE COVERAGE</span><b>{SERIES_COVERAGE}</b><small>Last reviewed {ARCHIVE_UPDATED}. Season 3 is ongoing; unreleased material is not treated as canon here.</small></div>
          <div className="source-list">
            {(ZONE_REFERENCES[selected.id] ?? [SERIES_SOURCE]).map((source) => <a key={`${selected.id}-${source.label}`} href={source.url} target="_blank" rel="noreferrer"><span className={`source-kind source-kind--${source.kind.toLowerCase()}`}>{source.kind}</span><div><b>{source.label}</b><small>{source.coverage}</small></div><ExternalLink size={15} /></a>)}
          </div>
          <div className="method-note"><ShieldAlert size={16} /><p><b>HOW TO READ THIS MODEL</b>Series evidence, book continuity and inferred geometry are never merged into one certainty label. Official links establish the works and release coverage; the room-by-room notes identify where geometry is reconstructed.</p></div>
        </div>}
      </aside>

      <footer className="statusbar"><span><i className="status-dot" /> LIVE MODEL</span><span>DRAG TO ORBIT · SHIFT-DRAG TO PAN</span><span>SCROLL TO ZOOM · FOCUS FOR FULL VIEW</span><span className="statusbar__right">PACT ARCHIVE / ACCESS 02</span></footer>
      {help && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setHelp(false)}>
          <div className="help-modal" role="dialog" aria-modal="true" aria-labelledby="help-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="help-modal__close" onClick={() => setHelp(false)} aria-label="Close"><X size={19} /></button>
            <Layers3 size={24} /><span className="eyebrow">ARCHIVE INTERFACE / SPOILERS</span><h2 id="help-title">Explore the city—and what lies beneath it</h2>
            <div className="help-grid"><div><b>OVERVIEW</b><span>144 levels plus the buried undercroft</span></div><div><b>SECTION</b><span>Enter a purpose-built 3D diorama</span></div><div><b>FOCUS MODE</b><span>Hide both panels and expand the 3D viewer</span></div><div><b>PAN</b><span>Use the up/down controls or Shift-drag the model</span></div><div><b>ZOOM</b><span>Scroll or use the −/+ controls for a wider range</span></div><div><b>SERIES / INFERRED</b><span>Every detail carries an evidence label</span></div></div>
            <button className="primary-button" onClick={() => setHelp(false)}>ENTER ARCHIVE <ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </main>
  );
}
