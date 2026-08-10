import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Reveal } from "./Reveal";

export type ExperienceEntry = {
  date: string;
  org: string;
  role: string;
  bullets: string[];
  tags: string[];
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] text-text-soft"
      style={{ borderColor: "var(--border)" }}
    >
      {children}
    </span>
  );
}

// Scales the display font size down for longer words so a single word never
// overflows the visual panel and has to be force-broken mid-word.
function fitOrgFontSize(text: string): string {
  const longest = text.split(/\s+/).reduce((max, w) => Math.max(max, w.length), 1);
  const scale = Math.min(1, 7 / longest);
  const min = Math.round(36 * scale);
  const max = Math.round(80 * scale);
  const vw = (6 * scale).toFixed(2);
  return `clamp(${min}px, ${vw}vw, ${max}px)`;
}

function useReducedMotion() {
  const [r, setR] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setR(mq.matches);
    const on = () => setR(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return r;
}

function useIsDesktop() {
  const [d, setD] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setD(mq.matches);
    const on = () => setD(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return d;
}

function TimelineFallback({ entries }: { entries: ExperienceEntry[] }) {
  return (
    <div className="mt-16 space-y-0">
      {entries.map((x, i) => (
        <Reveal key={i} delay={i * 0.05}>
          <div
            className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 border-t py-10"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
              {x.date}
            </div>
            <div>
              <div className="text-sm" style={{ color: "var(--accent)" }}>{x.org}</div>
              <div className="mt-1 text-2xl md:text-3xl font-semibold text-text display-tight">{x.role}</div>
              <ul className="mt-4 space-y-1.5 text-[15px] text-text-soft">
                {x.bullets.map((b) => (
                  <li key={b} className="relative pl-5">
                    <span className="absolute left-0 top-3 h-px w-3 bg-text-muted" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {x.tags.map((t) => <Chip key={t}>{t}</Chip>)}
              </div>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ExperienceScroll({ entries }: { entries: ExperienceEntry[] }) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const N = entries.length;

  const updateProgress = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    if (total <= 0) {
      setProgress(0);
      return;
    }
    const scrolled = -rect.top;
    setProgress(Math.min(1, Math.max(0, scrolled / total)));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", updateProgress);
  }, [updateProgress]);

  // Discrete snap: when the user stops scrolling, smoothly target the nearest entry.
  useEffect(() => {
    if (!isDesktop || reduced || N <= 1) return;
    const wrap = wrapRef.current;
    if (!wrap) return;

    let isSnapping = false;
    let lastScrollY = window.scrollY;
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

    const snap = () => {
      if (isSnapping) return;

      const rect = wrap.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const scrollableRange = rect.height - window.innerHeight;
      if (scrollableRange <= 0) return;

      const currentScrollY = window.scrollY;
      if (currentScrollY < sectionTop - 1 || currentScrollY > sectionTop + scrollableRange + 1) return;

      const scrolledTo = -rect.top;
      const total = rect.height - window.innerHeight;
      const rawProgress = Math.min(1, Math.max(0, scrolledTo / total));
      const nearestIndex = Math.round(rawProgress * (N - 1));
      const clampedIndex = Math.max(0, Math.min(N - 1, nearestIndex));
      const targetProgress = clampedIndex / Math.max(1, N - 1);

      const currentProgress = scrolledTo / total;
      if (Math.abs(currentProgress - targetProgress) < 0.001) return;

      const targetScrollY = sectionTop + targetProgress * scrollableRange;

      isSnapping = true;
      lastScrollY = window.scrollY;
      window.scrollTo({ top: targetScrollY, behavior: "smooth" });

      const clearSnap = () => {
        isSnapping = false;
        window.removeEventListener("scrollend", clearSnap);
      };
      window.addEventListener("scrollend", clearSnap);
      setTimeout(clearSnap, 600);
    };

    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      if (delta > 0.5) isSnapping = false;
      lastScrollY = window.scrollY;
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(snap, 120);
    };

    const onResize = () => {
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(snap, 200);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (debounceTimer !== null) clearTimeout(debounceTimer);
    };
  }, [isDesktop, reduced, N]);

  const active = Math.min(N - 1, Math.max(0, Math.floor(progress * N * 0.999)));

  if (!isDesktop || reduced) {
    return <TimelineFallback entries={entries} />;
  }

  const current = entries[active];

  return (
    <div
      ref={wrapRef}
      className="relative mt-10"
      style={{ height: `${N * 90 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-[1100px] grid-cols-[80px_1fr_1.1fr] items-center gap-10 px-5 md:px-8">
          {/* Progress rail */}
          <div className="relative flex h-[60vh] flex-col">
            <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
              step
            </div>
            <div
              className="display-tight mt-2 text-text"
              style={{ fontSize: "clamp(28px, 3vw, 44px)" }}
            >
              {String(active + 1).padStart(2, "0")}
              <span className="text-text-muted"> / {String(N).padStart(2, "0")}</span>
            </div>
            <div
              className="relative mt-6 flex-1 w-px"
              style={{ background: "var(--border)" }}
            >
              <motion.div
                className="absolute left-0 top-0 w-px origin-top"
                style={{ height: "100%", background: "var(--accent)", scaleY: progress }}
              />
              {entries.map((_, i) => (
                <div
                  key={i}
                  className="absolute -left-[3px] h-1.5 w-1.5 rounded-full"
                  style={{
                    top: `${(i / Math.max(1, N - 1)) * 100}%`,
                    background: i <= active ? "var(--accent)" : "var(--border)",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Left: role / details */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={`text-${active}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">
                  {current.date}
                </div>
                <div className="mt-2 text-sm text-left" style={{ color: "var(--accent)" }}>
                  {current.org}
                </div>
                <div
                  className="mt-2 display-tight text-text"
                  style={{ fontSize: "clamp(32px, 4.2vw, 56px)" }}
                >
                  {current.role}
                </div>
                <ul className="mt-6 space-y-2 text-[15px] text-text-soft">
                  {current.bullets.map((b, i) => (
                    <motion.li
                      key={b}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.15 + i * 0.07,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative pl-5"
                    >
                      <span className="absolute left-0 top-3 h-px w-3 bg-text-muted" />
                      {b}
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {current.tags.map((t, i) => (
                    <motion.span
                      key={t}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.3 + i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <Chip>{t}</Chip>
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: visual panel — company display type + accent motif */}
          <div className="relative h-[60vh] overflow-hidden border" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`vis-${active}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 flex flex-col justify-between p-8"
              >
                <div className="flex items-center justify-between">
                  <div className="label-tag">{current.date}</div>
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                </div>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="display-tight text-left text-text leading-[1.1]"
                  style={{
                    fontSize: fitOrgFontSize(current.org.split("·")[0].trim()),
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    overflowWrap: "normal",
                    wordBreak: "normal",
                    hyphens: "auto",
                  }}
                >
                  {current.org.split("·")[0].trim()}
                </motion.div>
                <div className="flex items-end justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
                    {String(active + 1).padStart(2, "0")} — {current.role}
                  </div>
                  <div
                    className="h-px"
                    style={{
                      width: `${((active + 1) / N) * 100}%`,
                      maxWidth: "40%",
                      background: "var(--accent)",
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
