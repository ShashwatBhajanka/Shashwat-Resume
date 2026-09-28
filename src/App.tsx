import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Calculator,
  Code,
  Database,
  FlaskConical,
  Mic,
  Music,
  Rocket,
  Sigma,
  Terminal,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { Nav } from "@/components/portfolio/Nav";
import { HalftoneField } from "@/components/portfolio/HalftoneField";
import { Reveal } from "@/components/portfolio/Reveal";
import { Counter } from "@/components/portfolio/Counter";
import { SkillBar } from "@/components/portfolio/SkillBar";
import { BackToTop } from "@/components/portfolio/BackToTop";
import { ImagePlaceholder } from "@/components/portfolio/ImagePlaceholder";
import { ScrollBrightenText } from "@/components/portfolio/ScrollBrightenText";

import { Carousel3D } from "@/components/portfolio/Carousel3D";
import { ExperienceScroll } from "@/components/portfolio/ExperienceScroll";

// One container + gutter for every band on the page (the nav uses the same).
const CONTAINER = "mx-auto max-w-[1100px] px-5 md:px-8";
const SECTION = `${CONTAINER} py-20 md:py-24`;

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="display-tight text-text"
      style={{ fontSize: "clamp(32px, 5vw, 56px)" }}
    >
      {children}
    </h2>
  );
}

function Intro({ children }: { children: React.ReactNode }) {
  return <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-text-soft">{children}</p>;
}

