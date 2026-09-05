import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

function SectionLabel({ children }: { children: string }) {
  return <div className="label-tag mb-4">{children}</div>;
}

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

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] text-text-soft"
      style={{ borderColor: "var(--border)" }}
    >
      {children}
    </span>
  );
}

function Divider() {
  return <div className="h-px w-full" style={{ background: "var(--border-soft)" }} />;
}

const EDUCATION = [
  {
    school: "Ashoka University",
    date: "2025 – 2029",
    degree: "BSc in Computer Science · Sonipat, India",
    group: "Relevant Coursework",
    chips: [
      "Quantitative & Mathematical Reasoning (A−)",
      "Calculus",
      "Intro to Computer Science (B+)",
      "Discrete Mathematics (A−)",
      "Data Structures & Algorithms(current)",
      "Probability & statistics",
      "Accounting & financial statements"
    ],
    image: "/ashoka.png",
  },
  {
    school: "Fountainhead School",
    date: "Graduated May 2025",
    degree: "IB Diploma, score 37/45 · Surat, India",
    groups: [
      { label: "Higher Level", chips: ["Mathematics AI HL (7/7)", "Computer Science HL (6/7)", "Economics HL (6/7)"] },
      { label: "Standard Level", chips: ["Psychology SL (6/7)", "English SL (6/7)", "Hindi SL (6/7)"] },
    ],
    image: "/FHS.png",
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

const YEARS_OF_EXPERIENCE = Math.max(
  0,
  Math.floor((Date.now() - new Date("2022-06-01").getTime()) / (365.25 * 24 * 3600 * 1000))
);

type Card = {
  emoji: string;
  title: string;
  year?: string;
  org: string;
  desc?: string;
  accent: string;
  image?: string;
};

const ACHIEVEMENTS: Card[] = [
  { emoji: "🏅", title: "Distinction, Euclid Mathematics Competition", year: "2024",
    org: "University of Waterloo (CEMC)",
    desc: "Achieved a Distinction ranking in the Euclid Mathematics Contest, a competitive problem-solving exam covering algebra, geometry, and calculus.",
    accent: "#1A6B5A",
    image: "/achievemements/EuclidMath.png" },
  { emoji: "🎵", title: "Trinity Piano & Music Theory, Distinction – Grade 2", year: "2023–24",
    org: "Trinity College London",
    desc: "Earned a Distinction in Grade 2 Piano Practical and Music Theory examinations, demonstrating proficiency in performance and theoretical understanding.",
    accent: "#6D28D9",
    image: "/achievemements/Piano.png" },
  { emoji: "🥇", title: "First Place, Inter-School Competition", year: "2023",
    org: "Fountainhead School",
    desc: "Represented Fountainhead School as band lead and lead singer, securing first place.",
    accent: "#B45309",
    image: "/achievemements/MusicCompetition.png" },
];

const CERTIFICATIONS: Card[] = [
  { emoji: "🤖", title: "Claude Code in Action", year: "2026", org: "Anthropic",
    accent: "#C2692C",
    image: "/Certifications/ClaudeCert.png" },
  { emoji: "🤖", title: "Machine Learning Basics", year: "2024", org: "Sung Kyun Kwan University",
    desc: "Completed an introductory course on Machine Learning. Learnt and practiced concepts such as supervised learning, regression, and classification models.",
    accent: "#0369A1",
    image: "/Certifications/MachineLearning.png" },
  { emoji: "🗄️", title: "SQL Programming", year: "2024", org: "Udemy",
    desc: "Learnt advanced SQL techniques, including complex data querying, multi-table joins, and data merging to drive actionable insights.",
    accent: "#047857",
    image: "/Certifications/SQL.png" },
  { emoji: "🐍", title: "Python — 100 Days of Code", year: "2024", org: "Udemy",
    accent: "#B45309",
    image: "/Certifications/Python.png" },
  { emoji: "💰", title: "Fundamental Financial Mathematics", year:"2024", org: "Udemy",
    accent: "#4F46E5",
    image: "/Certifications/FinancialMath.png" },
  { emoji: "📊", title: "Introduction to Econometrics", year:"2023",org: "Udemy",
    accent: "#7C3AED",
    image: "/Certifications/Econometrics.png" },
  { emoji: "🔬", title: "Data Science",  year:"2023", org: "Udemy",
    accent: "#0891B2",
    image: "/Certifications/DataSceince.png" },
  { emoji: "🚀", title: "Entrepreneurship", year:"2021", org: "Clever Harvey",
    accent: "#C2410C",
    image: "/Certifications/Entreprenureship.png" },
];

function CarouselFlipCard({ card, onClick }: { card: Card; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className="absolute inset-0 w-full h-full overflow-hidden text-left cursor-pointer"
      style={{ background: "var(--bg-elevated)" }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        className="absolute inset-0 flex flex-col p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between">
          <motion.div
            className="flex h-11 w-11 items-center justify-center border text-lg"
            style={{
              borderColor: "var(--border)",
              background: `color-mix(in oklab, ${card.accent} 14%, transparent)`,
            }}
            initial={{ scale: 0.8, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            {card.emoji}
          </motion.div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            {card.year ?? ""}
          </span>
        </div>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="label-tag mb-2">{card.org}</div>
          <div className="text-[18px] font-semibold leading-tight text-text display-tight">
            {card.title}
          </div>
        </motion.div>
        <motion.div
          className="mt-auto pt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
          {card.image ? (
            <motion.img
              src={card.image}
              alt={card.title}
              className="w-full aspect-[16/9] object-cover rounded-xl"
              style={{ borderRadius: "12px" }}
              initial={{ scale: 1.05, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          ) : (
            <ImagePlaceholder aspect="16/9" />
          )}
        </motion.div>
        <motion.div
          className="mt-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <span>detail</span>
          <span>tap to view →</span>
        </motion.div>
        <motion.div
          className="absolute inset-x-0 top-0 h-1"
          style={{
            background: `linear-gradient(90deg, ${card.accent}, color-mix(in oklab, ${card.accent} 40%, transparent))`,
            transformOrigin: "left center",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30, delay: 0.1 }}
        />
      </motion.div>
    </motion.button>
  );
}

type ClubCardData = {
  role: string;
  org: string;
  desc: string;
  tags: string[];
  meta?: string;
  image?: string;
};

function ClubCard({ c }: { c: ClubCardData }) {
  return (
    <div className="h-full border p-6" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
      {c.image ? (
        <img
          src={c.image}
          alt={c.org}
          className="w-full aspect-[16/9] object-cover mb-5"
          style={{ borderRadius: "4px" }}
        />
      ) : (
        <ImagePlaceholder aspect="16/9" />
      )}
      <div className="mt-5 flex items-center justify-between">
        <div className="label-tag">{c.org}</div>
        {c.meta && (
          <div className="font-mono text-[10px] uppercase tracking-widest text-text-muted">
            {c.meta}
          </div>
        )}
      </div>
      <div className="mt-2 text-lg font-semibold text-text display-tight">{c.role}</div>
      <p className="mt-3 text-sm leading-relaxed text-text-soft">{c.desc}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
    </div>
  );
}

const CLUBS: ClubCardData[] = [
  {
    role: "Head of Dept — Research & Data Insights",
    org: "Ashoka Data Society",
    desc: "Lead independent research using university resources and varied data sources, publishing insights in a curated data review for the campus community.",
    tags: ["Research", "Data Analysis", "Publishing"],
    image: "/data.png",
  },
  {
    role: "Co-Director of Builders",
    org: "AI4All",
    desc: "Building and shipping products using AI, while teaching students — including those new to AI — how to use AI tools to create real products.",
    tags: ["AI", "Teaching", "Product Building"],
    meta: "Present",
    image: "/AI4All.png",
  },
  {
    role: "Full Stack Developer",
    org: "Ashoka Ministry of Technology",
    desc: "Build and maintain university services used by 3,000+ students — applying web dev and analytics to identify real student needs.",
    tags: ["Full Stack", "3,000+ Users"],
    image: "/TechMin.jpg",
  },
  {
    role: "Vocalist",
    org: "Ashoka Apple Cellos",
    desc: "Member of the university's acapella society, performing at campus events and inter-college showcases.",
    tags: ["Acapella", "Performance"],
    meta: "Present",
    image: "/AppleCello.JPG",
  },
  {
    role: "Varsity Player",
    org: "Ashoka Hammerheads",
    desc: "Represent Ashoka University on the Ultimate Frisbee varsity team across regional tournaments.",
    tags: ["Frisbee", "Varsity"],
    meta: "Present",
    image: "/Frisbee.JPG",
  },
];

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
        <HalftoneField strength={0.75} className="min-h-[100svh] hero-scrim">
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1100px] flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
            <Reveal>
              <div className="label-tag mb-6" style={{ color: "var(--text)" }}>Portfolio · 2026</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="display-tight text-text"
                style={{ fontSize: "clamp(56px, 12vw, 132px)" }}
              >
                Shashwat<br />Bhajanka
              </h1>
             </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[560px] text-[15px] leading-relaxed text-text-soft">
                Computer Science Student &amp; Data Analyst. Building at the intersection of data, code, and impact. Hands-on experience in analytics, web development, and research.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs">
                {[
                  { label: "Email", href: "mailto:bhajankashashwat@gmail.com" },
                  { label: "LinkedIn", href: "https://linkedin.com/in/shashwat-bhajanka" },
                  { label: "GitHub", href: "https://github.com/ShashwatBhajanka" },
                ].map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer"
                    className="font-mono uppercase tracking-widest text-text underline underline-offset-[6px] decoration-text-muted hover:decoration-accent hover:text-accent transition"
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
        <section id="overview" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Introduction</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>About Me</H2></Reveal>
          <div className="mt-10 max-w-[820px] text-[20px] md:text-[24px] leading-[1.45] font-light">
            <ScrollBrightenText text="Welcome to my digital notebook — a curated collection of my academic journey, professional experience, technical skills, and the things I've built along the way. Every entry here represents a chapter of growth, from classroom theory to real-world impact. I thrive at the crossroads of data science, software engineering, and creative problem-solving." />
          </div>
          <Reveal delay={0.2}>
            <div className="mt-16 grid grid-cols-3 gap-4 border-t pt-10" style={{ borderColor: "var(--border)" }}>
              {[
                { n: 3, label: "Projects" },
                { n: YEARS_OF_EXPERIENCE, label: "Years of Experience" },
                { n: EXPERIENCE.length, label: "Roles Held" },
              ].map((s, i) => (
                <div key={i} className="border-l pl-5 first:border-l-0 first:pl-0" style={{ borderColor: "var(--border)" }}>
                  <div className="display-tight text-text" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                    {s.n === null ? <span className="text-text-muted">—</span> : <Counter to={s.n} />}
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="label-tag">{s.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>




        <section id="education" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Education</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Academic Background</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Coursework, grades, and the foundation of my analytical thinking.</p>
          </Reveal>
          <div className="mt-16 space-y-14">
            {EDUCATION.map((e, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 border-t pt-8" style={{ borderColor: "var(--border)" }}>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{e.date}</div>
                  <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-6">
                    <div className="w-40">
                      {e.image ? (
                        <img
                          src={e.image}
                          alt={e.school}
                          className="w-full aspect-square object-cover"
                          style={{ borderRadius: "8px" }}
                        />
                      ) : (
                        <ImagePlaceholder aspect="1/1" />
                      )}
                    </div>
                    <div>
                      <div className="text-2xl md:text-3xl font-semibold text-text display-tight">{e.school}</div>
                      <div className="mt-2 text-sm text-text-soft">{e.degree}</div>
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
          <Reveal><SectionLabel>Experience</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Where I've Worked</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Real-world roles that shaped my approach to building and problem-solving.</p>
          </Reveal>
          <ExperienceScroll entries={EXPERIENCE} />
        </section>

        <Divider />

        <section id="clubs" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Campus Life</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Communities &amp; Pursuits</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Where code meets culture — leadership, art, and sport.</p>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {CLUBS.map((c, i) => (
              <Reveal key={c.org} delay={i * 0.08}>
                <ClubCard c={c} />
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        <section id="skills" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Skills</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Technical Proficiency</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Languages, tools, and competencies I bring to every project.</p>
          </Reveal>
          <div className="mt-16 space-y-14">
            <Reveal>
              <div className="label-tag mb-5">Programming</div>
              <div className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {PROGRAMMING.map((s) => <SkillBar key={s.name} name={s.name} level={s.level} pct={s.pct} />)}
              </div>
            </Reveal>
            <Reveal>
              <div className="label-tag mb-5">Tools</div>
              <div className="flex flex-wrap gap-2">
                {["Excel", "Google Data Studio", "Claude Code", "Pyhton Libraries", "Orange", "Openrouter", "REST APIs"].map((t) => (
                  <span key={t} className="border px-4 py-2 text-sm text-text" style={{ borderColor: "var(--border)" }}>{t}</span>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="label-tag mb-5">Competencies</div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["📊", "Data Analysis"], ,["💻","Web App Developement"],["📈", "Statistical Modelling"], ["🧠", "Analytical Thinking"],
                  ["🔍", "Critical Thinking"], ["📋", "Project Management"], ["🤝", "Team Collaboration"],
                  ["💡", "Problem Solving"],
                ].map(([e, l]) => (
                  <span key={l} className="inline-flex items-center gap-1.5 border px-4 py-2 text-sm text-text" style={{ borderColor: "var(--border)" }}>
                    <span>{e}</span>{l}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Divider />

        <section id="achievements" className="relative">
          <div className="relative">
            <HalftoneField strength={0.6} className="h-[360px] hero-scrim">
              <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 pb-14 md:px-8">
                <Reveal><SectionLabel>Portfolio</SectionLabel></Reveal>
                <Reveal delay={0.05}>
                  <h2 className="display-tight text-text" style={{ fontSize: "clamp(40px, 7vw, 88px)" }}>
                    Achievements<br />&amp; Certifications
                  </h2>
                </Reveal>
              </div>
            </HalftoneField>
          </div>
          <div className="mx-auto max-w-[1100px] px-5 md:px-8 py-16 md:py-24">
            <Reveal delay={0.1}>
              <p className="max-w-[560px] text-sm text-text-soft">Milestones, credentials, and proof points from the journey so far.</p>
            </Reveal>
            <div className="mt-14">
              <div className="label-tag mb-5">🏅 Achievements · scroll to advance</div>
            </div>
          </div>
          <Carousel3D
            items={ACHIEVEMENTS}
            label="Achievements carousel"
            renderCard={(a) => <CarouselFlipCard card={a} onClick={() => setSelectedCard(a)} />}
          />
          <div className="mx-auto max-w-[1100px] px-5 md:px-8 pt-16">
            <div className="label-tag mb-5">📜 Certifications · scroll to advance</div>
          </div>
          <Carousel3D
            items={CERTIFICATIONS}
            label="Certifications carousel"
            renderCard={(a) => <CarouselFlipCard card={a} onClick={() => setSelectedCard(a)} />}
          />
        </section>

        <footer id="contact" className="relative">
          <HalftoneField strength={1} interactive className="h-[560px]">
            <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-between px-5 py-14 md:px-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Contact
                </span>
                <span className="border px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-widest text-text-soft" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Always open to a conversation
                </span>
              </div>
              <div className="text-center">
                <div className="display-tight" style={{ fontSize: "clamp(40px, 8vw, 108px)", fontWeight: 800 }}>
                  <span className="inline-block px-3 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                    Have an idea?
                  </span>
                  <br />
                  <span className="mt-2 inline-block px-3 py-1" style={{ background: "var(--accent)", color: "var(--bg)" }}>
                    Let&apos;s make it real.
                  </span>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                  {[
                    { label: "Email", href: "mailto:bhajankashashwat@gmail.com" },
                    { label: "LinkedIn", href: "https://linkedin.com/in/shashwat-bhajanka" },
                    { label: "GitHub", href: "https://github.com/ShashwatBhajanka" },
                  ].map((l) => (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      className="border px-4 py-2 font-mono text-[11px] font-semibold uppercase tracking-widest transition hover:opacity-80"
                      style={{ borderColor: "var(--accent)", background: "var(--accent)", color: "var(--bg)" }}
                    >
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <span className="inline-block border px-2.5 py-1 font-mono text-[11px] font-semibold text-text-soft" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Built by Shashwat Bhajanka
                </span>
                <span className="ml-2 inline-block border px-2.5 py-1 font-mono text-[10px] font-semibold text-text-soft" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  Last updated · September 2026
                </span>
              </div>
            </div>
          </HalftoneField>
        </footer>
       </main>

       <AnimatePresence>
         {selectedCard && (
           <motion.div
             key="modal"
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.3 }}
             className="fixed inset-0 z-[100] flex items-center justify-center p-4"
             style={{ backgroundColor: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}
             onClick={() => setSelectedCard(null)}
           >
             <motion.button
               type="button"
               aria-label="Close"
               onClick={(e) => {
                 e.stopPropagation();
                 setSelectedCard(null);
               }}
               className="absolute top-4 right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border text-white/70 hover:text-white transition"
               style={{ borderColor: "var(--border)" }}
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
             >
               ✕
             </motion.button>
             <motion.div
               key="modal-content"
               initial={{ opacity: 0, scale: 0.92, y: 20 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.92, y: 20 }}
               transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
               className="relative w-full max-w-3xl overflow-hidden rounded-2xl border"
               style={{
                 borderColor: "var(--border)",
                 background: "var(--bg-elevated)",
               }}
               onClick={(e) => e.stopPropagation()}
             >
                {selectedCard.image && (
                  <img
                    src={selectedCard.image}
                    alt={selectedCard.title}
                    className="w-full rounded-xl"
                  />
                )}
               <div className="p-6 md:p-8">
                 <div className="mb-2 flex items-center gap-3">
                   <span className="text-2xl">{selectedCard.emoji}</span>
                   <div className="label-tag">{selectedCard.org}</div>
                 </div>
                 <h3 className="text-xl md:text-2xl font-semibold text-text display-tight leading-tight">
                   {selectedCard.title}
                 </h3>
{selectedCard.desc && (
                   <p className="mt-4 text-sm leading-relaxed text-text-soft">
                     {selectedCard.desc}
                   </p>
                 )}
               </div>
               <div className="absolute inset-x-0 top-0 h-[3px]" style={{
                 background: `linear-gradient(90deg, ${selectedCard.accent}, color-mix(in oklab, ${selectedCard.accent} 40%, transparent))`,
               }} />
             </motion.div>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
 }