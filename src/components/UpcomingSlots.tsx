import { Clock, MapPin } from "lucide-react";
import {
  EXCURSIONS,
  SLOTS,
  dayLabel,
  excursionName,
  prettyTime,
  slotBooked,
  slotUtil,
} from "../lib/data";
import { Card, Pill, ProgressBar, SectionHeading } from "./ui";

export function UpcomingSlots() {
  const upcoming = [...SLOTS]
    .sort((a, b) =>
      (a.date + a.time).localeCompare(b.date + b.time),
    )
    .slice(0, 8);

  return (
    <Card>
      <SectionHeading
        title="Upcoming departures"
        subtitle="Next slots across the operating window"
        action={
          <Pill tone="brand">{SLOTS.length} total slots</Pill>
        }
      />
      <div className="space-y-2.5">
        {upcoming.map((s) => {
          const booked = slotBooked(s);
          const util = Math.round(slotUtil(s) * 100);
          const loc =
            EXCURSIONS.find((e) => e.id === s.excursionId)?.location ?? "";
          return (
            <div
              key={s.id}
              className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 transition hover:border-brand-300/60 hover:bg-brand-50/40 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-brand-600 dark:text-brand-300">
                    <Clock size={12} />
                    {dayLabel(s.date)} · {prettyTime(s.time)}
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white">
                    {excursionName(s.excursionId)}
                  </div>
                  <div className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                    <MapPin size={11} /> {loc} · {s.bookings.length} lines
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-bold text-slate-900 dark:text-white">
                    {booked}
                    <span className="text-slate-400 dark:text-slate-500">
                      /{s.capacity}
                    </span>
                  </div>
                  <div className="mt-0.5">
                    {util >= 98 ? (
                      <Pill tone="bad">Sold out</Pill>
                    ) : util >= 90 ? (
                      <Pill tone="warn">{util}%</Pill>
                    ) : (
                      <Pill tone="good">{util}%</Pill>
                    )}
                  </div>
                </div>
              </div>
              <ProgressBar pct={util} className="mt-2.5" />
            </div>
          );
        })}
      </div>
    </Card>
  );
}
