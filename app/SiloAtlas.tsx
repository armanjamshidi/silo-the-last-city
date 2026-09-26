"use client";

import { useMemo, useState } from "react";
import { Activity, BookOpen, Network, Radio, Route, ShieldAlert, Zap } from "lucide-react";

type AtlasView = "field" | "connections" | "levels";
type FieldLayout = "operations" | "visual";
type RelationLayer = "command" | "safeguard" | "events" | "books";
type FloorPlanId = "tv18" | "tv17" | "book" | "silo1";

type FieldNode = {
  id: number;
  cluster: number;
  x: number;
  y: number;
};

type FloorAnchor = {
  level: number;
  end?: number;
  label: string;
  note: string;
  certainty: "SCREEN" | "BOOK" | "FAN" | "RECON";
};

type FloorPlan = {
  id: FloorPlanId;
  label: string;
  title: string;
  subtitle: string;
  maxLevel: number;
  anchors: FloorAnchor[];
};

const FIELD_CENTER = { x: 380, y: 245 };
const OPERATIONAL_GROUPS = [7, 7, 7, 7, 7, 7, 7];
const VISUAL_GROUPS = [8, 8, 7, 7, 7, 7, 5];

const FLOOR_PLANS: FloorPlan[] = [
  {
    id: "tv18",
    label: "TV · 18",
    title: "SILO 18 / SERIES INDEX",
    subtitle: "Screen anchors plus clearly marked reconstruction bands; 144 occupied levels.",
    maxLevel: 154,
    anchors: [
      { level: 1, label: "Civic crown", note: "Cafeteria, sensor gallery, sheriff and cleaning route.", certainty: "SCREEN" },
      { level: 14, end: 16, label: "Judicial", note: "Authority district and the physical Safeguard inlet.", certainty: "SCREEN" },
      { level: 19, label: "I.T. / Vault", note: "TV-floor index cross-checked by fan frame analysis.", certainty: "FAN" },
      { level: 47, end: 69, label: "The Mids", note: "Residential, education, clinics and markets; broad archive band.", certainty: "RECON" },
      { level: 70, end: 81, label: "Farms", note: "Stacked food-production band; exact boundaries remain partial.", certainty: "RECON" },
      { level: 90, end: 120, label: "Supply", note: "Storage, recycling and fabrication band.", certainty: "RECON" },
      { level: 130, end: 144, label: "Mechanical", note: "Generator, workshops, control and lower residential spaces.", certainty: "SCREEN" },
      { level: 148, end: 154, label: "Undercroft", note: "Digger, flooded Gap, intelligent door and uncertain mines.", certainty: "SCREEN" },
    ],
  },
  {
    id: "tv17",
    label: "TV · 17",
    title: "SILO 17 / SERIES CONDITION MAP",
    subtitle: "A condition map, not a complete level register; exact floor numbers are mostly undisclosed.",
    maxLevel: 154,
    anchors: [
      { level: 1, label: "Surface / airlock", note: "Original revolt route and the later Season 3 drone-kill zone.", certainty: "SCREEN" },
      { level: 18, label: "I.T. approach", note: "Destroyed bridge and the sealed Vault occupied by Solo.", certainty: "SCREEN" },
      { level: 20, end: 69, label: "Upper survivor zone", note: "Habitable pockets and improvised routes above the waterline.", certainty: "RECON" },
      { level: 70, end: 144, label: "Flooded lower silo", note: "Long-submerged levels reached with improvised diving equipment.", certainty: "SCREEN" },
      { level: 148, end: 154, label: "Sub-foundation", note: "Possible construction corridors remain unverified in series continuity.", certainty: "RECON" },
    ],
  },
  {
    id: "book",
    label: "BOOK · 2–50",
    title: "STANDARD SILO / FAN BOOK MAP",
    subtitle: "Reader reconstruction from Wool, Shift and Dust; never merged with TV level numbers.",
    maxLevel: 148,
    anchors: [
      { level: 1, label: "Cafeteria / sheriff", note: "Upper lounge, civic offices and airlock.", certainty: "BOOK" },
      { level: 8, end: 32, label: "Upper farms & services", note: "Nurseries, schools, hydroponics, sanitation and water.", certainty: "FAN" },
      { level: 33, end: 35, label: "I.T.", note: "Book-continuity placement, different from the television silo.", certainty: "BOOK" },
      { level: 38, end: 99, label: "Mids", note: "Housing, gardens, dispatch, farms, shops and church.", certainty: "FAN" },
      { level: 100, label: "Bazaar", note: "Major commercial exchange level.", certainty: "BOOK" },
      { level: 108, end: 120, label: "Supply", note: "Warehousing and manufacturing; several intervening levels unknown.", certainty: "BOOK" },
      { level: 126, end: 137, label: "Lower farms / housing", note: "Agriculture, water treatment and apartments.", certainty: "FAN" },
      { level: 140, end: 147, label: "Mechanical", note: "Eight-level estimate conflicts with the 144-level TV shorthand.", certainty: "FAN" },
      { level: 148, label: "Small mine", note: "High-confidence reader placement in the published fan sheet.", certainty: "FAN" },
    ],
  },
  {
    id: "silo1",
    label: "BOOK · 1",
    title: "SILO 1 / FAN BOOK MAP",
    subtitle: "A shorter command structure reconstructed from the book continuity; TV geometry is unrevealed.",
    maxLevel: 70,
    anchors: [
      { level: 1, label: "Cafeteria / viewing wall", note: "Upper lounge and observation space.", certainty: "BOOK" },
      { level: 10, end: 12, label: "Living / gym", note: "Apartments are inferred; the gym is placed at level 12.", certainty: "FAN" },
      { level: 34, label: "Operations", note: "Administrative command and monitoring center.", certainty: "BOOK" },
      { level: 37, end: 44, label: "Living band", note: "Apartments and general living levels.", certainty: "FAN" },
      { level: 45, end: 64, label: "Storage band", note: "Large reserve block; levels 50–59 are the strongest anchors.", certainty: "BOOK" },
      { level: 54, label: "Armory / UAV stores", note: "Weapons, armor, medical stock, rations and unmanned aircraft.", certainty: "BOOK" },
      { level: 65, end: 67, label: "Mechanical / reactor", note: "Reader reconstruction around the power core.", certainty: "FAN" },
      { level: 68, label: "Power / medical / Shift", note: "Power plant, medical, deep freeze and Shift office.", certainty: "BOOK" },
      { level: 69, end: 70, label: "Deep freeze", note: "Cryogenic lower band in book continuity.", certainty: "BOOK" },
    ],
  },
];

