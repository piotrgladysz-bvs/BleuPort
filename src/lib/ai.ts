import {
  CRUISE_LINES,
  DATE_WINDOW,
  TODAY_ISO,
  TOMORROW_ISO,
  dayLabel,
  excursionName,
  lineById,
  prettyTime,
  slotBooked,
  slotUtil,
  slotsOn,
} from "./data";
import type { ChatData, Slot } from "./types";

export interface AIResponse {
  text: string;
  data?: ChatData;
}

/* --- intent parsing helpers --------------------------------------- */
function resolveDate(q: string): { iso: string; label: string } {
  if (/\btoday\b/.test(q)) return { iso: TODAY_ISO, label: "today" };
  if (/\btomorrow\b/.test(q)) return { iso: TOMORROW_ISO, label: "tomorrow" };
  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];
  for (const iso of DATE_WINDOW) {
    const wd = weekdays[new Date(iso + "T00:00:00").getDay()];
    if (q.includes(wd)) return { iso, label: dayLabel(iso) };
  }
  // default to tomorrow — the operator's planning horizon
  return { iso: TOMORROW_ISO, label: "tomorrow" };
}

function resolveTime(q: string): string | null {
  // matches "11 am", "11am", "11:00", "9 a.m.", "1 pm"
  const m = q.match(/\b(\d{1,2})(?::(\d{2}))?\s*(a\.?m\.?|p\.?m\.?)?\b/i);
  if (!m) return null;
  let hour = parseInt(m[1], 10);
  const min = m[2] ? parseInt(m[2], 10) : 0;
  const mer = (m[3] || "").toLowerCase();
  if (mer.startsWith("p") && hour < 12) hour += 12;
  if (mer.startsWith("a") && hour === 12) hour = 0;
  // ignore bare small numbers that are likely not times unless meridiem/colon present
  if (!mer && !m[2] && (hour < 6 || hour > 19)) return null;
  return `${String(hour).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
}

function lineTotals(slots: Slot[]) {
  const totals = new Map<string, number>();
  slots.forEach((s) =>
    s.bookings.forEach((b) =>
      totals.set(b.lineId, (totals.get(b.lineId) ?? 0) + b.pax),
    ),
  );
  return [...totals.entries()].sort((a, b) => b[1] - a[1]);
}

/* --- main resolver ------------------------------------------------- */
export function answerQuestion(raw: string): AIResponse {
  const q = raw.toLowerCase().trim();

  /* 1 — How many sold {day} at {time}? */
  if (/(how many|number|count|sold|booked|pax)/.test(q) && /\bat\b|\b\d/.test(q)) {
    const time = resolveTime(q);
    if (time) {
      const { iso, label } = resolveDate(q);
      const slots = slotsOn(iso).filter((s) => s.time === time);
      const total = slots.reduce((a, s) => a + slotBooked(s), 0);
      const cap = slots.reduce((a, s) => a + s.capacity, 0);
      if (slots.length === 0) {
        return {
          text: `No departures are scheduled ${label} at ${prettyTime(time)}.`,
        };
      }
      const lt = lineTotals(slots);
      return {
        text: `**${total} guests** are booked ${label} at ${prettyTime(
          time,
        )} across ${slots.length} departure${slots.length > 1 ? "s" : ""} — that's ${Math.round(
          (total / cap) * 100,
        )}% of ${cap} seats.`,
        data: {
          kind: "kpi",
          kpi: {
            value: String(total),
            label: `booked · ${label} ${prettyTime(time)}`,
            sub: `${cap - total} seats remaining`,
          },
          rows: lt.map(([id, pax]) => ({
            label: lineById(id)?.name ?? id,
            value: `${pax}`,
            pct: Math.round((pax / total) * 100),
            color: lineById(id)?.color,
          })),
        },
      };
    }
  }

  /* 2 — Which slots are nearly full / almost sold out? */
  if (/(nearly full|almost full|almost sold|nearly sold|filling up|fullest|high demand|selling fast)/.test(q)) {
    const horizon = q.includes("today")
      ? [TODAY_ISO]
      : q.includes("tomorrow")
        ? [TOMORROW_ISO]
        : DATE_WINDOW.slice(0, 3);
    const slots = horizon
      .flatMap((d) => slotsOn(d))
      .filter((s) => slotUtil(s) >= 0.85)
      .sort((a, b) => slotUtil(b) - slotUtil(a))
      .slice(0, 6);
    if (slots.length === 0)
      return { text: "Nothing is above 85% in the current window — you have healthy availability." };
    return {
      text: `**${slots.length} departures** are at 85%+ capacity. Consider opening seats or a stop-sell:`,
      data: {
        kind: "table",
        title: "Nearly full",
        rows: slots.map((s) => ({
          label: `${dayLabel(s.date)} · ${prettyTime(s.time)} · ${excursionName(s.excursionId)}`,
          value: `${slotBooked(s)}/${s.capacity}`,
          pct: Math.round(slotUtil(s) * 100),
          color:
            slotUtil(s) >= 0.98 ? "#f43f5e" : slotUtil(s) >= 0.92 ? "#f59e0b" : "#5cd2f5",
        })),
      },
    };
  }

  /* 3 — Show capacity by time slot */
  if (/(capacity|utiliz|utilis|by time|breakdown).*(time|slot)|by time slot|capacity by/.test(q)) {
    const { iso, label } = resolveDate(q);
    const byTime = new Map<string, { booked: number; cap: number }>();
    slotsOn(iso).forEach((s) => {
      const cur = byTime.get(s.time) ?? { booked: 0, cap: 0 };
      cur.booked += slotBooked(s);
      cur.cap += s.capacity;
      byTime.set(s.time, cur);
    });
    const rows = [...byTime.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, v]) => ({
        label: prettyTime(time),
        value: `${v.booked}/${v.cap}`,
        pct: Math.round((v.booked / v.cap) * 100),
        color: "#5a5cff",
      }));
    const tBooked = rows.reduce((a, r) => a + parseInt(r.value), 0);
    return {
      text: `Capacity by time slot for **${label}** — ${tBooked} guests booked across the day:`,
      data: { kind: "table", title: `Capacity · ${label}`, rows },
    };
  }

  /* 4 — Which cruise line has the most bookings? */
  if (/(which|what).*(cruise line|line).*(most|top|highest|lead)|most bookings|top line|busiest line/.test(q)) {
    const { iso, label } = resolveDate(q);
    const lt = lineTotals(slotsOn(iso));
    if (lt.length === 0) return { text: `No bookings recorded ${label} yet.` };
    const total = lt.reduce((a, [, p]) => a + p, 0);
    const [topId, topPax] = lt[0];
    return {
      text: `**${lineById(topId)?.name}** leads ${label} with **${topPax} guests** (${Math.round(
        (topPax / total) * 100,
      )}% of ${total}), sailing ${lineById(topId)?.ship}.`,
      data: {
        kind: "table",
        title: `Bookings by line · ${label}`,
        rows: lt.map(([id, pax]) => ({
          label: lineById(id)?.name ?? id,
          value: `${pax}`,
          pct: Math.round((pax / total) * 100),
          color: lineById(id)?.color,
        })),
      },
    };
  }

  /* 5 — totals / how busy */
  if (/(total|overall|how busy|summary|how many.*(booked|total)|guests )/.test(q)) {
    const { iso, label } = resolveDate(q);
    const slots = slotsOn(iso);
    const booked = slots.reduce((a, s) => a + slotBooked(s), 0);
    const cap = slots.reduce((a, s) => a + s.capacity, 0);
    return {
      text: `${label[0].toUpperCase() + label.slice(1)} you have **${booked} guests** booked across ${slots.length} departures — ${Math.round(
        (booked / cap) * 100,
      )}% of ${cap} seats sold.`,
      data: {
        kind: "kpi",
        kpi: {
          value: String(booked),
          label: `guests · ${label}`,
          sub: `${cap - booked} seats open · ${slots.length} departures`,
        },
      },
    };
  }

  /* 6 — sold out */
  if (/(sold out|soldout|no seats|full slots)/.test(q)) {
    const slots = DATE_WINDOW.flatMap((d) => slotsOn(d)).filter(
      (s) => slotUtil(s) >= 0.99,
    );
    if (slots.length === 0)
      return { text: "Good news — nothing is fully sold out across the 7-day window." };
    return {
      text: `**${slots.length} departures** are sold out:`,
      data: {
        kind: "list",
        rows: slots.slice(0, 8).map((s) => ({
          label: `${dayLabel(s.date)} · ${prettyTime(s.time)} · ${excursionName(s.excursionId)}`,
          value: `${slotBooked(s)}/${s.capacity}`,
        })),
      },
    };
  }

  /* fallback */
  return {
    text:
      "I can read your aggregated manifests and answer questions like:\n\n• *How many sold tomorrow at 11 AM?*\n• *Which slots are nearly full?*\n• *Show capacity by time slot.*\n• *Which cruise line has the most bookings tomorrow?*\n\nAsk away — I pull live from every imported manifest.",
  };
}

export const SUGGESTED_QUESTIONS = [
  "How many sold tomorrow at 11 AM?",
  "Which slots are nearly full?",
  "Show capacity by time slot.",
  "Which cruise line has the most bookings tomorrow?",
];

export { CRUISE_LINES };
