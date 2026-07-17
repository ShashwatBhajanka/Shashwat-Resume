import { useState, type ReactNode } from "react";
import { ImagePlaceholder } from "./ImagePlaceholder";

export function FlipCard({
  front,
  back,
  gradient,
  wide,
  showPlaceholder = true,
}: {
  front: ReactNode;
  back: ReactNode;
  gradient: [string, string];
  wide?: boolean;
  showPlaceholder?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  };

  return (
    <button
      type="button"
      onClick={() => setOpen((o) => !o)}
      onKeyDown={onKey}
      aria-expanded={open}
      className={`group relative block h-56 w-full overflow-hidden text-left ${wide ? "md:col-span-2" : ""}`}
      style={{ border: "1px solid var(--border)" }}
    >
      {/* Front face — flat two-tone gradient */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
          opacity: open ? 0 : 1,
        }}
      />
      <div
        className="absolute inset-0 flex flex-col justify-between p-5 transition-all duration-500"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? "translateY(-8px)" : "translateY(0)",
        }}
      >
        {front}
      </div>

      {/* Back face — flat elevated surface */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background: "var(--bg-elevated)",
          opacity: open ? 1 : 0,
        }}
      />
      <div
        className="absolute inset-0 flex gap-4 p-5 transition-all duration-500"
        style={{
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(8px)",
        }}
      >
        {showPlaceholder && (
          <div className="w-24 shrink-0">
            <ImagePlaceholder aspect="1/1" />
          </div>
        )}
        <div className="flex flex-1 flex-col justify-between">
          {back}
          <div className="mt-2 self-end font-mono text-[9px] uppercase tracking-widest text-text-muted">
            ← close
          </div>
        </div>
      </div>
    </button>
  );
}
