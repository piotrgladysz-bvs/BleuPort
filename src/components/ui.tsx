import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-slate-200/70 bg-white/90 shadow-card backdrop-blur dark:border-white/10 dark:bg-navy-850/70 ${
        padded ? "p-4 sm:p-5" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white sm:text-base">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function ProgressBar({
  pct,
  color,
  className = "",
}: {
  pct: number;
  color?: string;
  className?: string;
}) {
  const clamped = Math.min(100, Math.max(0, pct));
  const auto =
    clamped >= 98
      ? "#f43f5e"
      : clamped >= 90
        ? "#f59e0b"
        : clamped >= 70
          ? "#5cd2f5"
          : "#5a5cff";
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10 ${className}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-700 ease-out"
        style={{ width: `${clamped}%`, background: color ?? auto }}
      />
    </div>
  );
}

export function Pill({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "brand" | "good" | "warn" | "bad";
}) {
  const tones: Record<string, string> = {
    neutral:
      "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300",
    brand:
      "bg-brand-500/15 text-brand-600 dark:text-brand-300 ring-1 ring-inset ring-brand-500/25",
    good: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
    warn: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
    bad: "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}