const COPY = {
  en: {
    kicker: "DECLASSIFIED NETWORK ATLAS",
    title: "OPERATION FIFTY",
    spoiler: "Season 3 complete · finale spoilers",
    field: "FIELD MAP",
    connections: "CONNECTIONS",
    levels: "LEVEL ATLAS",
    operations: "BERNARD 7×7",
    visual: "SCREEN GROUPING",
    command: "COMMAND",
    safeguard: "SAFEGUARD",
    events: "S3 EVENTS",
    books: "BOOK ROUTE",
    mapNoteOperations: "Functional diagram: seven groups of seven around Silo 1. Number-to-cluster placement is diagrammatic because the series has not published a numbered site plan.",
    mapNoteVisual: "Fan count of the on-screen/trailer grouping: 8 / 8 / 7 / 7 / 7 / 7 / 5, plus Silo 1. It is kept separate from Bernard’s 7×7 operational claim.",
    select: "SELECTED STRUCTURE",
    unknown: "Exact condition and operational cluster are not disclosed.",
    sources: "MAP SOURCES",
  },
  fa: {
    kicker: "اطلس رمزگشایی‌شدهٔ شبکه",
    title: "عملیات پنجاه",
    spoiler: "فصل ۳ کامل · دارای اسپویل قسمت پایانی",
    field: "نقشهٔ میدان",
    connections: "ارتباط‌ها",
    levels: "اطلس طبقات",
    operations: "مدل ۷×۷ برنارد",
    visual: "گروه‌بندی تصویری",
    command: "فرماندهی",
    safeguard: "سیف‌گارد",
    events: "رویدادهای فصل ۳",
    books: "مسیر کتاب",
    mapNoteOperations: "نمودار کارکردی: هفت گروهِ هفت‌تایی پیرامون سیلوی ۱. جای شماره‌ها در خوشه‌ها شماتیک است، چون سریال هنوز نقشهٔ شماره‌گذاری‌شدهٔ رسمی منتشر نکرده.",
    mapNoteVisual: "شمارش طرفداران از گروه‌بندی تصویر/تریلر: ۸ / ۸ / ۷ / ۷ / ۷ / ۷ / ۵، به‌علاوهٔ سیلوی ۱. این لایه عمداً از ادعای عملیاتی ۷×۷ برنارد جداست.",
    select: "سازهٔ انتخاب‌شده",
    unknown: "وضعیت دقیق و خوشهٔ عملیاتی آن فاش نشده است.",
    sources: "منابع نقشه",
  },
} as const;