function Chip({ children, strong }: { children: React.ReactNode; strong?: boolean }) {
  return (
    <span
      className={`inline-flex h-7 items-center border px-2.5 font-mono text-[11px] ${strong ? "text-text" : "text-text-soft"}`}
      style={{ borderColor: "var(--border)" }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return (
    <div className={CONTAINER}>
      <div className="h-px w-full" style={{ background: "var(--border)" }} />
    </div>
  );
}

const EDUCATION = [
  {
    school: "Ashoka University",
    date: "2025 - 2029",
    degree: "BSc in Computer Science · Sonipat, India",
    group: "Relevant Coursework",
    chips: [
      "Quantitative & Mathematical Reasoning (A−)",
      "Calculus",
      "Intro to Computer Science (B+)",
      "Discrete Mathematics (A−)",
      "Data Structures & Algorithms (current)",
      "Probability & Statistics",
      "Accounting & Financial Statements"
    ],
    image: "/ashoka-university-logo.png",
    imageAlt: "Ashoka University logo",
  },
  {
    school: "Fountainhead School",
    date: "Graduated May 2025",
    degree: "IB Diploma, score 37/45 · Surat, India",
    groups: [
      { label: "Higher Level", chips: ["Mathematics AI HL (7/7)", "Computer Science HL (6/7)", "Economics HL (6/7)"] },
      { label: "Standard Level", chips: ["Psychology SL (6/7)", "English SL (6/7)", "Hindi SL (6/7)"] },
    ],
    image: "/fountainhead-school-logo.png",
    imageAlt: "Fountainhead School logo",
  },
];

const EXPERIENCE = [
  { date: "Present", org: "Lemon Technologies · RSM", role: "Python & Data Analytics Intern",
    bullets: [
      "Engineered production-grade software using Python, Django, and RESTful APIs",
      "Built automated PDF parsing pipelines reducing manual processing time by 60%+",
      "Leveraged Pandas and NumPy for analytics and cross-functional reporting",
      "Contributed across the full SDLC from architecture design to deployment",
    ], tags: ["Python", "Django", "SQL", "REST APIs", "Pandas"] },
  { date: "Oct 2025 – Mar 2026", org: "TYCHR · Remote, India", role: "Content Creator",
    bullets: [
      "Created online notes for IB AI HL mathematics and taught IB computer science through video",
      "Planned lessons using diverse teaching strategies to meet varied student needs",
    ], tags: ["IB Mathematics", "Computer Science", "Education"] },
  { date: "Oct 2024 – Jan 2025", org: "Research Labs", role: "Internship Project",
    bullets: [
      "Launched an online self-checkout system reducing wait times via real-time data processing",
      "Hit service time targets while understanding customer needs",
    ], tags: ["Cloud Architecture", "Real-time Systems"] },
  { date: "Aug 2024 – Sep 2024", org: "Groww", role: "Finance Intern",
    bullets: [
      "Analysed stocks and built portfolios for diverse demographics using predicted growth trends",
      "Coordinated with team members on project management tasks",
    ], tags: ["Finance", "Portfolio Analysis", "Excel"] },
  { date: "Jul 2024 – Aug 2024", org: "Samsonite", role: "Data Science Intern",
    bullets: ["Developed a data-driven marketing strategy using Google Data Studio and Excel"],
    tags: ["Data Studio", "Excel", "Marketing Analytics"] },
  { date: "Jun 2022 – Aug 2022", org: "EcoVision", role: "Systems and Consulting Intern",
    bullets: ["Provided sustainable plastic waste management solutions and ran social campaigns"],
    tags: ["Sustainability", "Consulting"] },
];

const PROGRAMMING = [
  { name: "Python", level: "Advanced", pct: 92 },
  { name: "SQL", level: "Proficient", pct: 82 },
  { name: "JavaScript", level: "Intermediate", pct: 68 },
  { name: "HTML / CSS", level: "Proficient", pct: 80 },
  { name: "Django", level: "Intermediate", pct: 65 },
];

type Card = {
  icon: LucideIcon;
  title: string;
  year?: string;
  org: string;
  desc?: string;
  image?: string;
  alt?: string;
};

const ACHIEVEMENTS: Card[] = [
  { icon: Sigma, title: "Distinction, Euclid Mathematics Competition", year: "2024",
    org: "University of Waterloo (CEMC)",
    desc: "Achieved a Distinction ranking in the Euclid Mathematics Contest, a competitive problem-solving exam covering algebra, geometry, and calculus.",
    image: "/achievements/euclid-math-distinction.jpg",
    alt: "Euclid Mathematics Contest certificate of distinction awarded to Shashwat Bhajanka by the University of Waterloo CEMC" },
  { icon: Music, title: "Trinity Piano & Music Theory, Distinction, Grade 2", year: "2023-24",
    org: "Trinity College London",
    desc: "Earned a Distinction in Grade 2 Piano Practical and Music Theory examinations, demonstrating proficiency in performance and theoretical understanding.",
    image: "/achievements/trinity-piano-distinction.jpg",
    alt: "Trinity College London Grade 2 piano and music theory certificate with distinction" },
  { icon: Mic, title: "First Place, Inter-School Competition", year: "2023",
    org: "Fountainhead School",
    desc: "Represented Fountainhead School as band lead and lead singer, securing first place.",
    image: "/achievements/inter-school-music-competition.jpg",
    alt: "Shashwat Bhajanka performing as lead singer with the Fountainhead School band at the inter-school music competition" },
];

const CERTIFICATIONS: Card[] = [
  { icon: Terminal, title: "Claude Code in Action", year: "2026", org: "Anthropic",
    image: "/certifications/claude-code-in-action.jpg",
    alt: "Anthropic Claude Code in Action course completion certificate" },
  { icon: Brain, title: "Machine Learning Basics", year: "2024", org: "Sungkyunkwan University",
    desc: "Completed an introductory course on Machine Learning. Learnt and practiced concepts such as supervised learning, regression, and classification models.",
    image: "/certifications/machine-learning.jpg",
    alt: "Sungkyunkwan University Machine Learning Basics course certificate" },
  { icon: Database, title: "SQL Programming", year: "2024", org: "Udemy",
    desc: "Learnt advanced SQL techniques, including complex data querying, multi-table joins, and data merging to drive actionable insights.",
    image: "/certifications/sql-programming.jpg",
    alt: "Udemy SQL programming course completion certificate" },
  { icon: Code, title: "Python: 100 Days of Code", year: "2024", org: "Udemy",
    image: "/certifications/python-100-days.jpg",
    alt: "Udemy 100 Days of Code Python bootcamp completion certificate" },
  { icon: Calculator, title: "Fundamental Financial Mathematics", year: "2024", org: "Udemy",
    image: "/certifications/financial-mathematics.jpg",
    alt: "Udemy Fundamental Financial Mathematics course completion certificate" },
  { icon: TrendingUp, title: "Introduction to Econometrics", year: "2023", org: "Udemy",
    image: "/certifications/econometrics.jpg",
    alt: "Udemy Introduction to Econometrics course completion certificate" },
  { icon: FlaskConical, title: "Data Science", year: "2023", org: "Udemy",
    image: "/certifications/data-science.jpg",
    alt: "Udemy Data Science course completion certificate" },
  { icon: Rocket, title: "Entrepreneurship", year: "2021", org: "Clever Harvey",
    image: "/certifications/entrepreneurship.jpg",
    alt: "Clever Harvey Entrepreneurship course certificate" },
];

function IconTile({ icon: Icon, size = 18 }: { icon: LucideIcon; size?: number }) {
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center border text-accent"
      style={{ borderColor: "var(--border)", background: "var(--accent-dim)" }}
      aria-hidden="true"
    >
      <Icon size={size} strokeWidth={1.5} />
    </span>
  );
}

function CarouselCard({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`View details: ${card.title}`}
      className="group absolute inset-0 flex h-full w-full flex-col overflow-hidden p-6 text-left"
      style={{ background: "var(--bg-elevated)" }}
    >
      <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: "var(--accent)" }} />
      <div className="flex items-start justify-between">
        <IconTile icon={card.icon} />
        <span className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{card.year ?? ""}</span>
      </div>
      <div className="mt-8">
        <div className="label-tag mb-2">{card.org}</div>
        <h4 className="display-tight text-[20px] leading-tight text-text">{card.title}</h4>
      </div>
      <div className="mt-auto pt-6">
        {card.image ? (
          <img
            src={card.image}
            alt={card.alt ?? card.title}
            loading="lazy"
            decoding="async"
            className="w-full aspect-[16/9] object-cover rounded-sm"
          />
        ) : (
          <ImagePlaceholder aspect="16/9" label={`${card.title}: image coming soon`} />
        )}
      </div>
      <div className="mt-4 font-mono text-[11px] uppercase tracking-widest text-text-muted transition-colors group-hover:text-accent">
        View →
      </div>
    </button>
  );
}

