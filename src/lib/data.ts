import type {
  AlertItem,
  CruiseLine,
  Excursion,
  Manifest,
  Slot,
} from "./types";

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-random helpers so the demo data is stable
 * per-calendar-date (same numbers on every reload of a given day).
 * ------------------------------------------------------------------ */
function hashString(str: string): number {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rngFor = (key: string) => mulberry32(hashString(key));
const pick = <T>(rng: () => number, arr: T[]) =>
  arr[Math.floor(rng() * arr.length)];
const between = (rng: () => number, lo: number, hi: number) =>
  Math.round(lo + rng() * (hi - lo));

/* ------------------------------------------------------------------ */

export const CRUISE_LINES: CruiseLine[] = [
  { id: "pri", name: "Princess Cruises", short: "Princess", ship: "Sapphire Princess", color: "#3a37f5" },
  { id: "hal", name: "Holland America", short: "Holland", ship: "Nieuw Amsterdam", color: "#2bb8e6" },
  { id: "ncl", name: "Norwegian", short: "Norwegian", ship: "Norwegian Bliss", color: "#7c84ff" },
  { id: "rcl", name: "Royal Caribbean", short: "Royal", ship: "Radiance of the Seas", color: "#a78bfa" },
  { id: "cel", name: "Celebrity Cruises", short: "Celebrity", ship: "Celebrity Solstice", color: "#5cd2f5" },
  { id: "car", name: "Carnival", short: "Carnival", ship: "Carnival Spirit", color: "#f59e0b" },
];

export const EXCURSIONS: Excursion[] = [
  { id: "mend", name: "Mendenhall Glacier & Whale Watch", location: "Juneau, AK", durationHrs: 5 },
  { id: "tracy", name: "Tracy Arm Fjord Cruise", location: "Juneau, AK", durationHrs: 6 },
  { id: "whale", name: "Juneau Whale Watching", location: "Auke Bay, AK", durationHrs: 3 },
  { id: "dog", name: "Glacier Dog Sledding by Helicopter", location: "Juneau Icefield, AK", durationHrs: 4 },
  { id: "rain", name: "Rainforest & Wildlife Trek", location: "Tongass, AK", durationHrs: 3 },
  { id: "raft", name: "Mendenhall River Float", location: "Juneau, AK", durationHrs: 4 },
];

export const TIME_SLOTS = ["07:30", "09:00", "11:00", "13:00", "15:00", "17:00"];

/* --- Date helpers -------------------------------------------------- */
export function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}
export function addDays(base: Date, n: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}
export const TODAY = new Date();
export const TODAY_ISO = isoDate(TODAY);
export const TOMORROW_ISO = isoDate(addDays(TODAY, 1));

/** The 7-day operating window the dashboard plans against. */
export const DATE_WINDOW: string[] = Array.from({ length: 7 }, (_, i) =>
  isoDate(addDays(TODAY, i)),
);

