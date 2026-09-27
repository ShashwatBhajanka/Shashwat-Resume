import { useState } from "react";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const next = y > 350;
    setShow((prev) => (prev === next ? prev : next));
  });
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-sm border bg-bg-elevated text-text-soft hover:text-accent transition-all md:h-10 md:w-10"
      style={{
        borderColor: "var(--border)",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(8px)",
        pointerEvents: show ? "auto" : "none",
      }}
    >
      <ArrowUp size={16} />
    </button>
  );
}
