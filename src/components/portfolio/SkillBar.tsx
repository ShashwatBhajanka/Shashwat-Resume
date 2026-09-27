import { useEffect, useRef, useState } from "react";

export function SkillBar({ name, level, pct }: { name: string; level: string; pct: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setW(pct);
        });
      },
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [pct]);
  return (
    <div ref={ref} className="py-2.5">
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[13px] text-text">{name}</span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{level}</span>
      </div>
      <div className="h-[2px] w-full overflow-hidden">
        <div
          className="h-full origin-left bg-accent transition-transform duration-[1400ms] ease-out"
          style={{ transform: `scaleX(${w / 100})` }}
        />
      </div>
    </div>
  );
}
