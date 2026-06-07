import { Ship, Users, TrendingUp, AlertTriangle } from "lucide-react";
import {
  MANIFESTS,
  SLOTS,
  TOMORROW_ISO,
  slotBooked,
  slotUtil,
  slotsOn,
} from "../lib/data";
import { Card } from "./ui";

function computeStats() {
  const tmrw = slotsOn(TOMORROW_ISO);
  const tmrwBooked = tmrw.reduce((a, s) => a + slotBooked(s), 0);
  const tmrwCap = tmrw.reduce((a, s) => a + s.capacity, 0);
  const nearlyFull = SLOTS.filter((s) => slotUtil(s) >= 0.85).length;
  const linesActive = MANIFESTS.length;
  return {
    tmrwBooked,
    tmrwUtil: Math.round((tmrwBooked / tmrwCap) * 100),
    departures: tmrw.length,
    nearlyFull,
    linesActive,
  };
}

export function StatCards() {
  const s = computeStats();
  const items = [
    {
      icon: Users,
      label: "Booked tomorrow",
      value: s.tmrwBooked.toLocaleString(),
      sub: `${s.departures} departures`,
      tone: "text-brand-500",
      bg: "bg-brand-500/12",
    },
    {
      icon: TrendingUp,
      label: "Capacity sold",
      value: `${s.tmrwUtil}%`,
      sub: "across all lines",
      tone: "text-glacier-400",
      bg: "bg-glacier-400/12",
    },
    {
      icon: AlertTriangle,
      label: "Nearly full",
      value: String(s.nearlyFull),
      sub: "slots ≥ 85%",
      tone: "text-amber-500",
      bg: "bg-amber-500/12",
    },
    {
      icon: Ship,
      label: "Lines synced",
      value: String(s.linesActive),
      sub: "manifests live",
      tone: "text-emerald-500",
      bg: "bg-emerald-500/12",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((it, i) => (
        <Card
          key={it.label}
          className="animate-fade-up"
        >
          <div style={{ animationDelay: `${i * 60}ms` }}>
            <div
              className={`mb-3 grid h-9 w-9 place-items-center rounded-xl ${it.bg}`}
            >
              <it.icon className={it.tone} size={18} />
            </div>
            <div className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              {it.value}
            </div>
            <div className="mt-0.5 text-[11px] font-medium text-slate-500 dark:text-slate-400">
              {it.label}
            </div>
            <div className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              {it.sub}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