export function dayLabel(iso: string): string {
  if (iso === TODAY_ISO) return "Today";
  if (iso === TOMORROW_ISO) return "Tomorrow";
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function prettyTime(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hr = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hr} ${ampm}` : `${hr}:${String(m).padStart(2, "0")} ${ampm}`;
}

/* --- Slot generation ---------------------------------------------- */
/**
 * Each day runs a rotating subset of excursions across the time grid.
 * Booking pressure ramps toward the front of the window (closer sailings
 * are fuller) which makes "nearly full" and capacity views meaningful.
 */
function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  DATE_WINDOW.forEach((date, dayIdx) => {
    const dayRng = rngFor("day-" + date);
    // 3-4 excursions operate per day
    const offered = [...EXCURSIONS]
      .sort(() => dayRng() - 0.5)
      .slice(0, 4);

    offered.forEach((exc, eIdx) => {
      // Each excursion runs at 2-3 times in the grid
      const times = TIME_SLOTS.filter(
        (_, i) => (i + eIdx) % 2 === 0 || dayRng() > 0.72,
      ).slice(0, 3);

      times.forEach((time) => {
        const rng = rngFor(`${date}-${exc.id}-${time}`);
        const capacity = pick(rng, [24, 36, 40, 48, 60, 72, 90]);
        // Fill ratio: high near the front of the window, mid-day peaks
        const peak = time === "09:00" || time === "11:00" ? 0.14 : 0;
        const base = 0.92 - dayIdx * 0.09 + peak;
        const fill = Math.min(1.02, Math.max(0.18, base + (rng() - 0.5) * 0.3));
        const booked = Math.min(capacity, Math.round(capacity * fill));

        // Distribute booked pax across a random 2-5 cruise lines
        const lineCount = between(rng, 2, 5);
        const chosen = [...CRUISE_LINES]
          .sort(() => rng() - 0.5)
          .slice(0, lineCount);
        const weights = chosen.map(() => 0.4 + rng());
        const wsum = weights.reduce((a, b) => a + b, 0);
        let assigned = 0;
        const bookings = chosen.map((line, i) => {
          let pax =
            i === chosen.length - 1
              ? booked - assigned
              : Math.round((weights[i] / wsum) * booked);
          pax = Math.max(0, pax);
          assigned += pax;
          return { lineId: line.id, pax };
        });

        slots.push({
          id: `${date}_${exc.id}_${time}`,
          date,
          time,
          excursionId: exc.id,
          capacity,
          bookings: bookings.filter((b) => b.pax > 0),
        });
      });
    });
  });
  return slots;
}

export const SLOTS: Slot[] = buildSlots();

/* --- Derived helpers ---------------------------------------------- */
export const slotBooked = (s: Slot) =>
  s.bookings.reduce((sum, b) => sum + b.pax, 0);
export const slotUtil = (s: Slot) => slotBooked(s) / s.capacity;
export const excursionName = (id: string) =>
  EXCURSIONS.find((e) => e.id === id)?.name ?? id;
export const lineById = (id: string) =>
  CRUISE_LINES.find((l) => l.id === id);

export function slotsOn(date: string): Slot[] {
  return SLOTS.filter((s) => s.date === date).sort((a, b) =>
    a.time.localeCompare(b.time),
  );
}

/* --- Manifests (the email-import inbox) --------------------------- */
function buildManifests(): Manifest[] {
  const out: Manifest[] = [];
  CRUISE_LINES.forEach((line, i) => {
    const rng = rngFor("manifest-" + line.id);
    const callDate = DATE_WINDOW[(i % 3)];
    const hrsAgo = between(rng, 1, 30);
    const received = new Date(TODAY.getTime() - hrsAgo * 3600_000);
    const ftype = pick(rng, ["xlsx", "pdf", "xlsx", "csv"] as const);
    const pax = CRUISE_LINES.reduce((acc) => acc, 0); // placeholder
    out.push({
      id: "mf_" + line.id,
      lineId: line.id,
      vessel: line.ship,
      fileName: `${line.short.toLowerCase().replace(/\s/g, "-")}_manifest_${callDate}.${ftype}`,
      fileType: ftype,
      receivedAt: received.toISOString(),
      callDate,
      pax: pax + between(rng, 180, 540),
      status: i === 4 ? "review" : i === 3 ? "processing" : "imported",
    });
  });
  return out.sort(
    (a, b) => +new Date(b.receivedAt) - +new Date(a.receivedAt),
  );
}

export const MANIFESTS: Manifest[] = buildManifests();

/* --- Alerts ------------------------------------------------------- */
export function buildAlerts(): AlertItem[] {
  const alerts: AlertItem[] = [];
  // Nearly-full slots tomorrow become capacity alerts
  const tmrw = slotsOn(TOMORROW_ISO)
    .filter((s) => slotUtil(s) >= 0.85)
    .sort((a, b) => slotUtil(b) - slotUtil(a))
    .slice(0, 2);

  tmrw.forEach((s, i) => {
    const util = Math.round(slotUtil(s) * 100);
    alerts.push({
      id: "al_cap_" + i,
      level: util >= 98 ? "critical" : "warning",
      title:
        util >= 98
          ? `${prettyTime(s.time)} ${excursionName(s.excursionId)} is sold out`
          : `${prettyTime(s.time)} ${excursionName(s.excursionId)} at ${util}%`,
      detail:
        util >= 98
          ? `Tomorrow — ${slotBooked(s)}/${s.capacity} booked. Add a departure or stop sell.`
          : `Tomorrow — ${s.capacity - slotBooked(s)} seats left across ${s.bookings.length} lines.`,
      time: "12m ago",
    });
  });

  const review = MANIFESTS.find((m) => m.status === "review");
  if (review) {
    alerts.push({
      id: "al_review",
      level: "warning",
      title: `${lineById(review.lineId)?.name} manifest needs review`,
      detail: `${review.fileName} — 3 names couldn't be auto-matched to a slot.`,
      time: "41m ago",
    });
  }

  const newImport = MANIFESTS.find((m) => m.status === "imported");
  if (newImport) {
    alerts.push({
      id: "al_import",
      level: "info",
      title: `Imported ${lineById(newImport.lineId)?.name} manifest`,
      detail: `${newImport.pax} pax synced from ${newImport.fileName}.`,
      time: "1h ago",
    });
  }

  alerts.push({
    id: "al_weather",
    level: "info",
    title: "Marine forecast: low ceiling AM",
    detail: "Helicopter tours may delay before 09:00 tomorrow. Monitoring.",
    time: "2h ago",
  });

  return alerts;
}

export const ALERTS = buildAlerts();
