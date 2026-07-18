import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/portfolio/Nav";
import { HalftoneField } from "@/components/portfolio/HalftoneField";
import { Reveal } from "@/components/portfolio/Reveal";
import { Counter } from "@/components/portfolio/Counter";
import { SkillBar } from "@/components/portfolio/SkillBar";
import { FlipCard } from "@/components/portfolio/FlipCard";
import { BackToTop } from "@/components/portfolio/BackToTop";
import { ImagePlaceholder } from "@/components/portfolio/ImagePlaceholder";
import { ScrollBrightenText } from "@/components/portfolio/ScrollBrightenText";
import { PinnedImageHeadline } from "@/components/portfolio/PinnedImageHeadline";
import { Carousel3D } from "@/components/portfolio/Carousel3D";

export const Route = createFileRoute("/")({ component: Index });

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
    ],
  },
  {
    school: "Fountainhead School",
    date: "Graduated May 2025",
    degree: "IB Diploma, score 37/45 · Surat, India",
    groups: [
      { label: "Higher Level", chips: ["Mathematics AI HL (7/7)", "Computer Science HL (6/7)", "Economics HL (6/7)"] },
      { label: "Standard Level", chips: ["Psychology SL (6/7)", "English SL (6/7)", "Hindi SL (6/7)"] },
    ],
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
  emoji: string;
  title: string;
  year?: string;
  org: string;
  desc: string;
  gradient: [string, string];
  wide?: boolean;
  isPlaceholder?: boolean;
};

const ACHIEVEMENTS: Card[] = [
  { emoji: "🏅", title: "Distinction, Euclid Mathematics Competition", year: "2024",
    org: "University of Waterloo (CEMC)",
    desc: "Achieved a Distinction ranking in the Euclid Mathematics Contest, a competitive problem-solving exam covering algebra, geometry, and calculus.",
    gradient: ["#0D2B2B", "#1A6B5A"], wide: true },
  { emoji: "🎵", title: "Trinity Piano & Music Theory, Distinction – Grade 2", year: "2023–24",
    org: "Trinity College London",
    desc: "Earned a Distinction in Grade 2 Piano Practical and Music Theory examinations, demonstrating proficiency in performance and theoretical understanding.",
    gradient: ["#1A0A2E", "#6D28D9"] },
  { emoji: "🥇", title: "First Place, Inter-School Competition", year: "2023",
    org: "Fountainhead School",
    desc: "Represented Fountainhead School as band lead and lead singer, securing first place.",
    gradient: ["#2A1500", "#B45309"] },
];

const CERTIFICATIONS: Card[] = [
  { emoji: "🤖", title: "Machine Learning Basics", year: "2024", org: "Sung Kyun Kwan University",
    desc: "Completed an introductory course on Machine Learning. Learnt and practiced concepts such as supervised learning, regression, and classification models.",
    gradient: ["#061828", "#0369A1"] },
  { emoji: "🗄️", title: "SQL Programming", year: "2024", org: "Udemy",
    desc: "Learnt advanced SQL techniques, including complex data querying, multi-table joins, and data merging to drive actionable insights.",
    gradient: ["#0A2818", "#047857"] },
  { emoji: "🐍", title: "Python — 100 Days of Code", year: "2024", org: "Udemy",
    desc: "Add details for this certification.", isPlaceholder: true,
    gradient: ["#1A1A00", "#B45309"] },
  { emoji: "💰", title: "Financial Mathematics", org: "add organisation",
    desc: "Add details for this certification.", isPlaceholder: true,
    gradient: ["#12103A", "#4F46E5"] },
  { emoji: "📊", title: "Econometrics", org: "add organisation",
    desc: "Add details for this certification.", isPlaceholder: true,
    gradient: ["#1A0A2E", "#7C3AED"] },
  { emoji: "🔬", title: "Data Science", org: "add organisation",
    desc: "Add details for this certification.", isPlaceholder: true,
    gradient: ["#003A4A", "#0891B2"] },
  { emoji: "🚀", title: "Entrepreneurship", org: "add organisation",
    desc: "Add details for this certification.", isPlaceholder: true, wide: true,
    gradient: ["#2A1000", "#C2410C"] },
];

function CardFront({ emoji, title, year, isPlaceholder }: { emoji: string; title: string; year?: string; isPlaceholder?: boolean }) {
  return (
    <>
      <div className="text-2xl">{emoji}</div>
      <div>
        <div className="text-[15px] font-semibold leading-tight text-white">{title}</div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
          <span>{year ?? ""}</span>
          <span>{isPlaceholder ? "add details →" : "tap to reveal →"}</span>
        </div>
      </div>
    </>
  );
}