function buildFieldNodes(groupSizes: number[]): FieldNode[] {
  let nextId = 2;
  const nodes: FieldNode[] = [];
  groupSizes.forEach((size, cluster) => {
    const clusterAngle = -Math.PI / 2 + (cluster / 7) * Math.PI * 2;
    const clusterRadius = 170;
    const centerX = FIELD_CENTER.x + Math.cos(clusterAngle) * clusterRadius;
    const centerY = FIELD_CENTER.y + Math.sin(clusterAngle) * clusterRadius;
    const nodeRadius = size === 8 ? 39 : 36;
    for (let index = 0; index < size; index += 1) {
      const nodeAngle = clusterAngle + Math.PI + (index / size) * Math.PI * 2;
      nodes.push({
        id: nextId,
        cluster,
        x: centerX + Math.cos(nodeAngle) * nodeRadius,
        y: centerY + Math.sin(nodeAngle) * nodeRadius,
      });
      nextId += 1;
    }
  });
  return nodes;
}

function siloSummary(id: number, language: "en" | "fa") {
  if (id === 1) {
    return language === "fa"
      ? { title: "سیلوی ۱ · فرماندهی", body: "مرکز انسانی کنترل و پایش. در قسمت پایانی دکتر ویکتور کرنکوویچ به‌عنوان اپراتور صدا آشکار می‌شود.", status: "فعال / فرماندهی" }
      : { title: "SILO 1 · COMMAND", body: "Human command and monitoring center. The finale identifies Dr. Victor Crnkovich as the voice operator.", status: "ACTIVE / COMMAND" };
  }
  if (id === 17) {
    return language === "fa"
      ? { title: "سیلوی ۱۷ · سقوط‌کرده", body: "طبقات پایین آب‌گرفته و پل I.T. ویران است؛ در S3E10 ساکنان بیرون‌آمده با پهپادهای سیلوی ۱ کشته می‌شوند.", status: "نابودشده / رویداد S3E10" }
      : { title: "SILO 17 · FAILED", body: "Lower levels are flooded and the I.T. bridge is broken; in S3E10 the people who emerge are killed by Silo 1 drones.", status: "FAILED / S3E10 EVENT" };
  }
  if (id === 18) {
    return language === "fa"
      ? { title: "سیلوی ۱۸ · مقاومت", body: "جولیِت و شورشیان ورودی سیف‌گارد را مهار می‌کنند، با درِ زیر Digger ارتباط می‌گیرند و حمله به سیلوی ۱ را طرح می‌کنند.", status: "فعال / شورش" }
      : { title: "SILO 18 · RESISTANCE", body: "Juliette’s group clamps the Safeguard inlet, reaches the door below the digger and begins planning a strike on Silo 1.", status: "ACTIVE / REBELLION" };
  }
  return language === "fa"
    ? { title: `سیلوی ${id}`, body: COPY.fa.unknown, status: "نامشخص" }
    : { title: `SILO ${id}`, body: COPY.en.unknown, status: "UNDISCLOSED" };
}