type ClubCardData = {
  role: string;
  org: string;
  desc: string;
  tags: string[];
  meta?: string;
  image?: string;
  alt?: string;
};

function ClubCard({ c, featured }: { c: ClubCardData; featured?: boolean }) {
  return (
    <div
      className={`h-full border p-6 ${featured ? "md:grid md:grid-cols-2 md:items-center md:gap-8" : ""}`}
      style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
    >
      {c.image ? (
        <img
          src={c.image}
          alt={c.alt ?? c.org}
          loading="lazy"
          decoding="async"
          className="w-full aspect-[16/9] object-cover rounded-sm"
        />
      ) : (
        <ImagePlaceholder aspect="16/9" label={`${c.org}: photo coming soon`} />
      )}
      <div className={featured ? "mt-5 md:mt-0" : "mt-5"}>
        <div className="flex items-center justify-between">
          <div className="label-tag">{c.org}</div>
          {c.meta && (
            <div className="font-mono text-[11px] uppercase tracking-widest text-accent">
              {c.meta}
            </div>
          )}
        </div>
        <h3 className="display-tight mt-2 text-text" style={{ fontSize: featured ? "28px" : "20px" }}>{c.role}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-text-soft">{c.desc}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
      </div>
    </div>
  );
}

const CLUBS: ClubCardData[] = [
  {
    role: "Co-Director of Builders",
    org: "AI4All",
    desc: "Building and shipping products with AI, and teaching students (including those new to AI) how to use AI tools to create real products.",
    tags: ["AI", "Teaching", "Product Building"],
    meta: "Present",
    image: "/ai4all-builders.jpg",
    alt: "AI4All builders session with students building products using AI tools",
  },
  {
    role: "Head of Research & Data Insights",
    org: "Ashoka Data Society",
    desc: "Lead independent research using university resources and varied data sources, publishing insights in a curated data review for the campus community.",
    tags: ["Research", "Data Analysis", "Publishing"],
    image: "/ashoka-data-society.png",
    alt: "Ashoka Data Society logo",
  },
  {
    role: "Full Stack Developer",
    org: "Ashoka Ministry of Technology",
    desc: "Build and maintain university services used by 3,000+ students, using web development and analytics to find real student needs.",
    tags: ["Full Stack", "3,000+ Users"],
    image: "/ashoka-ministry-of-technology.jpg",
    alt: "Ashoka Ministry of Technology team banner",
  },
  {
    role: "Vocalist",
    org: "Ashoka Apple Cellos",
    desc: "Member of the university's acapella society, performing at campus events and inter-college showcases.",
    tags: ["Acapella", "Performance"],
    meta: "Present",
    image: "/ashoka-apple-cellos.jpg",
    alt: "Ashoka Apple Cellos a cappella group performing on stage",
  },
  {
    role: "Varsity Player",
    org: "Ashoka Hammerheads",
    desc: "Represent Ashoka University on the Ultimate Frisbee varsity team across regional tournaments.",
    tags: ["Frisbee", "Varsity"],
    meta: "Present",
    image: "/ashoka-hammerheads-frisbee.jpg",
    alt: "Ashoka Hammerheads ultimate frisbee varsity team",
  },
];

