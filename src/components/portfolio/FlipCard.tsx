import { useState, type ReactNode } from "react";

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
  const [flipped, setFlipped] = useState(false);
  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-expanded={flipped}
      className={`group relative block h-44 w-full text-left [perspective:1000px] ${wide ? "md:col-span-2" : ""}`}
    >
      <div
        className="relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-md p-4 [backface-visibility:hidden]"
          style={{
            background: `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`,
            border: "1px solid var(--border-soft)",
          }}
        >
          {front}
        </div>
        <div
          className="absolute inset-0 flex flex-col justify-between rounded-md p-4 [backface-visibility:hidden]"
          style={{
            transform: "rotateY(180deg)",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
          }}
        >
          {back}
        </div>
      </div>
    </button>
  );
}