function FieldMap({ language }: { language: "en" | "fa" }) {
  const [layout, setLayout] = useState<FieldLayout>("operations");
  const [relation, setRelation] = useState<RelationLayer>("command");
  const [selectedSilo, setSelectedSilo] = useState(18);
  const groups = layout === "operations" ? OPERATIONAL_GROUPS : VISUAL_GROUPS;
  const nodes = useMemo(() => buildFieldNodes(layout === "operations" ? OPERATIONAL_GROUPS : VISUAL_GROUPS), [layout]);
  const selected = siloSummary(selectedSilo, language);
  const clusterCenters = useMemo(() => Array.from({ length: 7 }, (_, cluster) => {
    const angle = -Math.PI / 2 + (cluster / 7) * Math.PI * 2;
    return { x: FIELD_CENTER.x + Math.cos(angle) * 170, y: FIELD_CENTER.y + Math.sin(angle) * 170 };
  }), []);
  const silo17 = nodes.find((node) => node.id === 17);
  const silo18 = nodes.find((node) => node.id === 18);

  return (
    <div className="atlas-field">
      <div className="atlas-subcontrols">
        <label className="atlas-picker">
          <span>{language === "fa" ? "انتخاب سیلو" : "Select silo"}</span>
          <select value={selectedSilo} onChange={(event) => setSelectedSilo(Number(event.target.value))}>
            {Array.from({ length: 50 }, (_, index) => index + 1).map((id) => <option key={id} value={id}>{language === "fa" ? `سیلوی ${id}` : `Silo ${id}`}</option>)}
          </select>
        </label>
        <div className="atlas-segment" role="group" aria-label="Field layout">
          <button className={layout === "operations" ? "active" : ""} onClick={() => setLayout("operations")}>{COPY[language].operations}</button>
          <button className={layout === "visual" ? "active" : ""} onClick={() => setLayout("visual")}>{COPY[language].visual}</button>
        </div>
        <div className="atlas-relations" role="group" aria-label="Connection layer">
          <button className={relation === "command" ? "active relation-command" : ""} onClick={() => setRelation("command")}><Radio size={13} />{COPY[language].command}</button>
          <button className={relation === "safeguard" ? "active relation-safeguard" : ""} onClick={() => setRelation("safeguard")}><ShieldAlert size={13} />{COPY[language].safeguard}</button>
          <button className={relation === "events" ? "active relation-events" : ""} onClick={() => setRelation("events")}><Activity size={13} />{COPY[language].events}</button>
          <button className={relation === "books" ? "active relation-books" : ""} onClick={() => setRelation("books")}><BookOpen size={13} />{COPY[language].books}</button>
        </div>
      </div>

      <div className="atlas-field__body">
        <svg className={`field-svg field-svg--${relation}`} viewBox="0 0 760 500" role="group" aria-label="Map of Silo 1 and forty-nine outer silos">
          <defs>
            <radialGradient id="siloNode" cx="35%" cy="30%">
              <stop offset="0" stopColor="#6c716a" />
              <stop offset="1" stopColor="#252822" />
            </radialGradient>
            <marker id="fieldArrowDanger" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#c35c4b" /></marker>
            <filter id="atlasGlow"><feGaussianBlur stdDeviation="4" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <circle className="field-orbit" cx={FIELD_CENTER.x} cy={FIELD_CENTER.y} r="170" />
          {clusterCenters.map((center, index) => (
            <g key={`cluster-${index}`}>
              <circle className="field-cluster" cx={center.x} cy={center.y} r="53" />
              <text className="field-cluster__label" x={center.x} y={center.y - 58}>{String.fromCharCode(65 + index)} · {groups[index]}</text>
              {(relation === "command" || relation === "safeguard") && (
                <line className={`field-link field-link--${relation}`} x1={FIELD_CENTER.x} y1={FIELD_CENTER.y} x2={center.x} y2={center.y} />
              )}
            </g>
          ))}
          {relation === "events" && silo17 && <path className="field-link field-link--drone" markerEnd="url(#fieldArrowDanger)" d={`M ${FIELD_CENTER.x} ${FIELD_CENTER.y} Q 460 135 ${silo17.x} ${silo17.y}`} />}
          {relation === "books" && silo17 && silo18 && <line className="field-link field-link--book" x1={silo17.x} y1={silo17.y} x2={silo18.x} y2={silo18.y} />}
          <g className={`field-node field-node--1 ${selectedSilo === 1 ? "selected" : ""}`} role="button" aria-label="Silo 1" aria-pressed={selectedSilo === 1} tabIndex={0} onClick={() => setSelectedSilo(1)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedSilo(1); } }}>
            <circle cx={FIELD_CENTER.x} cy={FIELD_CENTER.y} r="27" />
            <text x={FIELD_CENTER.x} y={FIELD_CENTER.y + 4}>01</text>
            <text className="field-node__role" x={FIELD_CENTER.x} y={FIELD_CENTER.y + 42}>COMMAND</text>
          </g>
          {nodes.map((node) => {
            const status = node.id === 17 ? "failed" : node.id === 18 ? "resistance" : "unknown";
            return (
              <g key={node.id} className={`field-node field-node--${status} ${selectedSilo === node.id ? "selected" : ""}`} role="button" aria-pressed={selectedSilo === node.id} tabIndex={0} onClick={() => setSelectedSilo(node.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelectedSilo(node.id); } }} aria-label={`Silo ${node.id}`}>
                <circle cx={node.x} cy={node.y} r={node.id === 17 || node.id === 18 ? 13 : 10} />
                <text x={node.x} y={node.y + 3}>{String(node.id).padStart(2, "0")}</text>
              </g>
            );
          })}
          {relation === "events" && silo17 && <text className="field-event-label" x={silo17.x + 18} y={silo17.y - 15}>S3E10 · DRONES</text>}
          {relation === "books" && silo17 && silo18 && <text className="field-event-label field-event-label--book" x={(silo17.x + silo18.x) / 2 + 12} y={(silo17.y + silo18.y) / 2 - 8}>17↔18 · BOOK</text>}
        </svg>
        <aside className="atlas-selection">
          <span>{COPY[language].select}</span>
          <h3>{selected.title}</h3>
          <b>{selected.status}</b>
          <p>{selected.body}</p>
          <div className="atlas-count"><strong>50</strong><small>{language === "fa" ? "۱ مرکز + ۴۹ سیلوی بیرونی" : "1 CENTER + 49 OUTER SILOS"}</small></div>
        </aside>
      </div>
      <p className="atlas-disclaimer">{layout === "operations" ? COPY[language].mapNoteOperations : COPY[language].mapNoteVisual}</p>
    </div>
  );
}

