import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Github } from "lucide-react";

export type Project = {
  name: string;
  kind: string;
  desc: string;
  highlights: string[];
  tags: string[];
  repo: string;
  live?: string;
  motif: "graph" | "series" | "pins" | "bias" | "dots";
};

const EASE = [0.16, 1, 0.3, 1] as const;

// Deterministic pseudo-random so motifs are stable between renders.
const rnd = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function Motif({ kind }: { kind: Project["motif"] }) {
  const stroke = "var(--accent)";
  const faint = "var(--border)";
  const props = { viewBox: "0 0 400 260", className: "h-full w-full", "aria-hidden": true } as const;

  if (kind === "graph") {
    const nodes = Array.from({ length: 14 }, (_, i) => ({ x: 30 + rnd(i) * 340, y: 24 + rnd(i + 40) * 212 }));
    const q = { x: 40, y: 130 };
    return (
      <svg {...props}>
        {nodes.map((n, i) => (
          <motion.line key={`l${i}`} x1={q.x} y1={q.y} x2={n.x} y2={n.y} stroke={i % 3 === 0 ? stroke : faint}
            strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: i * 0.04 }} />
        ))}
        {nodes.map((n, i) => (
          <motion.circle key={i} cx={n.x} cy={n.y} r={i % 3 === 0 ? 5 : 3} fill={i % 3 === 0 ? stroke : faint}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 + i * 0.04 }} style={{ transformOrigin: `${n.x}px ${n.y}px` }} />
        ))}
        <circle cx={q.x} cy={q.y} r="9" fill="none" stroke={stroke} strokeWidth="1.5" />
        <circle cx={q.x} cy={q.y} r="3" fill={stroke} />
      </svg>
    );
  }

  if (kind === "series") {
    const pts = Array.from({ length: 40 }, (_, i) => [10 + i * 9.7, 150 - i * 1.6 - Math.sin(i / 2.2) * 26 - rnd(i) * 22] as const);
    const d = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
    return (
      <svg {...props}>
        {[50, 100, 150, 200].map((y) => <line key={y} x1="0" x2="400" y1={y} y2={y} stroke={faint} />)}
        <motion.path d={d} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: EASE }} />
        <motion.path d={`M10 ${150 - 6} L390 ${150 - 40 * 1.6 - 6}`} stroke={stroke} strokeDasharray="4 5" strokeOpacity="0.5" fill="none"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} />
      </svg>
    );
  }

  if (kind === "pins") {
    return (
      <svg {...props}>
        {Array.from({ length: 10 }, (_, r) => Array.from({ length: 16 }, (_, c) => (
          <rect key={`${r}-${c}`} x={14 + c * 24} y={12 + r * 24} width="16" height="16" fill="none" stroke={faint} />
        )))}
        {Array.from({ length: 14 }, (_, i) => {
          const x = 22 + Math.floor(rnd(i + 3) * 16) * 24, y = 20 + Math.floor(rnd(i + 9) * 10) * 24;
          return (
            <motion.g key={i} initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.06, ease: EASE, duration: 0.6 }}>
              <circle cx={x} cy={y} r="14" fill={stroke} fillOpacity="0.15" />
              <circle cx={x} cy={y} r="5" fill={stroke} />
            </motion.g>
          );
        })}
      </svg>
    );
  }

  if (kind === "bias") {
    const R = 9, C = 16, W = 21, H = 24;
    return (
      <svg {...props}>
        {Array.from({ length: R }, (_, r) => Array.from({ length: C }, (_, c) => {
          // smooth field per row (channel) with a left/right lean, plus noise
          const lean = (r / (R - 1) - 0.5) * 1.6;
          const v = Math.max(-1, Math.min(1, lean + Math.sin(c / 2.4 + r) * 0.45 + (rnd(r * C + c) - 0.5) * 0.5));
          const pct = Math.round(Math.abs(v) * 85);
          const fill = v >= 0
            ? `color-mix(in oklab, var(--accent) ${pct}%, var(--bg-elevated))`
            : `color-mix(in oklab, var(--text-muted) ${pct}%, var(--bg-elevated))`;
          return (
            <motion.rect key={`${r}-${c}`} x={32 + c * W} y={14 + r * H} width={W - 3} height={H - 3} rx="2" fill={fill}
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
              style={{ transformOrigin: `${32 + c * W + W / 2}px ${14 + r * H + H / 2}px` }}
              transition={{ delay: (r + c) * 0.025, duration: 0.4, ease: EASE }} />
          );
        }))}
      </svg>
    );
  }

  return (
    <svg {...props}>
      {Array.from({ length: 12 }, (_, r) => Array.from({ length: 20 }, (_, c) => {
        const s = 1.5 + (Math.sin(c / 2.5) * Math.cos(r / 2) + 1) * 3;
        return (
          <motion.circle key={`${r}-${c}`} cx={20 + c * 19.5} cy={20 + r * 20} r={s} fill={stroke} fillOpacity={0.35 + s / 10}
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: (r + c) * 0.015 }} style={{ transformOrigin: `${20 + c * 19.5}px ${20 + r * 20}px` }} />
        );
      }))}
    </svg>
  );
}

