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
  Network,
  Pause,
  Pickaxe,
  Play,
  RotateCcw,
  Route,
  ShieldAlert,
  Waves,
  Wind,
  X,
  ZoomIn,
} from "lucide-react";
import * as THREE from "three";

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
  details: string[];
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
    details: ["Cafeteria display", "Sheriff station", "Airlock & holding"],
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
    canon: "RECONSTRUCTION",
    scene: "judicial",
    color: "#b98a58",
    description:
      "Courtrooms, records and enforcement offices occupy a deliberately defensible band above the Mids.",
    details: ["Judge's chambers", "Records hall", "Raider access"],
    evidence: "Judicial is visibly high in the social hierarchy. Its narrow level range is inferred from dialogue and travel patterns, not a published blueprint.",
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
      "A hardened technical enclave with independent power, server rooms and a sealed vault hidden behind ordinary operations.",
    details: ["Server hall", "Independent power", "The Vault"],
    evidence: "Season 2 confirms an IT vault, independent power and hidden knowledge systems; schematics also show external lines entering IT.",
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
    details: ["Surgical clinic", "Nursery", "Fertility records"],
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
    details: ["Residential rings", "Schools", "Markets & workshops"],
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
    details: ["Hydroponics", "Seed storage", "Water distribution"],
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
    details: ["Fabrication", "Recycling", "Porter depots"],
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
    details: ["Main generator", "Steam feed", "Machine shop"],
    evidence: "Mechanical occupies the Down Deep in both versions. The series explicitly ties Juliette and the main generator to the lowest inhabited levels.",
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
    details: ["Primary excavator", "Mechanical catwalk", "George's hideout"],
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
    details: ["Shallow water shelf", "Hidden pumps", "Rope descent"],
    evidence: "Season 2 reveals that the water is far shallower than feared and leads toward the hidden tunnel. Pump placement remains inferred.",
    status: "UNMAPPED",
  },
  {
    id: "tunnel",
    name: "SAFEGUARD TUNNEL",
    kicker: "Buried control route",
    levels: "Sub-foundation · T-01",
    level: 163,
    code: "T-01",
    group: "below",
    canon: "SERIES",
    scene: "tunnel",
    color: "#7caeb0",
    description:
      "Beyond the water, a concrete tunnel terminates at a circular intelligent door. It recognized Lukas Kyle and named Quinn, Meadows and George as prior visitors.",
    details: ["Circular access door", "Legacy interface", "Safeguard feed"],
    evidence: "The tunnel, door and warning are Season 2 canon. Its ultimate destination and precise relationship to other silos remain unresolved on screen.",
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
    details: ["Ore headings", "Penal lift", "Restricted lateral cuts"],
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
    canon: "BOOKS",
    scene: "network",
    color: "#d0b070",
    description:
      "The show confirms fifty other silos beyond 18. The books provide the clearest connection model: Silo 18 tunnels to 17, while concealed diggers are aligned toward Seed.",
    details: ["Silo 18 → 17 route", "Silo 1 control", "Seed alignment"],
    evidence: "The 51-silo count is series dialogue. The 18-to-17 excavation and Seed destination are book canon; a pre-opened universal transit network is not confirmed.",
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
    scene.add(new THREE.HemisphereLight(0x9aa7a1, 0x17130e, 1.5));
    const key = new THREE.DirectionalLight(0xe2c99e, 3.4);
    key.position.set(10, 24, 16);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
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
    // water shelf, tunnel door and a deliberately non-canonical mine routing.
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
    const addBox = (group: THREE.Group, size: [number, number, number], position: [number, number, number], material: THREE.Material, rotationY = 0) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.position.set(...position);
      mesh.rotation.y = rotationY;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      return mesh;
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
      addBox(group, [14, 0.36, 10], [0, -2.65, 0], detailWallMat);
      addBox(group, [14, 6, 0.35], [0, 0.2, -4.85], detailWallMat);
      addBox(group, [0.35, 6, 10], [-6.85, 0.2, 0], detailWallMat);
      const localLight = new THREE.PointLight(tint, 12, 18, 2);
      localLight.position.set(3.5, 3.8, 3.5);
      group.add(localLight);

      if (zone.scene === "civic") {
        const display = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({ color: 0x718078 }));
        display.position.set(0, 1.1, -4.62);
        group.add(display);
        for (let i = -2; i <= 2; i += 1) {
          const table = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.66, 0.18, 16), detailMetalMat);
          table.position.set(i * 1.75, -1.65, 0.5 + Math.abs(i) * 0.35);
          group.add(table);
        }
        const airlock = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.22, 10, 32), accent);
        airlock.position.set(-4.9, 0, -4.58);
        group.add(airlock);
      } else if (zone.scene === "judicial") {
        for (let x = -5.2; x <= 5.2; x += 1.5) addBox(group, [1.1, 3.9, 0.7], [x, -0.55, -4.35], x % 3 === 0 ? accent : detailMetalMat);
        addBox(group, [5.5, 0.85, 2], [1.2, -1.5, 0.8], detailMetalMat);
        for (let x = -5; x <= -2; x += 1) addBox(group, [0.12, 4.2, 0.12], [x, -0.45, 2.4], accent);
      } else if (zone.scene === "it") {
        for (let x = -5.4; x <= 5.4; x += 1.55) {
          const rack = addBox(group, [1.1, 4.2, 1.3], [x, -0.45, -3.8], detailMetalMat);
          for (let y = -1.8; y <= 1.2; y += 0.65) addBox(group, [0.8, 0.06, 0.05], [x, y, -3.12], accent);
          rack.castShadow = true;
        }
        const vault = new THREE.Mesh(new THREE.TorusGeometry(1.75, 0.24, 12, 48), accent);
        vault.position.set(0, 0.1, -4.58);
        group.add(vault);
      } else if (zone.scene === "medical") {
        for (let x = -4.8; x <= 4.8; x += 3.2) {
          addBox(group, [2.4, 0.35, 4.2], [x, -1.55, 0.3], new THREE.MeshStandardMaterial({ color: 0xb6b8ad, roughness: 0.82 }));
          addBox(group, [1.4, 0.45, 0.6], [x, -1.05, -1.25], accent);
        }
        for (let x = -4.5; x <= 4.5; x += 2.2) {
          const pod = new THREE.Mesh(new THREE.CapsuleGeometry(0.5, 1.1, 4, 12), new THREE.MeshPhysicalMaterial({ color: 0x9ea9a0, transparent: true, opacity: 0.55, roughness: 0.25 }));
          pod.rotation.z = Math.PI / 2;
          pod.position.set(x, 1.4, -3.8);
          group.add(pod);
        }
      } else if (zone.scene === "residential") {
        for (let floor = 0; floor < 2; floor += 1) {
          for (let x = -5.2; x <= 5.2; x += 2.6) addBox(group, [2.2, 2.25, 2.2], [x, -1.35 + floor * 2.35, -3.55], floor ? accent : detailMetalMat);
          addBox(group, [12.5, 0.13, 1.25], [0, -0.1 + floor * 2.35, -1.9], detailMetalMat);
        }
      } else if (zone.scene === "farm") {
        for (let x = -5.4; x <= 5.4; x += 1.35) addBox(group, [0.72, 0.25, 7.5], [x, -2.15, 0], accent);
        for (let x = -4.8; x <= 4.8; x += 2.4) addBox(group, [0.08, 0.08, 8], [x, 2.4, 0], detailMetalMat);
      } else if (zone.scene === "industrial") {
        addBox(group, [11.5, 0.3, 1.6], [0, -1.6, 0], detailMetalMat);
        for (let x = -5; x <= 5; x += 1) {
          const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.23, 1.5, 12), accent);
          roller.rotation.x = Math.PI / 2;
          roller.position.set(x, -1.35, 0);
          group.add(roller);
        }
        for (let i = 0; i < 11; i += 1) addBox(group, [0.9, 0.9, 0.9], [-5 + (i % 6) * 1.5, -0.7 + Math.floor(i / 6), -3.5], i % 3 === 0 ? accent : detailWallMat);
      } else if (zone.scene === "mechanical") {
        const turbine = addDetailTurbine(group, 0xc0583c, 1.18);
        turbine.position.set(0, -0.45, -0.4);
        for (const x of [-5.8, 5.8]) addBox(group, [0.35, 5.4, 0.35], [x, 0, -3.6], accent);
      } else if (zone.scene === "digger") {
        const drillMachine = addDetailTurbine(group, 0xb85e3d, 1.32);
        drillMachine.position.set(-0.7, -0.35, -0.2);
        const drillHead = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 2.35, 1.8, 18), accent);
        drillHead.rotation.z = -Math.PI / 2;
        drillHead.position.set(4.15, -0.35, -0.2);
        group.add(drillHead);
        addBox(group, [12, 0.16, 1], [0, 1.5, 3.3], detailMetalMat);
      } else if (zone.scene === "gap") {
        const basin = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.18, 9), new THREE.MeshPhysicalMaterial({ color: 0x35616a, transparent: true, opacity: 0.7, roughness: 0.12 }));
        basin.position.y = -2.35;
        group.add(basin);
        addBox(group, [12, 0.16, 1.15], [0, -1.5, 2.7], detailMetalMat);
        for (let i = 0; i < 4; i += 1) {
          const pump = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, 2.2, 18), accent);
          pump.position.set(-4.5 + i * 3, -1.2, -3.5);
          group.add(pump);
        }
      } else if (zone.scene === "tunnel") {
        const tunnel = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 3.5, 11, 36, 1, true), new THREE.MeshStandardMaterial({ color: 0x41443e, side: THREE.BackSide, roughness: 0.9 }));
        tunnel.rotation.x = Math.PI / 2;
        tunnel.position.z = 0.3;
        group.add(tunnel);
        const smartDoor = new THREE.Mesh(new THREE.CylinderGeometry(3.25, 3.25, 0.4, 48), detailMetalMat);
        smartDoor.rotation.x = Math.PI / 2;
        smartDoor.position.z = -4.4;
        group.add(smartDoor);
        const smartRing = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.17, 10, 48), accent);
        smartRing.position.z = -4.63;
        group.add(smartRing);
      } else if (zone.scene === "mine") {
        for (let z = -3.5; z <= 3.5; z += 1.75) {
          addBox(group, [11.5, 0.12, 0.12], [0, -2.2, z], detailMetalMat);
          addBox(group, [0.18, 5.2, 0.18], [-5.5, -0.1, z], mineMat);
          addBox(group, [0.18, 5.2, 0.18], [5.5, -0.1, z], mineMat);
          addBox(group, [11.2, 0.22, 0.22], [0, 2.35, z], mineMat);
        }
        for (const x of [-0.65, 0.65]) addBox(group, [0.12, 0.08, 9], [x, -2.02, 0], accent);
        addBox(group, [2.1, 1.2, 2.4], [2.4, -1.35, -0.5], detailMetalMat);
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
    <main className="silo-app">
      <header className="topbar">
        <div className="brand-lockup"><SiloMark /><div><span className="eyebrow">THE LAST CITY</span><strong>SILO</strong></div></div>
        <div className="archive-title"><span>STRUCTURAL ARCHIVE</span><b>18 / INTERNAL</b></div>
        <div className="topbar__right">
          <span className="system-status"><i /> SYSTEM NOMINAL</span>
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
        <div className="zone-meta"><span className="zone-number">{selected.code}</span><b className={`canon-badge canon-badge--${selected.canon.toLowerCase()}`}>{selected.canon}</b></div>
        <h1>{selected.name}</h1><p className="zone-levels">{selected.levels}</p><p className="zone-copy">{selected.description}</p>
        <div className="section-actions">
          {viewMode !== "overview" && <button className="section-actions__back" onClick={showOverview}><ArrowLeft size={15} /> FULL SILO</button>}
          <button className="section-actions__primary" onClick={selected.scene === "network" ? showNetwork : showSection}>{selected.scene === "network" ? <Network size={15} /> : <Box size={15} />}{selected.scene === "network" ? "OPEN NETWORK" : "OPEN 3D SECTION"}</button>
        </div>
        <div className="intel-rule" /><span className="section-label">KNOWN INSTALLATIONS</span>
        <ul className="installation-list">{selected.details.map((detail, index) => <li key={detail}><span>{String(index + 1).padStart(2, "0")}</span>{detail}</li>)}</ul>
        <div className="system-card">
          <div><Wind size={16} /><span>AIR</span><b>98.4%</b></div>
          <div><Gauge size={16} /><span>POWER</span><b>{selected.id === "mechanical" ? "94.1%" : "87.2%"}</b></div>
          <div><ShieldAlert size={16} /><span>ACCESS</span><b>{selected.status === "CLASSIFIED" ? "DENIED" : "PACT"}</b></div>
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
            <div className="help-grid"><div><b>OVERVIEW</b><span>144 levels plus the buried undercroft</span></div><div><b>SECTION</b><span>Enter a purpose-built 3D diorama</span></div><div><b>BELOW</b><span>Digger, water, tunnel and mines</span></div><div><b>NETWORK</b><span>Compare 18, 17, 1 and Seed routes</span></div><div><b>SERIES</b><span>Directly established on screen</span></div><div><b>BOOKS / RECONSTRUCTION</b><span>Clearly labeled alternate or inferred lore</span></div></div>
            <button className="primary-button" onClick={() => setHelp(false)}>ENTER ARCHIVE <ChevronRight size={16} /></button>
          </div>
        </div>
      )}
    </main>
  );
}
