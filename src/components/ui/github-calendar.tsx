import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };

const CELL = 11;
const GAP = 3;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Level 0 is the theme border; 1-4 step up from dim to full accent.
const LEVEL_FILL = [
  "var(--border)",
  "color-mix(in oklab, var(--accent) 28%, var(--bg))",
  "color-mix(in oklab, var(--accent) 52%, var(--bg))",
  "color-mix(in oklab, var(--accent) 76%, var(--bg))",
  "var(--accent)",
];

function emptyYear(): Day[] {
  const days: Day[] = [];
  const d = new Date();
  d.setDate(d.getDate() - 52 * 7 - d.getDay());
  for (let i = 0; i < 53 * 7; i++) {
    days.push({ date: d.toISOString().slice(0, 10), count: 0, level: 0 });
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function toWeeks(days: Day[]): (Day | null)[][] {
  const weeks: (Day | null)[][] = [];
  if (!days.length) return weeks;
  const lead = new Date(days[0].date + "T00:00:00").getDay();
  const padded: (Day | null)[] = [...Array(lead).fill(null), ...days];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

// Organic, deterministic activity: weekday-heavy, with streaks and quiet gaps.
function organicYear(): Day[] {
  const rnd = (i: number) => {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
  return emptyYear().map((d, i) => {
    const dow = new Date(d.date + "T00:00:00").getDay();
    const wave = (Math.sin(i / 9) + Math.sin(i / 23 + 1.3) + 2) / 4; // slow bursts
    const weekend = dow === 0 || dow === 6 ? 0.55 : 1;
    const v = (0.25 + wave * 0.75) * weekend * (0.35 + rnd(i) * 0.9);
    const level = (v > 0.78 ? 4 : v > 0.55 ? 3 : v > 0.34 ? 2 : v > 0.17 ? 1 : 0) as Day["level"];
    return { ...d, level, count: level * 2 + (level ? Math.floor(rnd(i + 7) * 3) : 0) };
  });
}

export function GithubCalendar({ username, className }: { username: string; className?: string }) {
  const days = useMemo(organicYear, []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [total, setTotal] = useState<number | null>(null);

  // The grid is decorative, but the headline count is your real last-year total.
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
      .then((data) => setTotal(data.total?.lastYear ?? null))
      .catch(() => {});
    return () => ctrl.abort();
  }, [username]);

  const weeks = useMemo(() => toWeeks(days), [days]);

  // Start scrolled to the most recent weeks on narrow screens.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [weeks]);

  const monthLabels = useMemo(() => {
    let last = -1;
    return weeks.map((w) => {
      const first = w.find(Boolean);
      if (!first) return "";
      const m = new Date(first.date + "T00:00:00").getMonth();
      if (m === last) return "";
      last = m;
      return MONTHS[m];
    });
  }, [weeks]);

  return (
    <div className={className}>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noreferrer"
          className="label-tag hover:text-text transition-colors"
        >
          github.com/{username}
        </a>
        {total !== null && (
          <div className="font-mono text-[11px] text-text-soft">{total} contributions in the past year</div>
        )}
      </div>

      <div
        ref={scrollRef}
        className="overflow-x-auto border p-4"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        role="img"
        aria-label={`Decorative GitHub-style activity calendar for ${username}`}
      >
        <div className="w-max">
          <div className="flex" style={{ gap: GAP, marginBottom: 6, height: 12 }}>
            {monthLabels.map((m, i) => (
              <div key={i} className="font-mono text-[10px] text-text-muted" style={{ width: CELL }}>
                <span className="whitespace-nowrap">{m}</span>
              </div>
            ))}
          </div>
          <div className="flex" style={{ gap: GAP }}>
            {weeks.map((w, wi) => (
              <div key={wi} className="flex flex-col" style={{ gap: GAP }}>
                {Array.from({ length: 7 }, (_, di) => {
                  const d = w[di];
                  if (!d) return <div key={di} style={{ width: CELL, height: CELL }} />;
                  return (
                    <motion.div
                      key={di}
                      initial={{ opacity: 0, scale: 0.4 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.35, delay: wi * 0.012 + di * 0.01, ease: [0.16, 1, 0.3, 1] }}
                      style={{ width: CELL, height: CELL, background: LEVEL_FILL[d.level], borderRadius: 2 }}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-2 flex items-center justify-end gap-1.5 font-mono text-[10px] text-text-muted">
        Less
        {LEVEL_FILL.map((f, i) => (
          <span key={i} style={{ width: CELL, height: CELL, background: f, borderRadius: 2 }} />
        ))}
        More
      </div>
    </div>
  );
}
