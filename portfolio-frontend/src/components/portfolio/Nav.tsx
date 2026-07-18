import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
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
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top, behavior: "smooth" });
    history.replaceState(null, "", `#${id}`);
  };

  return (
    <nav
      className="fixed inset-x-0 top-0 z-50 h-12 transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "color-mix(in oklab, var(--bg) 78%, transparent)" : "transparent",
        backdropFilter: scrolled ? "blur(10px)" : undefined,
        borderBottom: scrolled ? "1px solid var(--border-soft)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex h-full max-w-[880px] items-center justify-between px-5 md:px-7">
        <a href="#home" onClick={jump("home")} className="text-xs text-text-soft hover:text-text transition">
          Shashwat Bhajanka
        </a>
        <div className="flex items-center gap-1 overflow-x-auto">
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
          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="ml-2 flex h-7 w-7 items-center justify-center rounded-md border hover:text-accent transition"
            style={{ borderColor: "var(--border)", color: "var(--text-soft)" }}
          >
            {theme === "dark" ? <Sun size={13} /> : <Moon size={13} />}
          </button>
          <div className="ml-1">
            <A11yMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}
