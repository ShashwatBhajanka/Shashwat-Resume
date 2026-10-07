import { useState } from "react";
import { motion } from "framer-motion";

export type ClubItem = {
  role: string;
  org: string;
  desc: string;
  tags: string[];
  meta?: string;
  image?: string;
  alt?: string;
};

const EASE = [0.16, 1, 0.3, 1] as const;

export function ClubsAccordion({ items }: { items: ClubItem[] }) {
  const [active, setActive] = useState(0);

  return (
    <div className="mx-auto mt-10 flex h-[680px] w-full max-w-[1440px] flex-col gap-2 px-5 md:h-[600px] md:flex-row md:px-10">
      {items.map((c, i) => {
        const on = i === active;
        const isLogo = c.image?.endsWith(".png");
        return (
          <motion.div
            key={c.org}
            layout={false}
            initial={false}
            animate={{ flexGrow: on ? 6 : 1 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative min-h-[56px] min-w-0 basis-0 overflow-hidden border md:min-h-0 md:min-w-[56px]"
            style={{ borderColor: on ? "var(--accent)" : "var(--border)", background: "var(--bg-elevated)" }}
            onMouseEnter={() => window.matchMedia("(hover: hover)").matches && setActive(i)}
          >
            {c.image && (
              <img
                src={c.image}
                alt=""
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full transition-[filter,opacity,transform] duration-700 ${
                  isLogo ? "object-contain p-16" : "object-cover"
                } ${on ? "scale-100 opacity-100 grayscale-0" : "scale-110 opacity-40 grayscale"}`}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                background: on
                  ? "linear-gradient(0deg, var(--bg) 0%, color-mix(in oklab, var(--bg) 70%, transparent) 38%, transparent 75%)"
                  : "color-mix(in oklab, var(--bg) 55%, transparent)",
              }}
            />

            <button
              type="button"
              aria-expanded={on}
              aria-label={`${c.org}: ${c.role}`}
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="absolute inset-0 z-10 cursor-pointer"
            />

            {/* Collapsed rail label */}
            <div
              className={`pointer-events-none absolute inset-0 flex items-center gap-3 px-4 transition-opacity duration-300 md:flex-col md:justify-between md:px-0 md:py-5 ${
                on ? "opacity-0" : "opacity-100 delay-300"
              }`}
            >
              <span className="font-dots text-xl text-text-muted md:text-2xl">{String(i + 1).padStart(2, "0")}</span>
              <span className="display-tight truncate text-base text-text md:text-lg md:[writing-mode:vertical-rl] md:rotate-180">
                {c.org}
              </span>
            </div>

            {/* Expanded content */}
            <motion.div
              animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }}
              transition={{ duration: 0.5, delay: on ? 0.25 : 0, ease: EASE }}
              className="pointer-events-none absolute inset-x-0 bottom-0 p-5 md:p-8"
              aria-hidden={!on}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="label-tag">{c.org}</div>
                {c.meta && (
                  <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-accent">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "var(--accent)" }} />
                    {c.meta}
                  </div>
                )}
              </div>
              <h3 className="display-tight mt-2 text-text" style={{ fontSize: "clamp(24px, 3.2vw, 38px)" }}>{c.role}</h3>
              <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-text-soft">{c.desc}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex h-7 items-center border px-2.5 font-mono text-[11px] text-text-soft"
                    style={{ borderColor: "var(--border)", background: "color-mix(in oklab, var(--bg) 60%, transparent)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}
