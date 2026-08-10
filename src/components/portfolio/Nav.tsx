import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { A11yMenu } from "./A11yMenu";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "clubs", label: "Clubs" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Achievements" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("home");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setMobileOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setMobileOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const initial = (document.documentElement.getAttribute("data-theme") as "dark" | "light") || "dark";
    setTheme(initial);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch {}
    setTheme(next);
  };

  const jump = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: "var(--bg)", backdropFilter: "blur(10px)", borderBottom: "1px solid var(--border-soft)" }}
    >
      <div className="mx-auto flex h-12 max-w-[880px] items-center justify-between px-5 md:px-7">
        <a
          href="#home"
          onClick={jump("home")}
          className="min-w-0 truncate text-xs text-text-soft hover:text-text transition"
        >
          Shashwat Bhajanka
        </a>
        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {SECTIONS.slice(1).map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={jump(s.id)}
                className="px-2 py-1 text-[11px] whitespace-nowrap transition-colors"
                style={{ color: active === s.id ? "var(--accent)" : "var(--text-soft)" }}
              >
                {s.label}
              </a>
            ))}
          </div>
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="ml-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-md border hover:text-accent transition md:ml-2 md:h-7 md:w-7"
            style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <div className="shrink-0">
            <A11yMenu />
          </div>
          <button
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border hover:text-accent transition md:hidden"
            style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div
          role="menu"
          className="border-t md:hidden"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg)" }}
        >
          {SECTIONS.slice(1).map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              onClick={jump(s.id)}
              role="menuitem"
              className="flex h-11 items-center px-5 text-sm transition-colors"
              style={{ color: active === s.id ? "var(--accent)" : "var(--text-soft)" }}
            >
              {s.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
