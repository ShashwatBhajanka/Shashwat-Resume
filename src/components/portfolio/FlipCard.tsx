import { useRef, useState, type ReactNode } from "react";

export function FlipCard({
  front,
  back,
  gradient,
  wide,
}: {
  front: ReactNode;
  back: ReactNode;
  gradient: [string, string];
  wide?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ rx: (0.5 - y) * 8, ry: (x - 0.5) * 10, mx: x * 100, my: y * 100 });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 50, my: 50 });

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen((o) => !o)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onKeyDown={onKey}
      aria-expanded={open}
      className={`group relative block h-48 w-full overflow-hidden rounded-md text-left ${wide ? "md:col-span-2" : ""}`}
      style={{
        border: "1px solid var(--border-soft)",
        transform: `perspective(900px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: "transform 400ms cubic-bezier(0.22, 1, 0.36, 1)",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Base gradient layer */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})` }}
      />

      {/* Cursor spotlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(300px circle at ${tilt.mx}% ${tilt.my}%, rgba(255,255,255,0.22), transparent 60%)`,
          mixBlendMode: "overlay",
        }}
      />

      {/* Grain overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />

      {/* Front face content */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-4 transition-all duration-[600ms]"
        style={{
          transform: open ? "translateY(-14px)" : "translateY(0)",
          opacity: open ? 0 : 1,
          transitionTimingFunction: "cubic-bezier(0.65, 0, 0.35, 1)",
        }}
      >
        {front}
      </div>

      {/* Back panel — diagonal clip-path wipe */}
      <div
        className="absolute inset-0 flex flex-col justify-between p-4"
        style={{
          background: "var(--bg-elevated)",
          borderTop: "1px solid var(--border)",
          clipPath: open
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : "polygon(100% 0, 100% 0, 100% 100%, 100% 100%)",
          transition: "clip-path 700ms cubic-bezier(0.83, 0, 0.17, 1)",
        }}
      >
        <div
          style={{
            transform: open ? "translateX(0)" : "translateX(20px)",
            opacity: open ? 1 : 0,
            transition: "transform 600ms cubic-bezier(0.22, 1, 0.36, 1) 150ms, opacity 400ms ease 150ms",
          }}
        >
          {back}
        </div>
        <div
          className="self-end font-mono text-[10px] uppercase tracking-widest text-text-muted"
          style={{
            opacity: open ? 1 : 0,
            transition: "opacity 400ms ease 250ms",
          }}
        >
          ← close
        </div>
      </div>

      {/* Corner marker */}
      <div
        className="pointer-events-none absolute right-3 top-3 h-1.5 w-1.5 rounded-full"
        style={{
          background: "rgba(255,255,255,0.6)",
          transform: open ? "scale(0)" : "scale(1)",
          transition: "transform 300ms ease",
        }}
      />
    </button>
  );
}
