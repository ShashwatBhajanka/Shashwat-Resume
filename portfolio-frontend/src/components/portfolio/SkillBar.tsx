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
        <span className="text-sm text-text">{name}</span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">{level}</span>
      </div>
      <div className="h-[2px] w-full overflow-hidden bg-border-soft">
        <div
          className="h-full bg-accent transition-[width] duration-[1400ms] ease-out"
          style={{ width: `${w}%` }}
        />
      </div>
    </div>
  );
}
