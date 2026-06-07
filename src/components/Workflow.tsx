import { Brain, Layers, Mail, ScanLine } from "lucide-react";
import { Card } from "./ui";

const STEPS = [
  {
    icon: Mail,
    title: "Manifests arrive by email",
    body: "Every cruise line sends to your dedicated inbox. Nothing to chase.",
  },
  {
    icon: ScanLine,
    title: "Excel & PDF auto-imported",
    body: "We parse XLSX, CSV and PDF manifests — names matched to slots.",
  },
  {
    icon: Layers,
    title: "Aggregated across lines",
    body: "One view of capacity, no matter how many ships call that day.",
  },
  {
    icon: Brain,
    title: "Ask in plain English",
    body: "“How many sold tomorrow at 11 AM?” — answered instantly.",
  },
];

export function Workflow() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {STEPS.map((s, i) => (
        <Card key={s.title} className="relative animate-fade-up">
          <div className="mb-3 flex items-center justify-between">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow">
              <s.icon size={17} />
            </div>
            <span className="text-2xl font-black text-slate-100 dark:text-white/10">
              {i + 1}
            </span>
          </div>
          <h3 className="text-[13px] font-bold text-slate-900 dark:text-white">
            {s.title}
          </h3>
          <p className="mt-1 text-[11px] leading-snug text-slate-500 dark:text-slate-400">
            {s.body}
          </p>
        </Card>
      ))}
    </div>
  );
}