function ConnectionMap({ language }: { language: "en" | "fa" }) {
  const fa = language === "fa";
  return (
    <div className="connection-atlas">
      <svg className="connection-svg" viewBox="0 0 780 460" role="img" aria-label="Control, power, Safeguard, radio, drone and book-route connections">
        <defs>
          <marker id="arrowControl" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#76a9aa" /></marker>
          <marker id="arrowPower" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#d4ad68" /></marker>
          <marker id="arrowDanger" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#c35c4b" /></marker>
        </defs>
        <rect className="connection-zone connection-zone--one" x="32" y="117" width="168" height="226" rx="18" />
        <text className="connection-zone__title" x="116" y="147">SILO 1</text>
        <text className="connection-zone__sub" x="116" y="167">COMMAND / HUMAN OPERATORS</text>
        <rect className="connection-node" x="63" y="195" width="106" height="42" rx="8" />
        <text className="connection-node__text" x="116" y="220">CONTROL</text>
        <rect className="connection-node" x="63" y="253" width="106" height="42" rx="8" />
        <text className="connection-node__text" x="116" y="278">POWER / UAV</text>

        <rect className="connection-zone connection-zone--hub" x="277" y="168" width="150" height="124" rx="18" />
        <text className="connection-zone__title" x="352" y="203">CLUSTER HUB?</text>
        <text className="connection-zone__sub" x="352" y="224">BERNARD&apos;S THEORY</text>
        <text className="connection-zone__sub" x="352" y="244">PHYSICAL NODE UNKNOWN</text>

        <rect className="connection-zone connection-zone--eighteen" x="512" y="35" width="235" height="296" rx="18" />
        <text className="connection-zone__title" x="629" y="64">SILO 18</text>
        <rect className="connection-node" x="546" y="85" width="168" height="43" rx="8" />
        <text className="connection-node__text" x="630" y="111">I.T. / VAULT · L19</text>
        <rect className="connection-node connection-node--danger" x="546" y="151" width="168" height="43" rx="8" />
        <text className="connection-node__text" x="630" y="177">JUDICIAL / INLET</text>
        <rect className="connection-node" x="546" y="217" width="168" height="43" rx="8" />
        <text className="connection-node__text" x="630" y="243">BOTTOM DOOR / VOICE</text>
        <rect className="connection-node" x="546" y="283" width="168" height="27" rx="8" />
        <text className="connection-node__text connection-node__text--small" x="630" y="301">INTERVENTION: PIPE CLAMPED</text>

        <rect className="connection-zone connection-zone--seventeen" x="512" y="363" width="235" height="72" rx="18" />
        <text className="connection-zone__title" x="629" y="392">SILO 17 / SURFACE</text>
        <text className="connection-zone__sub" x="629" y="412">S3E10 · DRONE KILL ZONE</text>

        <path className="connection-line connection-line--control" d="M169 207 C300 90 405 90 546 105" markerEnd="url(#arrowControl)" />
        <text className="connection-label connection-label--control" x="327" y="93">COMMAND / MONITORING</text>
        <path className="connection-line connection-line--power" d="M169 274 C315 328 405 126 546 117" markerEnd="url(#arrowPower)" />
        <text className="connection-label connection-label--power" x="315" y="327">EXTERNAL I.T. POWER</text>
        <path className="connection-line connection-line--safeguard" d="M200 225 L277 225 M427 225 C472 225 498 173 546 173" markerEnd="url(#arrowDanger)" />
        <text className="connection-label connection-label--safeguard" x="344" y="157">SAFEGUARD ROUTING · THEORY</text>
        <path className="connection-line connection-line--voice" d="M169 215 C310 356 421 255 546 239" markerEnd="url(#arrowControl)" />
        <text className="connection-label connection-label--control" x="340" y="349">HUMAN VOICE / DATA</text>
        <path className="connection-line connection-line--drone" d="M169 283 C298 430 405 402 512 399" markerEnd="url(#arrowDanger)" />
        <text className="connection-label connection-label--danger" x="317" y="427">UAV STRIKE · S3E10</text>
        <path className="connection-line connection-line--book" d="M546 320 C500 337 497 352 546 373" />
        <text className="connection-label connection-label--book" x="430" y="348">18↔17 EXCAVATION · BOOK ONLY</text>
      </svg>
      <div className="connection-ledger">
        <article><Radio size={16} /><div><b>{fa ? "کنترل و پایش" : "CONTROL & MONITORING"}</b><p>{fa ? "وجود فرماندهی سیلوی ۱ و ارتباط آن با سیلوها قطعی است؛ مسیر کابل‌ها هنوز کامل دیده نشده." : "Silo 1 command and inter-silo monitoring are confirmed; the complete cable route is not yet visible."}</p></div><em>ON SCREEN</em></article>
        <article><Zap size={16} /><div><b>{fa ? "برق مستقل I.T." : "INDEPENDENT I.T. POWER"}</b><p>{fa ? "فید بیرونی I.T. از شبکهٔ عمومی سیلو جداست." : "The external I.T. feeder is separate from the silo’s public grid."}</p></div><em>ON SCREEN</em></article>
        <article><ShieldAlert size={16} /><div><b>{fa ? "مسیر سیف‌گارد" : "SAFEGUARD ROUTE"}</b><p>{fa ? "ورودی فیزیکی Judicial قطعی است؛ عبور سلسله‌مراتبی از هاب‌ها نظریهٔ برنارد است." : "The physical Judicial inlet is confirmed; hierarchical routing through hubs is Bernard’s theory."}</p></div><em>SCREEN + THEORY</em></article>
        <article><Route size={16} /><div><b>{fa ? "تونل عبور انسان" : "HUMAN TRANSIT"}</b><p>{fa ? "مسیر ۱۸↔۱۷ و Seed متعلق به کتاب است؛ متروی آماده میان همهٔ سیلوها در سریال تأیید نشده." : "The 18↔17 and Seed routes are book canon; a ready-made all-silo metro is not confirmed by the series."}</p></div><em>BOOK / UNCONFIRMED</em></article>
      </div>
    </div>
  );
}

