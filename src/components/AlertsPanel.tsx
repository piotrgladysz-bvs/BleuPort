import { AlertTriangle, Bell, Info, OctagonAlert } from "lucide-react";
import { ALERTS } from "../lib/data";
import type { AlertLevel } from "../lib/types";
import { Card, SectionHeading } from "./ui";

const styles: Record<
  AlertLevel,
  { icon: typeof Info; ring: string; bg: string; text: string }
> = {
  critical: {
    icon: OctagonAlert,
    ring: "ring-rose-500/30",
    bg: "bg-rose-500/12 text-rose-500",
    text: "text-rose-600 dark:text-rose-300",
  },
  warning: {
    icon: AlertTriangle,
    ring: "ring-amber-500/30",
    bg: "bg-amber-500/12 text-amber-500",
    text: "text-amber-600 dark:text-amber-300",
  },
  info: {
    icon: Info,
    ring: "ring-brand-500/20",
    bg: "bg-brand-500/12 text-brand-500",
    text: "text-brand-600 dark:text-brand-300",
  },
};

export function AlertsPanel({ full = false }: { full?: boolean }) {
  const items = full ? ALERTS : ALERTS.slice(0, 4);
  return (
    <Card>
      <SectionHeading
        title="Alerts"
        subtitle="Capacity & manifest signals"
        action={
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
            <Bell size={13} />
            {ALERTS.length}
          </span>
        }
      />
      <div className="space-y-2.5">
        {items.map((a) => {
          const st = styles[a.level];
          return (
            <div
              key={a.id}
              className={`flex gap-3 rounded-xl bg-slate-50/70 p-3 ring-1 ring-inset ${st.ring} dark:bg-white/[0.03]`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${st.bg}`}
              >
                <st.icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-[13px] font-semibold leading-snug text-slate-900 dark:text-white">
                    {a.title}
                  </p>
                  <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                    {a.time}
                  </span>
                </div>
                <p className="mt-0.5 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
                  {a.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