export function ProjectsShowcase({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const p = projects[active];

  const onKey = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : e.key === "ArrowUp" || e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + projects.length) % projects.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,340px)_1fr] md:gap-12">
      <div
        role="tablist"
        aria-label="Projects"
        onKeyDown={onKey}
        className="flex gap-2 overflow-x-auto md:flex-col md:gap-0 md:overflow-visible"
      >
        {projects.map((x, i) => {
          const on = i === active;
          return (
            <button
              key={x.name}
              ref={(el) => { tabs.current[i] = el; }}
              role="tab"
              id={`project-tab-${i}`}
              aria-selected={on}
              aria-controls="project-panel"
              tabIndex={on ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
              className="group relative flex shrink-0 items-baseline gap-4 border px-4 py-3 text-left transition-colors md:border-0 md:border-t md:px-0 md:py-5"
              style={{ borderColor: on ? "var(--accent)" : "var(--border)" }}
            >
              <span className="font-mono text-[11px]" style={{ color: on ? "var(--accent)" : "var(--text-muted)" }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0">
                <span className={`block display-tight text-lg md:text-2xl transition-colors ${on ? "text-text" : "text-text-muted group-hover:text-text-soft"}`}>
                  {x.name}
                </span>
                <span className="mt-1 hidden font-mono text-[10px] uppercase tracking-widest text-text-muted md:block">{x.kind}</span>
              </span>
              {on && (
                <motion.span layoutId="project-marker" className="absolute left-0 top-0 hidden h-px w-full md:block" style={{ background: "var(--accent)" }} />
              )}
            </button>
          );
        })}
      </div>

      <div id="project-panel" role="tabpanel" aria-labelledby={`project-tab-${active}`} className="min-w-0">
        <div className="relative aspect-[400/260] w-full overflow-hidden border" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
          <AnimatePresence mode="wait">
            <motion.div key={p.name} className="absolute inset-0 p-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
              <Motif kind={p.motif} />
            </motion.div>
          </AnimatePresence>
          <div className="label-tag absolute left-4 top-3">{p.kind}</div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={p.name} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: EASE }}>
            <p className="mt-6 max-w-[560px] text-[15px] leading-relaxed text-text-soft">{p.desc}</p>
            <ul className="mt-4 space-y-1.5 text-[15px] text-text-soft">
              {p.highlights.map((h) => (
                <li key={h} className="relative pl-5">
                  <span className="absolute left-0 top-3 h-px w-3 bg-text-muted" />
                  {h}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-1.5">
              {p.tags.map((t) => (
                <span key={t} className="inline-flex items-center border px-2 py-0.5 font-mono text-[10px] text-text-soft" style={{ borderColor: "var(--border)" }}>{t}</span>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={p.repo} target="_blank" rel="noreferrer"
                className="inline-flex h-9 items-center gap-2 border px-3 font-mono text-[11px] text-text transition-colors hover:border-[color:var(--accent)]"
                style={{ borderColor: "var(--border)" }}>
                <Github size={14} aria-hidden /> Source
              </a>
              {p.live && (
                <a href={p.live} target="_blank" rel="noreferrer"
                  className="inline-flex h-9 items-center gap-2 px-3 font-mono text-[11px]"
                  style={{ background: "var(--accent)", color: "var(--bg)" }}>
                  Live <ArrowUpRight size={14} aria-hidden />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