const LINKS = [
  { label: "Email", href: "mailto:bhajankashashwat@gmail.com" },
  { label: "LinkedIn", href: "https://linkedin.com/in/shashwat-bhajanka" },
  { label: "GitHub", href: "https://github.com/ShashwatBhajanka" },
];

function CardModal({ card, onClose }: { card: Card; onClose: () => void }) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Move focus in, keep Tab inside, and hand focus back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>("button, a[href]");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      opener?.focus();
    };
  }, []);

  return (
    <motion.div
      ref={dialogRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="card-modal-title"
    >
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-sm border text-white/80 hover:text-white transition"
        style={{ borderColor: "rgba(255,255,255,0.2)" }}
      >
        <X size={18} />
      </button>
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-sm border"
        style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="absolute inset-x-0 top-0 h-0.5" style={{ background: "var(--accent)" }} />
        {card.image && <img src={card.image} alt={card.alt ?? card.title} className="w-full" />}
        <div className="p-6 md:p-8">
          <div className="mb-3 flex items-center gap-3">
            <IconTile icon={card.icon} size={16} />
            <div className="label-tag">{card.org}{card.year ? ` · ${card.year}` : ""}</div>
          </div>
          <h3 id="card-modal-title" className="display-tight text-xl md:text-2xl leading-tight text-text">
            {card.title}
          </h3>
          {card.desc && <p className="mt-4 text-[15px] leading-relaxed text-text-soft">{card.desc}</p>}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function App() {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedCard(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="relative min-h-screen">
      <a href="#main" className="skip-link">Skip to main content</a>
      <Nav />
      <BackToTop />

      <section id="home" className="relative">
        <HalftoneField strength={0.75} className="min-h-[100dvh] hero-scrim">
          <div className={`relative z-10 flex min-h-[100dvh] flex-col justify-end pb-16 pt-24 md:pb-24 ${CONTAINER}`}>
            <Reveal delay={0.1}>
              <h1
                className="font-dots text-text"
                style={{ fontSize: "clamp(52px, 11vw, 124px)", lineHeight: 0.92 }}
              >
                SHASHWAT<br />BHAJANKA
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[560px] text-[16px] leading-relaxed text-text-soft">
                Computer Science student at Ashoka University and Python &amp; data analytics intern, building data pipelines and web apps.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-4 flex flex-wrap gap-x-6">
                {LINKS.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="inline-flex min-h-11 items-center font-mono text-[12px] uppercase tracking-widest text-text underline underline-offset-[6px] decoration-text-muted hover:decoration-accent hover:text-accent transition"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </HalftoneField>
      </section>

      <main id="main" className="relative scroll-mt-16">
        <section id="overview" className={SECTION}>
          <Reveal><H2>About Me</H2></Reveal>
          <div className="mt-6 max-w-[820px] text-[20px] md:text-[24px] leading-[1.45] font-light">
            <ScrollBrightenText text="I'm a Computer Science student at Ashoka University who likes turning messy data into software people actually use. As a Python and data analytics intern at Lemon Technologies, I build PDF parsing pipelines that cut manual processing time by more than 60%. On campus I build services used by 3,000+ students, lead research at the Ashoka Data Society, and teach students to ship products with AI." />
          </div>
          <Reveal delay={0.2}>
            <div className="mt-12 grid grid-cols-1 gap-8 border-t pt-8 sm:grid-cols-3 sm:gap-4" style={{ borderColor: "var(--border)" }}>
              {[
                { n: EXPERIENCE.length, label: "Roles held" },
                { n: CERTIFICATIONS.length, label: "Certifications" },
                { n: 3000, suffix: "+", label: "Students served" },
              ].map((s) => (
                <div key={s.label} className="sm:border-l sm:pl-5 sm:first:border-l-0 sm:first:pl-0" style={{ borderColor: "var(--border)" }}>
                  <div className="font-dots leading-none text-text" style={{ fontSize: "clamp(44px, 6vw, 80px)" }}>
                    <Counter to={s.n} suffix={s.suffix} />
                  </div>
                  <div className="label-tag mt-3">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Divider />

        <section id="education" className={SECTION}>
          <Reveal><H2>Education</H2></Reveal>
          <Reveal delay={0.1}>
            <Intro>Coursework, grades, and the foundation of my analytical thinking.</Intro>
          </Reveal>
          <div className="mt-10 space-y-10">
            {EDUCATION.map((e, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 border-t pt-8" style={{ borderColor: "var(--border)" }}>
                  <div className="font-mono text-[12px] uppercase tracking-widest text-text-muted">{e.date}</div>
                  <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-6">
                    <div className="w-24 md:w-full">
                      {e.image ? (
                        <img
                          src={e.image}
                          alt={e.imageAlt ?? e.school}
                          loading="lazy"
                          decoding="async"
                          className="w-full aspect-square object-cover rounded-sm"
                        />
                      ) : (
                        <ImagePlaceholder aspect="1/1" label={`${e.school} logo`} />
                      )}
                    </div>
                    <div>
                      <h3 className="display-tight text-2xl md:text-3xl text-text">{e.school}</h3>
                      <div className="mt-2 text-[15px] text-text-soft">{e.degree}</div>
                      {"chips" in e && e.chips ? (
                        <div className="mt-6">
                          <div className="label-tag mb-3">{e.group}</div>
                          <div className="flex flex-wrap gap-1.5">{e.chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>
                        </div>
                      ) : null}
                      {"groups" in e && e.groups ? (
                        <div className="mt-6 space-y-4">
                          {e.groups.map((g) => (
                            <div key={g.label}>
                              <div className="label-tag mb-3">{g.label}</div>
                              <div className="flex flex-wrap gap-1.5">{g.chips.map((c) => <Chip key={c}>{c}</Chip>)}</div>
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        <section id="experience" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><div className="label-tag mb-4">Experience</div></Reveal>
          <Reveal delay={0.05}><H2>Where I've Worked</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Real-world roles that shaped my approach to building and problem-solving.</p>
          </Reveal>
          <ExperienceScroll entries={EXPERIENCE} />
        </section>

        <Divider />

        <section id="clubs" className={SECTION}>
          <Reveal><H2>Communities &amp; Pursuits</H2></Reveal>
          <Reveal delay={0.1}>
            <Intro>Where code meets culture: leadership, art, and sport.</Intro>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLUBS.map((c, i) => (
              <Reveal key={c.org} delay={(i % 2) * 0.08} className={i === 0 ? "md:col-span-2" : undefined}>
                <ClubCard c={c} featured={i === 0} />
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        <section id="skills" className={SECTION}>
          <Reveal><H2>Skills</H2></Reveal>
          <Reveal delay={0.1}>
            <Intro>Languages, tools, and competencies I bring to every project.</Intro>
          </Reveal>
          <div className="mt-10 space-y-10">
            <Reveal>
              <h3 className="label-tag mb-4">Programming</h3>
              <div className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {PROGRAMMING.map((s) => <SkillBar key={s.name} name={s.name} level={s.level} pct={s.pct} />)}
              </div>
            </Reveal>
            <Reveal>
              <h3 className="label-tag mb-4">Tools</h3>
              <div className="flex flex-wrap gap-1.5">
                {["Excel", "Google Data Studio", "Claude Code", "Python Libraries", "Orange", "OpenRouter", "REST APIs"].map((t) => (
                  <Chip key={t} strong>{t}</Chip>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <h3 className="label-tag mb-4">Competencies</h3>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Data Analysis", "Web App Development", "Statistical Modelling", "Analytical Thinking",
                  "Critical Thinking", "Project Management", "Team Collaboration", "Problem Solving",
                ].map((l) => (
                  <Chip key={l} strong>{l}</Chip>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section id="achievements" className="relative">
          <HalftoneField strength={0.6} className="h-[280px] hero-scrim">
            <div className={`relative z-10 flex h-full flex-col justify-end pb-4 ${CONTAINER}`}>
              <Reveal>
                <h2 className="display-tight text-text" style={{ fontSize: "clamp(40px, 7vw, 80px)" }}>
                  Achievements<br />&amp; Certifications
                </h2>
              </Reveal>
            </div>
          </HalftoneField>
          <div className={`${CONTAINER} pt-1`}>
            <Intro>Awards I have earned and courses I have completed.</Intro>
            <a href="#certifications" className="sr-only focus:not-sr-only focus:mt-4 focus:inline-block font-mono text-[12px] uppercase tracking-widest text-accent">
              Skip the achievements carousel
            </a>
          </div>
          <Carousel3D
            items={ACHIEVEMENTS}
            label="Achievements carousel"
            header={<h3 className="display-tight text-[28px] text-text">Achievements</h3>}
            renderCard={(a) => <CarouselCard card={a} onClick={() => setSelectedCard(a)} />}
          />
          <div id="certifications" className={`${CONTAINER} scroll-mt-16`}>
            <a href="#contact" className="sr-only focus:not-sr-only focus:mt-4 focus:inline-block font-mono text-[12px] uppercase tracking-widest text-accent">
              Skip the certifications carousel
            </a>
          </div>
          <Carousel3D
            items={CERTIFICATIONS}
            label="Certifications carousel"
            header={<h3 className="display-tight text-[28px] text-text">Certifications</h3>}
            renderCard={(c) => <CarouselCard card={c} onClick={() => setSelectedCard(c)} />}
          />
          <div className="h-16 md:h-24" aria-hidden="true" />
        </section>

        <footer id="contact" className="relative">
          <HalftoneField strength={1} interactive className="h-[560px]">
            <div className={`relative z-10 flex h-full flex-col justify-between py-14 ${CONTAINER}`}>
              <h2 className="label-tag" style={{ color: "var(--text)" }}>Contact</h2>
              <div>
                <div className="display-tight" style={{ fontSize: "clamp(36px, 7vw, 96px)", fontWeight: 800 }}>
                  <span className="inline-block px-3 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                    Building with data?
                  </span>
                  <br />
                  <span className="mt-2 inline-block px-3 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                    Let&apos;s talk.
                  </span>
                </div>
                <div className="mt-10 flex flex-wrap items-center gap-3">
                  {LINKS.map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="inline-flex h-11 items-center border px-5 font-mono text-[12px] font-semibold uppercase tracking-widest text-text transition hover:text-accent"
                      style={{ borderColor: "var(--accent)", background: "var(--bg-elevated)" }}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex h-7 items-center border px-2.5 font-mono text-[11px] text-text-soft" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Built by Shashwat Bhajanka
                </span>
                <span className="inline-flex h-7 items-center border px-2.5 font-mono text-[11px] text-text-soft" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Last updated · September 2026
                </span>
              </div>
            </div>
          </HalftoneField>
        </footer>
      </main>

      <AnimatePresence>
        {selectedCard && (
          <CardModal key="modal" card={selectedCard} onClose={() => setSelectedCard(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
