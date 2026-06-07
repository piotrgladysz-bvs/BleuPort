import { useMemo, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CRUISE_LINES,
  DATE_WINDOW,
  dayLabel,
  prettyTime,
  slotsOn,
} from "../lib/data";
import { Card, SectionHeading } from "./ui";

export function CapacityChart() {
  const [date, setDate] = useState(DATE_WINDOW[1]); // default tomorrow

  const data = useMemo(() => {
    const byTime = new Map<
      string,
      Record<string, number> & { time: string; capacity: number }
    >();
    slotsOn(date).forEach((s) => {
      const row =
        byTime.get(s.time) ??
        ({ time: s.time, capacity: 0 } as Record<string, number> & {
          time: string;
          capacity: number;
        });
      row.capacity += s.capacity;
      s.bookings.forEach((b) => {
        row[b.lineId] = (row[b.lineId] ?? 0) + b.pax;
      });
      byTime.set(s.time, row);
    });
    return [...byTime.values()]
      .sort((a, b) => a.time.localeCompare(b.time))
      .map((r) => ({ ...r, label: prettyTime(r.time) }));
  }, [date]);

  return (
    <Card>
      <SectionHeading
        title="Capacity by time slot"
        subtitle="Aggregated bookings across every cruise line · stacked by line"
        action={
          <select
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:ring-2 focus:ring-brand-500/40 dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
          >
            {DATE_WINDOW.map((d) => (
              <option key={d} value={d}>
                {dayLabel(d)}
              </option>
            ))}
          </select>
        }
      />
      <div className="h-60 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 4, left: -18, bottom: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-slate-200 dark:text-white/10"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              cursor={{ fill: "rgba(122,132,255,0.08)" }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(122,132,255,0.25)",
                background: "rgba(13,19,48,0.95)",
                color: "#fff",
                fontSize: 12,
                boxShadow: "0 12px 32px -12px rgba(0,0,0,0.6)",
              }}
              labelStyle={{ color: "#a0a6ff", fontWeight: 700 }}
            />
            {CRUISE_LINES.map((line, i) => (
              <Bar
                key={line.id}
                dataKey={line.id}
                name={line.short}
                stackId="pax"
                fill={line.color}
                radius={i === CRUISE_LINES.length - 1 ? [5, 5, 0, 0] : 0}
                maxBarSize={46}
              />
            ))}
            <Line
              type="monotone"
              dataKey="capacity"
              name="Capacity"
              stroke="#cbd5e1"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              dot={false}
              className="opacity-70"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {CRUISE_LINES.map((l) => (
          <div key={l.id} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-sm"
              style={{ background: l.color }}
            />
            <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              {l.short}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span className="h-0 w-3 border-t-2 border-dashed border-slate-400" />
          <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
            Capacity
          </span>
        </div>
      </div>
    </Card>
  );
}
