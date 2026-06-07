export interface CruiseLine {
  id: string;
  name: string;
  short: string;
  ship: string;
  /** Tailwind-friendly hex used for charts & accents */
  color: string;
}

export interface Excursion {
  id: string;
  name: string;
  location: string;
  durationHrs: number;
}

export interface LineBooking {
  lineId: string;
  pax: number;
}

export interface Slot {
  id: string;
  /** ISO date, e.g. 2026-06-08 */
  date: string;
  /** 24h time, e.g. "11:00" */
  time: string;
  excursionId: string;
  capacity: number;
  bookings: LineBooking[];
}

export type ManifestStatus = "imported" | "processing" | "review" | "failed";

export interface Manifest {
  id: string;
  lineId: string;
  vessel: string;
  fileName: string;
  fileType: "xlsx" | "pdf" | "csv";
  receivedAt: string; // ISO datetime
  callDate: string; // ISO date the manifest covers
  pax: number;
  status: ManifestStatus;
}

export type AlertLevel = "critical" | "warning" | "info";

export interface AlertItem {
  id: string;
  level: AlertLevel;
  title: string;
  detail: string;
  time: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** Optional structured payload the assistant renders as a chip/table */
  data?: ChatData;
  ts: number;
}

export interface ChatData {
  kind: "kpi" | "table" | "list";
  title?: string;
  kpi?: { value: string; label: string; sub?: string };
  rows?: { label: string; value: string; pct?: number; color?: string }[];
}