function LevelAtlas({ language }: { language: "en" | "fa" }) {
  const [planId, setPlanId] = useState<FloorPlanId>("tv18");
  const plan = FLOOR_PLANS.find((item) => item.id === planId) ?? FLOOR_PLANS[0];
  const fa = language === "fa";
  return (
    <div className="level-atlas">
      <div className="level-atlas__tabs" role="tablist" aria-label="Silo floor plans">
        {FLOOR_PLANS.map((item) => <button key={item.id} className={plan.id === item.id ? "active" : ""} onClick={() => setPlanId(item.id)} role="tab" aria-selected={plan.id === item.id}>{item.label}</button>)}
      </div>
      <div className="level-atlas__heading"><div><span>{fa ? "ثبت عمودی" : "VERTICAL REGISTER"}</span><h3>{plan.title}</h3><p>{plan.subtitle}</p></div><strong>{plan.maxLevel <= 70 ? "70" : "144"}<small>{fa ? " طبقهٔ اصلی" : " PRIMARY LEVELS"}</small></strong></div>
      <div className="floor-plan">
        <div className="floor-plan__shaft" aria-hidden="true">
          <span className="floor-plan__top">01</span><span className="floor-plan__bottom">{String(plan.maxLevel).padStart(2, "0")}</span>
          {Array.from({ length: 18 }, (_, index) => <i key={index} />)}
        </div>
        <div className="floor-plan__anchors">
          {plan.anchors.map((anchor) => (
            <article key={`${anchor.level}-${anchor.label}`} className={`floor-anchor floor-anchor--${anchor.certainty.toLowerCase()}`}>
              <span>{anchor.end ? `L${anchor.level}—${anchor.end}` : `L${anchor.level}`}</span>
              <div><b>{anchor.label}</b><small>{anchor.note}</small></div>
              <em>{anchor.certainty}</em>
            </article>
          ))}
        </div>
      </div>
      <p className="atlas-disclaimer">{fa ? "شماره‌های کتاب و سریال دو تداوم جدا هستند. درصدهای اطمینانِ نقشهٔ طرفداران به برچسب FAN/RECON تبدیل شده‌اند و به‌عنوان واقعیت سریال نمایش داده نمی‌شوند." : "Book and television levels are separate continuities. Fan-sheet confidence estimates are shown as FAN/RECON and are never promoted to series fact."}</p>
    </div>
  );
}

