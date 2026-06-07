import { useEffect, useState } from "react";
import {
  Bell,
  LayoutDashboard,
  Mail,
  Moon,
  Search,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import { Logo } from "./components/Logo";
import { StatCards } from "./components/StatCards";
import { CapacityChart } from "./components/CapacityChart";
import { UpcomingSlots } from "./components/UpcomingSlots";
import { CruiseLineBreakdown } from "./components/CruiseLineBreakdown";
import { AlertsPanel } from "./components/AlertsPanel";
import { ManifestInbox } from "./components/ManifestInbox";
import { AIAssistant } from "./components/AIAssistant";
import { Workflow } from "./components/Workflow";
import { useTheme } from "./lib/useTheme";
import { ALERTS, TODAY } from "./lib/data";

type View = "dashboard" | "manifests" | "alerts";

const NAV: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "manifests", label: "Manifests", icon: Mail },
  { id: "alerts", label: "Alerts", icon: Bell },
];

const greeting = () => {
  const h = TODAY.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
};

export default function App() {
  const { theme, toggle } = useTheme();
  const [view, setView] = useState<View>("dashboard");
  const [aiOpen, setAiOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAiOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-screen bg-hero-radial text-slate-900 dark:text-slate-100">
      {/* Light-mode canvas */}
      <div className="min-h-screen bg-slate-50/95 transition-colors dark:bg-transparent">
        <div className="mx-auto flex max-w-[1400px]">
          {/* ---------- Desktop sidebar ---------- */}
          <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-slate-200/70 px-4 py-5 dark:border-white/10 lg:flex">
            <Logo size={38} withWordmark />
            <nav className="mt-8 space-y-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    view === n.id
                      ? "bg-brand-gradient text-white shadow-glow"
                      : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
                  }`}
                >
                  <n.icon size={18} />
                  {n.label}
                  {n.id === "alerts" && (
                    <span className="ml-auto rounded-full bg-rose-500/90 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {ALERTS.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>

            <button
              onClick={() => setAiOpen(true)}
              className="mt-3 flex w-full items-center gap-3 rounded-xl border border-brand-500/30 bg-brand-500/[0.07] px-3 py-2.5 text-sm font-semibold text-brand-600 transition hover:bg-brand-500/15 dark:text-brand-300"
            >
              <Sparkles size={18} />
              Ask the Assistant
            </button>

            <div className="mt-auto rounded-2xl border border-slate-200/70 bg-white/70 p-3 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-gradient text-xs font-bold text-white">
                  AT
                </div>
                <div className="min-w-0">
                  <div className="truncate text-xs font-semibold text-slate-900 dark:text-white">
                    Alaska Tours Co.
                  </div>
                  <div className="truncate text-[10px] text-slate-400">
                    Juneau · Operator
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* ---------- Main column ---------- */}
          <div className="min-w-0 flex-1">
            {/* Topbar */}
            <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/70 px-4 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/60 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="lg:hidden">
                  <Logo size={32} />
                </div>
                <div className="hidden min-w-0 flex-1 sm:block">
                  <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                    {NAV.find((n) => n.id === view)?.label}
                  </h1>
                </div>

                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-400 dark:border-white/10 dark:bg-navy-800 md:flex md:w-64">
                  <Search size={14} />
                  <span>Search slots, ships, guests…</span>
                  <kbd className="ml-auto rounded bg-slate-100 px-1.5 text-[10px] font-semibold text-slate-400 dark:bg-white/10">
                    ⌘K
                  </kbd>
                </div>

                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={toggle}
                    className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-slate-300"
                    aria-label="Toggle theme"
                  >
                    {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                  <button
                    onClick={() => setView("alerts")}
                    className="relative grid h-9 w-9 place-items-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:text-brand-500 dark:border-white/10 dark:bg-navy-800 dark:text-slate-300"
                    aria-label="Alerts"
                  >
                    <Bell size={16} />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500" />
                  </button>
                  <button
                    onClick={() => setAiOpen(true)}
                    className="hidden items-center gap-2 rounded-xl bg-brand-gradient px-3.5 py-2 text-xs font-semibold text-white shadow-glow sm:flex"
                  >
                    <Sparkles size={15} />
                    Ask AI
                  </button>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="px-4 pb-28 pt-4 sm:px-6 lg:pb-8">
              {view === "dashboard" && <DashboardView onAsk={() => setAiOpen(true)} />}
              {view === "manifests" && <ManifestsView />}
              {view === "alerts" && (
                <div className="mx-auto max-w-2xl">
                  <AlertsPanel full />
                </div>
              )}
            </main>
          </div>
        </div>

        {/* ---------- Mobile bottom nav ---------- */}
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/70 bg-white/90 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl dark:border-white/10 dark:bg-navy-900/80 lg:hidden">
          <div className="flex items-center justify-around">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition ${
                  view === n.id
                    ? "text-brand-500 dark:text-brand-300"
                    : "text-slate-400"
                }`}
              >
                <div className="relative">
                  <n.icon size={20} />
                  {n.id === "alerts" && (
                    <span className="absolute -right-1.5 -top-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                  )}
                </div>
                {n.label}
              </button>
            ))}
            <button
              onClick={() => setAiOpen(true)}
              className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium text-slate-400"
            >
              <Sparkles size={20} className="text-glacier-400" />
              Assistant
            </button>
          </div>
        </nav>

        {/* ---------- AI Assistant drawer ---------- */}
        {aiOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm"
              onClick={() => setAiOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 flex w-full animate-slide-in flex-col border-l border-slate-200/70 bg-slate-50 shadow-2xl dark:border-white/10 dark:bg-navy-900 sm:max-w-md">
              <button
                onClick={() => setAiOpen(false)}
                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-200 dark:hover:bg-white/10"
                aria-label="Close assistant"
              >
                <X size={18} />
              </button>
              <AIAssistant />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Views ---------------- */

function DashboardView({ onAsk }: { onAsk: () => void }) {
  return (
    <div className="space-y-5">
      {/* Hero greeting */}
      <div className="starfield relative overflow-hidden rounded-3xl border border-white/10 bg-hero-radial p-5 sm:p-7">
        <div className="relative z-10 max-w-xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-glacier-300">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-glacier-400" />
            Compliance-grade · Built for modern operators
          </div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            {greeting()}, <span className="text-gradient">Alaska Tours</span>.
          </h1>
          <p className="mt-2 max-w-md text-sm text-slate-300/90">
            Every cruise manifest, aggregated and ready. Here's how tomorrow's
            excursions are filling up across all your lines.
          </p>
          <button
            onClick={onAsk}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-semibold text-navy-900 shadow-lg transition hover:bg-white"
          >
            <Sparkles size={16} className="text-brand-600" />
            Ask the Assistant
          </button>
        </div>
        <div className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 right-24 h-48 w-48 rounded-full bg-glacier-400/10 blur-3xl" />
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <div className="space-y-5 xl:col-span-2">
          <CapacityChart />
          <UpcomingSlots />
        </div>
        <div className="space-y-5">
          <CruiseLineBreakdown />
          <AlertsPanel />
          <ManifestInbox compact />
        </div>
      </div>
    </div>
  );
}

function ManifestsView() {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
          From inbox to insight
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          BleuPort turns the manifests piling up in your email into one live,
          queryable capacity picture.
        </p>
      </div>
      <Workflow />
      <ManifestInbox />
    </div>
  );
}
