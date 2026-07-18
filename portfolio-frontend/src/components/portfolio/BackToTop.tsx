import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const on = () => setShow(window.scrollY > 350);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return (
    <button
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 flex h-10 w-10 items-center justify-center rounded-full border bg-bg-elevated text-text-soft hover:text-accent transition-all"
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
