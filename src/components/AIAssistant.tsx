import { useEffect, useRef, useState } from "react";
import { ArrowUp, Sparkles, Waves } from "lucide-react";
import { SUGGESTED_QUESTIONS, answerQuestion } from "../lib/ai";
import { ProgressBar } from "./ui";
import type { ChatData, ChatMessage } from "../lib/types";

let idSeq = 0;
const uid = () => `m${++idSeq}_${Date.now()}`;

const GREETING: ChatMessage = {
  id: "greet",
  role: "assistant",
  ts: Date.now(),
  text:
    "Hi — I'm your BleuPort co-pilot. I read every imported manifest across all your cruise lines. Ask me anything about capacity, slots, or bookings.",
};

function DataBlock({ data }: { data: ChatData }) {
  if (data.kind === "kpi" && data.kpi) {
    return (
      <div className="mt-2.5 rounded-xl border border-brand-500/20 bg-brand-500/[0.07] p-3">
        <div className="text-2xl font-extrabold tracking-tight text-brand-600 dark:text-brand-300">
          {data.kpi.value}
        </div>
        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {data.kpi.label}
        </div>
        {data.kpi.sub && (
          <div className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
            {data.kpi.sub}
          </div>
        )}
        {data.rows && (
          <div className="mt-2.5 space-y-1.5 border-t border-slate-200/60 pt-2.5 dark:border-white/10">
            {data.rows.map((r) => (
              <div
                key={r.label}
                className="flex items-center justify-between gap-2 text-[11px]"
              >
                <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                  {r.color && (
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: r.color }}
                    />
                  )}
                  {r.label}
                </span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {r.value}
                  {r.pct != null && (
                    <span className="font-normal text-slate-400">
                      {" "}
                      · {r.pct}%
                    </span>
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // table / list
  return (
    <div className="mt-2.5 space-y-2">
      {data.title && (
        <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {data.title}
        </div>
      )}
      {data.rows?.map((r) => (
        <div key={r.label} className="text-[11px]">
          <div className="flex items-center justify-between gap-2">
            <span className="min-w-0 truncate text-slate-600 dark:text-slate-300">
              {r.label}
            </span>
            <span className="shrink-0 font-semibold text-slate-900 dark:text-white">
              {r.value}
              {r.pct != null && (
                <span className="font-normal text-slate-400"> · {r.pct}%</span>
              )}
            </span>
          </div>
          {r.pct != null && (
            <ProgressBar pct={r.pct} color={r.color} className="mt-1" />
          )}
        </div>
      ))}
    </div>
  );
}

function renderText(text: string) {
  // tiny **bold** + *italic* + newline renderer
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
    return (
      <span key={i} className="block min-h-[2px]">
        {parts.map((p, j) => {
          if (p.startsWith("**"))
            return (
              <strong key={j} className="font-bold text-slate-900 dark:text-white">
                {p.slice(2, -2)}
              </strong>
            );
          if (p.startsWith("*"))
            return (
              <em key={j} className="text-brand-600 dark:text-brand-300">
                {p.slice(1, -1)}
              </em>
            );
          return <span key={j}>{p}</span>;
        })}
      </span>
    );
  });
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, thinking]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || thinking) return;
    const userMsg: ChatMessage = {
      id: uid(),
      role: "user",
      text,
      ts: Date.now(),
    };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setThinking(true);
    const { text: ansText, data } = answerQuestion(text);
    // simulate retrieval + reasoning latency
    setTimeout(
      () => {
        setMessages((m) => [
          ...m,
          { id: uid(), role: "assistant", text: ansText, data, ts: Date.now() },
        ]);
        setThinking(false);
      },
      550 + Math.random() * 350,
    );
  };

  const showSuggestions = messages.length <= 1;

  return (
    <div className="flex h-full flex-col">
      {/* header */}
      <div className="flex items-center gap-3 border-b border-slate-200/70 px-4 py-3 dark:border-white/10">
        <div className="relative grid h-9 w-9 place-items-center rounded-xl bg-brand-gradient shadow-glow">
          <Sparkles size={17} className="text-white" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-400 dark:border-navy-850" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-sm font-bold text-slate-900 dark:text-white">
            BleuPort Assistant
          </div>
          <div className="text-[10px] text-slate-400 dark:text-slate-500">
            Reading 6 manifests · live
          </div>
        </div>
        <Waves size={16} className="text-glacier-400" />
      </div>

      {/* messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[88%] animate-fade-up rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                m.role === "user"
                  ? "rounded-br-md bg-brand-gradient text-white shadow-glow"
                  : "rounded-bl-md border border-slate-200/70 bg-white text-slate-700 dark:border-white/10 dark:bg-navy-800 dark:text-slate-200"
              }`}
            >
              {renderText(m.text)}
              {m.data && <DataBlock data={m.data} />}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex justify-start">
            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-slate-200/70 bg-white px-3.5 py-3 dark:border-white/10 dark:bg-navy-800">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-brand-400"
                  style={{
                    animation: "pulse-dot 1.2s ease-in-out infinite",
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* suggestions */}
      {showSuggestions && (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTED_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="rounded-full border border-brand-500/25 bg-brand-500/[0.06] px-3 py-1.5 text-[11px] font-medium text-brand-600 transition hover:bg-brand-500/15 dark:text-brand-300"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* composer */}
      <div className="border-t border-slate-200/70 p-3 dark:border-white/10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 pl-3.5 focus-within:ring-2 focus-within:ring-brand-500/40 dark:border-white/10 dark:bg-navy-800"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about capacity, slots, or bookings…"
            className="flex-1 bg-transparent py-1.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none dark:text-slate-100"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand-gradient text-white shadow-glow transition disabled:opacity-40"
            aria-label="Send"
          >
            <ArrowUp size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