export default function SiloAtlas({ language }: { language: "en" | "fa" }) {
  const [view, setView] = useState<AtlasView>("field");
  const copy = COPY[language];
  return (
    <section className="silo-atlas" dir={language === "fa" ? "rtl" : "ltr"} aria-label="Silo network and level atlas">
      <header className="silo-atlas__header">
        <div><span>{copy.kicker}</span><h2>{copy.title}</h2><small>{copy.spoiler}</small></div>
        <div className="silo-atlas__tabs" role="tablist" aria-label="Atlas view">
          <button className={view === "field" ? "active" : ""} onClick={() => setView("field")} role="tab" aria-selected={view === "field"}><Network size={15} />{copy.field}</button>
          <button className={view === "connections" ? "active" : ""} onClick={() => setView("connections")} role="tab" aria-selected={view === "connections"}><Route size={15} />{copy.connections}</button>
          <button className={view === "levels" ? "active" : ""} onClick={() => setView("levels")} role="tab" aria-selected={view === "levels"}><BookOpen size={15} />{copy.levels}</button>
        </div>
      </header>
      <div className="silo-atlas__viewport">
        {view === "field" && <FieldMap language={language} />}
        {view === "connections" && <ConnectionMap language={language} />}
        {view === "levels" && <LevelAtlas language={language} />}
      </div>
      <footer className="silo-atlas__footer">
        <div className="atlas-events"><span><b>S3E8</b> 50 SILOS · 10 DIGGERS · 7×7 THEORY</span><span><b>S3E10</b> SILO 17 UAV STRIKE · SILO 1 OPERATOR · STRIKE PLAN</span></div>
        <nav aria-label={copy.sources}><span>{copy.sources}</span><a href="https://www.apple.com/tv-pr/originals/silo/episodes-images/" target="_blank" rel="noreferrer">APPLE EPISODES</a><a href="https://people.com/silo-season-3-ending-explained-12075887" target="_blank" rel="noreferrer">FINALE</a><a href="https://www.reddit.com/r/SiloSeries/comments/1vvf5t0/question_about_the_silo_clusters_the_season_3/" target="_blank" rel="noreferrer">FAN CLUSTERS</a><a href="https://www.reddit.com/r/Wool/comments/hcgi99/a_map_of_the_silos_levels/" target="_blank" rel="noreferrer">FAN LEVELS</a></nav>
      </footer>
    </section>
  );
}
