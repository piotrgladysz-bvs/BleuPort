# BleuPort

**Compliance-grade cruise manifest intelligence for shore excursion operators.**
A premium, mobile-first SaaS prototype by [Bleu Venture Studios](https://bleuventurestudios.com).

BleuPort takes the cruise manifests that pile up in an operator's inbox — from
every cruise line, in Excel and PDF — and turns them into one live, queryable
picture of excursion capacity. Operators stop reconciling spreadsheets and start
asking questions in plain English.

## The workflow

1. **Manifests arrive by email** to a dedicated inbox, from every cruise line.
2. **Excel & PDF manifests are auto-imported** — guests matched to time slots.
3. **Bookings are aggregated across all lines** into one capacity view.
4. **Operators ask in natural language** — the assistant answers instantly.

Try the assistant with:

- _How many sold tomorrow at 11 AM?_
- _Which slots are nearly full?_
- _Show capacity by time slot._
- _Which cruise line has the most bookings tomorrow?_

## Features

- 📊 **Capacity dashboard** — KPIs and a stacked capacity-by-time-slot chart
- 🤖 **AI assistant panel** — natural-language Q&A computed live from manifests
- 🔔 **Alerts panel** — nearly-full slots, sold-outs, manifests needing review
- 🚢 **Cruise line breakdown** — guests by line and ship
- 🕑 **Upcoming slot overview** — fill rates across the operating window
- 📥 **Manifest inbox** — email-driven import status (XLSX / PDF / CSV)
- 🌗 **Dark & light mode**, **mobile-first** responsive layout
- ⚓ Maritime / Alaska aesthetic on the Bleu Venture Studios electric-blue palette

## Tech

- React 18 + TypeScript + Vite
- Tailwind CSS (class-based dark mode, custom brand palette)
- Recharts for charts · lucide-react for icons

> All data in this prototype is generated locally and deterministically — no
> backend, no real PHI. The "AI assistant" is a transparent rules engine that
> computes answers directly over the mock manifests, so every response is real.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the production build
```

## Project structure

```
src/
  lib/
    data.ts        # deterministic mock cruise lines, slots, manifests, alerts
    ai.ts          # natural-language → answer engine over the data
    types.ts       # domain models
    useTheme.ts    # dark / light mode
  components/
    AIAssistant.tsx        # chat interface + structured answers
    CapacityChart.tsx      # stacked capacity by time slot
    CruiseLineBreakdown.tsx
    UpcomingSlots.tsx
    AlertsPanel.tsx
    ManifestInbox.tsx
    StatCards.tsx
    Workflow.tsx
    Logo.tsx / ui.tsx
  App.tsx          # layout, navigation, theme, assistant drawer
```
