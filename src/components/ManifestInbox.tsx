import {
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Loader2,
  Mail,
  ScanSearch,
} from "lucide-react";
import { MANIFESTS, dayLabel, lineById } from "../lib/data";
import type { Manifest } from "../lib/types";
import { Card, Pill, SectionHeading } from "./ui";

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - +new Date(iso)) / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.round(hrs / 24)}d ago`;
}

function StatusBadge({ status }: { status: Manifest["status"] }) {
  switch (status) {
    case "imported":
      return (
        <Pill tone="good">
          <CheckCircle2 size={11} /> Imported
        </Pill>
      );
    case "processing":
      return (
        <Pill tone="brand">
          <Loader2 size={11} className="animate-spin" /> Parsing
        </Pill>
      );
    case "review":
      return (
        <Pill tone="warn">
          <ScanSearch size={11} /> Review
        </Pill>
      );
    default:
      return <Pill tone="bad">Failed</Pill>;
  }
}

export function ManifestInbox({ compact = false }: { compact?: boolean }) {
  const items = compact ? MANIFESTS.slice(0, 4) : MANIFESTS;
  return (
    <Card>
      <SectionHeading
        title="Manifest inbox"
        subtitle="Auto-imported from manifests@bleuport.io"
        action={
          <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/12 px-2 py-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-300">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-emerald-500" />
            Email sync on
          </span>
        }
      />
      <div className="space-y-2">
        {items.map((m) => {
          const line = lineById(m.lineId);
          const Icon =
            m.fileType === "pdf" ? FileText : FileSpreadsheet;
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 rounded-xl border border-slate-100 p-3 dark:border-white/5"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-slate-100 dark:bg-white/[0.06]">
                <Icon
                  size={16}
                  className="text-slate-500 dark:text-slate-300"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ background: line?.color }}
                  />
                  <p className="truncate text-[13px] font-semibold text-slate-900 dark:text-white">
                    {line?.name}
                  </p>
                </div>
                <p className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-slate-400 dark:text-slate-500">
                  <Mail size={10} /> {m.fileName}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <StatusBadge status={m.status} />
                <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
                  {m.pax} pax · {dayLabel(m.callDate)}
                </p>
                <p className="text-[9px] text-slate-400 dark:text-slate-600">
                  {timeAgo(m.receivedAt)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