function CardBack({ org, desc }: { org: string; desc: string }) {
  return (
    <div>
      <div className="label-tag mb-1">Organisation</div>
      <div className="text-sm font-semibold text-text">{org}</div>
      <p className="mt-3 text-xs leading-relaxed text-text-soft">{desc}</p>
    </div>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen">
      <Nav />
      <BackToTop />

      {/* HERO — full bleed with halftone background */}
      <section id="home" className="relative">
        <HalftoneField strength={0.65} className="min-h-[100svh] hero-scrim">
          <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1100px] flex-col justify-end px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
            <Reveal>
              <div className="label-tag mb-6">Portfolio · 2026</div>
            </Reveal>
            <Reveal delay={0.1}>
              <h1
                className="display-tight text-text"
                style={{ fontSize: "clamp(56px, 12vw, 132px)", mixBlendMode: "difference" as any, color: "#fff" }}
              >
                Shashwat<br />Bhajanka
              </h1>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-[560px] text-[15px] leading-relaxed text-text">
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

      <main className="relative">
        {/* ABOUT */}
        <section id="overview" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Introduction</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>About Me</H2></Reveal>
          <div className="mt-10 max-w-[820px] text-[20px] md:text-[24px] leading-[1.45] font-light">
            <ScrollBrightenText text="Welcome to my digital notebook — a curated collection of my academic journey, professional experience, technical skills, and the things I've built along the way. Every entry here represents a chapter of growth, from classroom theory to real-world impact. I thrive at the crossroads of data science, software engineering, and creative problem-solving." />
          </div>
          <Reveal delay={0.2}>
            <div className="mt-16 grid grid-cols-3 gap-4 border-t pt-10" style={{ borderColor: "var(--border)" }}>
              {[
                { n: 0, label: "Projects" },
                { n: 0, label: "Years of Experience" },
                { n: 6, label: "Sections" },
              ].map((s, i) => (
                <div key={i} className="border-l pl-5 first:border-l-0 first:pl-0" style={{ borderColor: "var(--border)" }}>
                  <div className="display-tight text-text" style={{ fontSize: "clamp(48px, 8vw, 96px)" }}>
                    <Counter to={s.n} />
                  </div>
                  <div className="mt-3 label-tag">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* PINNED IMAGE HEADLINE */}
        <PinnedImageHeadline />

        <Divider />

        {/* EDUCATION */}
        <section id="education" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Education</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Academic Background</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Coursework, grades, and the foundation of my analytical thinking.</p>
          </Reveal>
          <div className="mt-16 space-y-14">
            {EDUCATION.map((e, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 border-t pt-8" style={{ borderColor: "var(--border)" }}>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{e.date}</div>
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
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* EXPERIENCE */}
        <section id="experience" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Experience</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Where I've Worked</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Real-world roles that shaped my approach to building and problem-solving.</p>
          </Reveal>
          <div className="mt-16 space-y-0">
            {EXPERIENCE.map((x, i) => (
              <Reveal key={i} delay={i * 0.03}>
                <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 border-t py-10" style={{ borderColor: "var(--border)" }}>
                  <div className="font-mono text-[11px] uppercase tracking-widest text-text-muted">{x.date}</div>
                  <div>
                    <div className="text-sm" style={{ color: "var(--accent)" }}>{x.org}</div>
                    <div className="mt-1 text-2xl md:text-3xl font-semibold text-text display-tight">{x.role}</div>
                    <ul className="mt-4 space-y-1.5 text-[15px] text-text-soft">
                      {x.bullets.map((b) => (
                        <li key={b} className="relative pl-5">
                          <span className="absolute left-0 top-3 h-px w-3 bg-text-muted" />
                          {b}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-1.5">{x.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* CLUBS */}
        <section id="clubs" className="mx-auto max-w-[1100px] px-5 md:px-8 py-28 md:py-36">
          <Reveal><SectionLabel>Campus Life</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Communities &amp; Pursuits</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[560px] text-sm text-text-soft">Where code meets culture — leadership, art, and sport.</p>
          </Reveal>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { role: "Head of Dept — Research & Data Insights", org: "Ashoka Data Society",
                desc: "Lead independent research using university resources and varied data sources, publishing insights in a curated data review for the campus community.",
                tags: ["Research", "Data Analysis", "Publishing"] },
              { role: "Full Stack Developer", org: "Ashoka Ministry of Technology",
                desc: "Build and maintain university services used by 3,000+ students — applying web dev and analytics to identify real student needs.",
                tags: ["Full Stack", "3,000+ Users"] },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="h-full border p-6" style={{ borderColor: "var(--border)" }}>
                  <ImagePlaceholder aspect="16/9" />
                  <div className="mt-5 label-tag">{c.org}</div>
                  <div className="mt-2 text-lg font-semibold text-text display-tight">{c.role}</div>
                  <p className="mt-3 text-sm leading-relaxed text-text-soft">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">{c.tags.map((t) => <Chip key={t}>{t}</Chip>)}</div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-14">
              <div className="label-tag mb-4">Extracurriculars</div>
              <ul className="border-t" style={{ borderColor: "var(--border)" }}>
                {[
                  { name: "Ashoka Apple Cellos", desc: "Acapella Society · Ashoka University" },
                  { name: "Ashoka Hammerheads", desc: "Frisbee Varsity Team · Ashoka University" },
                ].map((x) => (
                  <li key={x.name} className="grid grid-cols-[80px_1fr_auto] items-center gap-4 border-b py-4" style={{ borderColor: "var(--border)" }}>
                    <div className="w-16"><ImagePlaceholder aspect="1/1" label="" /></div>
                    <div className="text-sm text-text-soft"><span className="text-text font-semibold">{x.name}</span> — {x.desc}</div>
                    <span className="font-mono text-[11px] text-text-muted">Present</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* SKILLS */}
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
                {["Excel", "Google Data Studio", "Cloud Architecture"].map((t) => (
                  <span key={t} className="border px-3 py-1.5 text-xs text-text" style={{ borderColor: "var(--border)" }}>{t}</span>
                ))}
              </div>
            </Reveal>
            <Reveal>
              <div className="label-tag mb-5">Competencies</div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["📊", "Data Analysis"], ["📈", "Statistical Modelling"], ["🧠", "Analytical Thinking"],
                  ["🔍", "Critical Thinking"], ["📋", "Project Management"], ["🤝", "Team Collaboration"],
                  ["💡", "Problem Solving"],
                ].map(([e, l]) => (
                  <span key={l} className="inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs text-text" style={{ borderColor: "var(--border)" }}>
                    <span>{e}</span>{l}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Divider />

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="relative">
          {/* Subtle halftone behind header only */}
          <div className="relative">
            <HalftoneField strength={0.5} className="h-[360px]">
              <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-end px-5 pb-14 md:px-8">
                <Reveal><SectionLabel>Portfolio</SectionLabel></Reveal>
                <Reveal delay={0.05}>
                  <h2 className="display-tight text-text" style={{ fontSize: "clamp(40px, 7vw, 88px)", mixBlendMode: "difference" as any, color: "#fff" }}>
                    Achievements &amp;<br />Certifications
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
              <div className="label-tag mb-5">🏅 Achievements</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {ACHIEVEMENTS.map((a, i) => (
                  <Reveal key={i} delay={i * 0.05} className={a.wide ? "md:col-span-2" : ""}>
                    <FlipCard
                      gradient={a.gradient}
                      wide={a.wide}
                      front={<CardFront emoji={a.emoji} title={a.title} year={a.year} isPlaceholder={a.isPlaceholder} />}
                      back={<CardBack org={a.org} desc={a.desc} />}
                    />
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="label-tag mb-5">📜 Certifications</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CERTIFICATIONS.map((a, i) => (
                  <Reveal key={i} delay={i * 0.04} className={a.wide ? "md:col-span-2" : ""}>
                    <FlipCard
                      gradient={a.gradient}
                      wide={a.wide}
                      front={<CardFront emoji={a.emoji} title={a.title} year={a.year} isPlaceholder={a.isPlaceholder} />}
                      back={<CardBack org={a.org} desc={a.desc} />}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CLOSING CTA */}
        <section className="relative">
          <HalftoneField strength={1} interactive className="h-[500px]">
            <div className="relative mx-auto flex h-full max-w-[1100px] flex-col justify-between px-5 py-14 md:px-8">
              <div className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-white/70" style={{ mixBlendMode: "difference" as any }}>
                <span>Hold to disrupt</span>
                <span>Ambient · continuous</span>
              </div>
              <div className="text-center">
                <div
                  className="display-tight"
                  style={{ fontSize: "clamp(40px, 8vw, 108px)", mixBlendMode: "difference" as any, color: "#fff" }}
                >
                  Let&apos;s build something<br />worth noticing.
                </div>
                <a
                  href="mailto:bhajankashashwat@gmail.com"
                  className="mt-8 inline-block font-mono text-[11px] uppercase tracking-widest underline underline-offset-[6px]"
                  style={{ mixBlendMode: "difference" as any, color: "#fff" }}
                >
                  Start a conversation ↗
                </a>
              </div>
              <div />
            </div>
          </HalftoneField>
        </section>

        <footer className="py-10 text-center">
          <div className="font-mono text-[11px] text-text-muted">Built with ✦ by Shashwat Bhajanka</div>
          <div className="mt-1 font-mono text-[10px] text-text-muted">Last updated · July 2026</div>
        </footer>
      </main>
    </div>
  );
}
