import { useEffect, useRef, useState } from "react";
import { Accessibility, Check } from "lucide-react";

type Toggle = { key: string; label: string; desc: string };

const TOGGLES: Toggle[] = [
  { key: "a11y-large", label: "Larger text", desc: "Increase base font size" },
  { key: "a11y-contrast", label: "High contrast", desc: "Boost text contrast" },
  { key: "a11y-underline", label: "Underline links", desc: "Always underline links" },
  { key: "a11y-reduce", label: "Reduce motion", desc: "Disable animations" },
];

function readState(): Record<string, boolean> {
  try {
    return JSON.parse(localStorage.getItem("a11y-prefs") || "{}");
  } catch {
    return {};
  }
}

function applyState(state: Record<string, boolean>) {
  const root = document.documentElement;
  TOGGLES.forEach((t) => root.classList.toggle(t.key, !!state[t.key]));
}

export function A11yMenu() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<Record<string, boolean>>({});
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = readState();
    setState(s);
    applyState(s);
  }, []);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const toggle = (key: string) => {
    const next = { ...state, [key]: !state[key] };
    setState(next);
    applyState(next);
    try {
      localStorage.setItem("a11y-prefs", JSON.stringify(next));
    } catch {}
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="Accessibility settings"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-7 w-7 items-center justify-center rounded-md border hover:text-accent transition"
        style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
      >
        <Accessibility size={13} />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-9 z-50 w-64 border p-1"
          style={{
            background: "var(--bg-elevated)",
            borderColor: "var(--border)",
            boxShadow: "0 20px 50px rgba(0,0,0,0.45)",
          }}
        >
          <div className="px-3 py-2 label-tag">Accessibility</div>
          {TOGGLES.map((t) => (
            <button
              key={t.key}
              role="menuitemcheckbox"
              aria-checked={!!state[t.key]}
              onClick={() => toggle(t.key)}
              className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-[color-mix(in_oklab,var(--text)_6%,transparent)] transition-colors"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center border"
                style={{
                  borderColor: "var(--border)",
                  background: state[t.key] ? "var(--text)" : "transparent",
                }}
              >
                {state[t.key] && <Check size={11} style={{ color: "var(--bg)" }} />}
              </span>
              <span className="flex-1">
                <span className="block text-xs text-text">{t.label}</span>
                <span className="block font-mono text-[10px] text-text-muted">{t.desc}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
