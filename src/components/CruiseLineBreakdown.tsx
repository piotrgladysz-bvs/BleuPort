import { useMemo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { CRUISE_LINES, TOMORROW_ISO, slotsOn } from "../lib/data";
import { Card, ProgressBar, SectionHeading } from "./ui";

export function CruiseLineBreakdown() {
  const { rows, total } = useMemo(() => {
    const totals = new Map<string, number>();
    slotsOn(TOMORROW_ISO).forEach((s) =>
      s.bookings.forEach((b) =>
        totals.set(b.lineId, (totals.get(b.lineId) ?? 0) + b.pax),
      ),
    );
    const rows = CRUISE_LINES.map((l) => ({
      line: l,
      pax: totals.get(l.id) ?? 0,
    }))
      .filter((r) => r.pax > 0)
      .sort((a, b) => b.pax - a.pax);
    const total = rows.reduce((a, r) => a + r.pax, 0);
    return { rows, total };
  }, []);

  return (
    <Card>
      <SectionHeading
        title="Cruise line breakdown"
        subtitle="Tomorrow's guests, aggregated across ships"
      />
      <div className="flex items-center gap-5">
        <div className="relative h-32 w-32 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={rows}
                dataKey="pax"
                nameKey="line.short"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
              >
                {rows.map((r) => (
                  <Cell key={r.line.id} fill={r.line.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <div className="text-xl font-extrabold leading-none text-slate-900 dark:text-white">
                {total}
              </div>
              <div className="text-[9px] font-medium uppercase tracking-wide text-slate-400">
                guests
              </div>
            </div>
          </div>
        </div>
        <div className="min-w-0 flex-1 space-y-2.5">
          {rows.map((r) => {
            const pct = Math.round((r.pax / total) * 100);
            return (
              <div key={r.line.id}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ background: r.line.color }}
                    />
                    <span className="truncate font-medium text-slate-700 dark:text-slate-200">
                      {r.line.short}
                    </span>
                  </div>
                  <span className="shrink-0 font-semibold text-slate-900 dark:text-white">
                    {r.pax}{" "}
                    <span className="font-normal text-slate-400">
                      · {pct}%
                    </span>
                  </span>
                </div>
                <ProgressBar pct={pct} color={r.line.color} className="mt-1.5" />
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
