import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/portfolio/AuroraBackground";
import { Nav } from "@/components/portfolio/Nav";
import { Hero3D } from "@/components/portfolio/Hero3D";
import { Reveal } from "@/components/portfolio/Reveal";
import { Counter } from "@/components/portfolio/Counter";
import { SkillBar } from "@/components/portfolio/SkillBar";
import { FlipCard } from "@/components/portfolio/FlipCard";
import { BackToTop } from "@/components/portfolio/BackToTop";

export const Route = createFileRoute("/")({ component: Index });

function SectionLabel({ children }: { children: string }) {
  return <div className="label-tag mb-3">{children}</div>;
}

function H2({ children }: { children: string }) {
  return (
    <h2
      className="text-2xl md:text-3xl font-semibold text-text"
      style={{ letterSpacing: "-0.025em" }}
    >
      {children}
    </h2>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-[10px] text-text-soft"
      style={{ borderColor: "var(--border)", background: "var(--accent-dim)" }}
    >
      {children}
    </span>
  );
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
      {
        label: "Higher Level",
        chips: ["Mathematics AI HL (7/7)", "Computer Science HL (6/7)", "Economics HL (6/7)"],
      },
      {
        label: "Standard Level",
        chips: ["Psychology SL (6/7)", "English SL (6/7)", "Hindi SL (6/7)"],
      },
    ],
  },
];

const EXPERIENCE = [
  {
    date: "Present",
    org: "Lemon Technologies · RSM",
    role: "Python & Data Analytics Intern",
    bullets: [
      "Engineered production-grade software using Python, Django, and RESTful APIs",
      "Built automated PDF parsing pipelines reducing manual processing time by 60%+",
      "Leveraged Pandas and NumPy for analytics and cross-functional reporting",
      "Contributed across the full SDLC from architecture design to deployment",
    ],
    tags: ["Python", "Django", "SQL", "REST APIs", "Pandas"],
  },
  {
    date: "Oct 2025 – Mar 2026",
    org: "TYCHR · Remote, India",
    role: "Content Creator",
    bullets: [
      "Created online notes for IB AI HL mathematics and taught IB computer science through video",
      "Planned lessons using diverse teaching strategies to meet varied student needs",
    ],
    tags: ["IB Mathematics", "Computer Science", "Education"],
  },
  {
    date: "Oct 2024 – Jan 2025",
    org: "Research Labs",
    role: "Internship Project",
    bullets: [
      "Launched an online self-checkout system reducing wait times via real-time data processing",
      "Hit service time targets while understanding customer needs",
    ],
    tags: ["Cloud Architecture", "Real-time Systems"],
  },
  {
    date: "Aug 2024 – Sep 2024",
    org: "Groww",
    role: "Finance Intern",
    bullets: [
      "Analysed stocks and built portfolios for diverse demographics using predicted growth trends",
      "Coordinated with team members on project management tasks",
    ],
    tags: ["Finance", "Portfolio Analysis", "Excel"],
  },
  {
    date: "Jul 2024 – Aug 2024",
    org: "Samsonite",
    role: "Data Science Intern",
    bullets: ["Developed a data-driven marketing strategy using Google Data Studio and Excel"],
    tags: ["Data Studio", "Excel", "Marketing Analytics"],
  },
  {
    date: "Jun 2022 – Aug 2022",
    org: "EcoVision",
    role: "Systems and Consulting Intern",
    bullets: [
      "Provided sustainable plastic waste management solutions and ran social campaigns",
    ],
    tags: ["Sustainability", "Consulting"],
  },
];

const PROGRAMMING = [
  { name: "Python", level: "Advanced", pct: 92 },
  { name: "SQL", level: "Proficient", pct: 82 },
  { name: "JavaScript", level: "Intermediate", pct: 68 },
  { name: "HTML / CSS", level: "Proficient", pct: 80 },
  { name: "Django", level: "Intermediate", pct: 65 },
];

const ACHIEVEMENTS: Array<{
  emoji: string;
  title: string;
  year: string;
  org: string;
  desc: string;
  gradient: [string, string];
  wide?: boolean;
  isPlaceholder?: boolean;
}> = [
  {
    emoji: "🏅",
    title: "Distinction, Euclid Mathematics Competition",
    year: "2024",
    org: "University of Waterloo (CEMC)",
    desc: "Achieved a Distinction ranking in the Euclid Mathematics Contest, a competitive problem-solving exam covering algebra, geometry, and calculus.",
    gradient: ["#0B1F1A", "#2FAE86"],
    wide: true,
  },
  {
    emoji: "🎵",
    title: "Trinity Piano & Music Theory, Distinction – Grade 2",
    year: "2023–24",
    org: "Trinity College London",
    desc: "Earned a Distinction in Grade 2 Piano Practical and Music Theory examinations, demonstrating proficiency in performance and theoretical understanding.",
    gradient: ["#180C2E", "#B14AED"],
  },
  {
    emoji: "🥇",
    title: "First Place, Inter-School Competition",
    year: "2023",
    org: "Fountainhead School",
    desc: "Represented Fountainhead School as band lead and lead singer, securing first place.",
    gradient: ["#2A1500", "#B45309"],
  },
];

const CERTIFICATIONS: Array<{
  emoji: string;
  title: string;
  year?: string;
  org: string;
  desc: string;
  gradient: [string, string];
  wide?: boolean;
  isPlaceholder?: boolean;
}> = [
  {
    emoji: "🤖",
    title: "Machine Learning Basics",
    year: "2024",
    org: "Sung Kyun Kwan University",
    desc: "Completed an introductory course on Machine Learning. Learnt and practiced concepts such as supervised learning, regression, and classification models.",
    gradient: ["#061828", "#0369A1"],
  },
  {
    emoji: "🗄️",
    title: "SQL Programming",
    year: "2024",
    org: "Udemy",
    desc: "Learnt advanced SQL techniques, including complex data querying, multi-table joins, and data merging to drive actionable insights.",
    gradient: ["#0A2818", "#047857"],
  },
  {
    emoji: "🐍",
    title: "Python — 100 Days of Code",
    year: "2024",
    org: "Udemy",
    desc: "Built 100 small projects over 100 days covering Python fundamentals, automation, web scraping, and game development.",
    gradient: ["#1A1A00", "#B45309"],
  },
  {
    emoji: "💰",
    title: "Financial Mathematics",
    org: "add organisation",
    desc: "Add details for this certification.",
    gradient: ["#12103A", "#4F46E5"],
    isPlaceholder: true,
  },
  {
    emoji: "📊",
    title: "Econometrics",
    org: "add organisation",
    desc: "Add details for this certification.",
    gradient: ["#1A0A2E", "#7C3AED"],
    isPlaceholder: true,
  },
  {
    emoji: "🔬",
    title: "Data Science",
    org: "add organisation",
    desc: "Add details for this certification.",
    gradient: ["#003A4A", "#0891B2"],
    isPlaceholder: true,
  },
  {
    emoji: "🚀",
    title: "Entrepreneurship",
    org: "add organisation",
    desc: "Add details for this certification.",
    gradient: ["#2A1000", "#C2410C"],
    wide: true,
    isPlaceholder: true,
  },
];

function CardFront({ emoji, title, year, isPlaceholder }: { emoji: string; title: string; year?: string; isPlaceholder?: boolean }) {
  return (
    <>
      <div className="text-2xl">{emoji}</div>
      <div>
        <div className="text-[15px] font-semibold leading-tight text-white">{title}</div>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-white/70">
          <span>{year ?? ""}</span>
          <span>{isPlaceholder ? "add details" : "tap to flip"}</span>
        </div>
      </div>
    </>
  );
}

function CardBack({ org, desc }: { org: string; desc: string }) {
  return (
    <>
      <div>
        <div className="label-tag mb-1">Organisation</div>
        <div className="text-sm font-semibold text-text">{org}</div>
      </div>
      <p className="text-xs leading-relaxed text-text-soft">{desc}</p>
    </>
  );
}

function Index() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Nav />
      <BackToTop />

      <main className="relative mx-auto max-w-[880px] px-5 md:px-7" style={{ zIndex: 10 }}>
        {/* HERO */}
        <section id="home" className="relative pt-28 md:pt-36 pb-24 md:pb-32">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-8 items-center">
            <div>
              <Reveal>
                <h1
                  className="font-semibold text-text"
                  style={{ fontSize: "clamp(48px, 8vw, 80px)", letterSpacing: "-0.03em", lineHeight: 1.02 }}
                >
                  Shashwat Bhajanka
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-4 text-base text-text-soft">
                  Computer Science Student &amp; Data Analyst
                </p>
              </Reveal>
              <Reveal delay={0.2}>
                <p className="mt-5 max-w-[560px] text-[15px] leading-relaxed text-text">
                  Building at the intersection of data, code, and impact. Hands-on experience in analytics, web development, and research.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs">
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
                      className="text-text underline underline-offset-4 decoration-text-muted hover:decoration-accent hover:text-accent transition"
                    >
                      {l.label}
                    </a>
                  ))}
                </div>
              </Reveal>
            </div>
            <div className="h-56 md:h-72">
              <Hero3D />
            </div>
          </div>
        </section>

        <Divider />

        {/* ABOUT */}
        <section id="overview" className="py-16 md:py-24">
          <Reveal><SectionLabel>Introduction</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>About Me</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 max-w-[680px] text-[15px] leading-relaxed text-text-soft">
              Welcome to my digital notebook — a curated collection of my academic journey, professional experience, technical skills, and the things I've built along the way. Every entry here represents a chapter of growth, from classroom theory to real-world impact. I thrive at the crossroads of data science, software engineering, and creative problem-solving.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="mt-10 grid grid-cols-3 divide-x" style={{ borderColor: "var(--border)" }}>
              {[
                { n: 0, label: "Projects" },
                { n: 0, label: "Years of Experience" },
                { n: 6, label: "Sections" },
              ].map((s, i) => (
                <div key={i} className="px-4 first:pl-0">
                  <div className="text-3xl md:text-4xl font-semibold text-text" style={{ letterSpacing: "-0.03em" }}>
                    <Counter to={s.n} />
                  </div>
                  <div className="mt-2 label-tag">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* EDUCATION */}
        <section id="education" className="py-16 md:py-24">
          <Reveal><SectionLabel>Education</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Academic Background</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-text-soft">Coursework, grades, and the foundation of my analytical thinking.</p>
          </Reveal>
          <div className="mt-10 space-y-10">
            {EDUCATION.map((e, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div>
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="text-[15px] font-semibold text-text">{e.school}</div>
                    <div className="font-mono text-[11px] text-text-muted whitespace-nowrap">{e.date}</div>
                  </div>
                  <div className="mt-1 text-sm text-text-soft">{e.degree}</div>
                  {"chips" in e && e.chips ? (
                    <div className="mt-4">
                      <div className="label-tag mb-2">{e.group}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {e.chips.map((c) => <Chip key={c}>{c}</Chip>)}
                      </div>
                    </div>
                  ) : null}
                  {"groups" in e && e.groups ? (
                    <div className="mt-4 space-y-3">
                      {e.groups.map((g) => (
                        <div key={g.label}>
                          <div className="label-tag mb-2">{g.label}</div>
                          <div className="flex flex-wrap gap-1.5">
                            {g.chips.map((c) => <Chip key={c}>{c}</Chip>)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* EXPERIENCE */}
        <section id="experience" className="py-16 md:py-24">
          <Reveal><SectionLabel>Experience</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Where I've Worked</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-text-soft">Real-world roles that shaped my approach to building and problem-solving.</p>
          </Reveal>
          <div className="mt-10 border-l pl-6 space-y-10" style={{ borderColor: "var(--border)" }}>
            {EXPERIENCE.map((x, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="relative">
                  <div
                    className="absolute -left-[30px] top-2 h-2 w-2 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] text-text-muted">{x.date}</span>
                    <span className="text-sm" style={{ color: "var(--accent)" }}>{x.org}</span>
                  </div>
                  <div className="mt-1 text-[15px] font-semibold text-text">{x.role}</div>
                  <ul className="mt-3 space-y-1.5 text-sm text-text-soft">
                    {x.bullets.map((b) => (
                      <li key={b} className="relative pl-4">
                        <span className="absolute left-0 top-2 h-px w-2 bg-text-muted" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {x.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        <Divider />

        {/* CLUBS */}
        <section id="clubs" className="py-16 md:py-24">
          <Reveal><SectionLabel>Campus Life</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Communities &amp; Pursuits</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-text-soft">Where code meets culture — leadership, art, and sport.</p>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                role: "Head of Dept — Research & Data Insights",
                org: "Ashoka Data Society",
                desc: "Lead independent research using university resources and varied data sources, publishing insights in a curated data review for the campus community.",
                tags: ["Research", "Data Analysis", "Publishing"],
              },
              {
                role: "Full Stack Developer",
                org: "Ashoka Ministry of Technology",
                desc: "Build and maintain university services used by 3,000+ students — applying web dev and analytics to identify real student needs.",
                tags: ["Full Stack", "3,000+ Users"],
              },
            ].map((c, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="h-full rounded-md border p-5" style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}>
                  <div className="label-tag">{c.org}</div>
                  <div className="mt-2 text-[15px] font-semibold text-text">{c.role}</div>
                  <p className="mt-3 text-sm leading-relaxed text-text-soft">{c.desc}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {c.tags.map((t) => <Chip key={t}>{t}</Chip>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15}>
            <div className="mt-8">
              <div className="label-tag mb-3">Extracurriculars</div>
              <ul className="space-y-2 text-sm text-text-soft">
                <li className="flex justify-between border-b py-2" style={{ borderColor: "var(--border-soft)" }}>
                  <span><span className="text-text">Ashoka Apple Cellos</span> — Acapella Society · Ashoka University</span>
                  <span className="font-mono text-[11px] text-text-muted">Present</span>
                </li>
                <li className="flex justify-between border-b py-2" style={{ borderColor: "var(--border-soft)" }}>
                  <span><span className="text-text">Ashoka Hammerheads</span> — Frisbee Varsity Team · Ashoka University</span>
                  <span className="font-mono text-[11px] text-text-muted">Present</span>
                </li>
              </ul>
            </div>
          </Reveal>
        </section>

        <Divider />

        {/* SKILLS */}
        <section id="skills" className="relative py-16 md:py-24">
          <Reveal><SectionLabel>Skills</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Technical Proficiency</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-text-soft">Languages, tools, and competencies I bring to every project.</p>
          </Reveal>

          <div className="mt-10 space-y-10">
            <Reveal>
              <div className="label-tag mb-4">Programming</div>
              <div className="divide-y" style={{ borderColor: "var(--border-soft)" }}>
                {PROGRAMMING.map((s) => (
                  <SkillBar key={s.name} name={s.name} level={s.level} pct={s.pct} />
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="label-tag mb-4">Tools</div>
              <div className="flex flex-wrap gap-2">
                {["Excel", "Google Data Studio", "Cloud Architecture"].map((t) => (
                  <span
                    key={t}
                    className="rounded-md border px-3 py-1.5 text-xs text-text"
                    style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>

            <Reveal>
              <div className="label-tag mb-4">Competencies</div>
              <div className="flex flex-wrap gap-2">
                {[
                  ["📊", "Data Analysis"],
                  ["📈", "Statistical Modelling"],
                  ["🧠", "Analytical Thinking"],
                  ["🔍", "Critical Thinking"],
                  ["📋", "Project Management"],
                  ["🤝", "Team Collaboration"],
                  ["💡", "Problem Solving"],
                ].map(([e, l]) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs text-text"
                    style={{ borderColor: "var(--border)", background: "var(--bg-elevated)" }}
                  >
                    <span>{e}</span>{l}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <Divider />

        {/* ACHIEVEMENTS */}
        <section id="achievements" className="py-16 md:py-24">
          <Reveal><SectionLabel>Portfolio</SectionLabel></Reveal>
          <Reveal delay={0.05}><H2>Achievements &amp; Certifications</H2></Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-sm text-text-soft">Milestones, credentials, and proof points from the journey so far.</p>
          </Reveal>

          <div className="mt-10">
            <div className="label-tag mb-4">🏅 Achievements</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ACHIEVEMENTS.map((a, i) => (
                <Reveal key={i} delay={i * 0.05} className={a.wide ? "md:col-span-2" : ""}>
                  <FlipCard
                    gradient={a.gradient}
                    front={<CardFront emoji={a.emoji} title={a.title} year={a.year} isPlaceholder={a.isPlaceholder} />}
                    back={<CardBack org={a.org} desc={a.desc} />}
                  />
                </Reveal>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <div className="label-tag mb-4">📜 Certifications</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {CERTIFICATIONS.map((a, i) => (
                <Reveal key={i} delay={i * 0.04} className={a.wide ? "md:col-span-2" : ""}>
                  <FlipCard
                    gradient={a.gradient}
                    front={<CardFront emoji={a.emoji} title={a.title} year={a.year} isPlaceholder={a.isPlaceholder} />}
                    back={<CardBack org={a.org} desc={a.desc} />}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        <footer className="py-14 text-center">
          <div className="font-mono text-[11px] text-text-muted">
            Built with ✦ by Shashwat Bhajanka
          </div>
          <div className="mt-1 font-mono text-[10px] text-text-muted">
            Last updated · July 2026
          </div>
        </footer>
      </main>
    </div>
  );
}

function Divider() {
  return <div className="h-px w-full" style={{ background: "var(--border-soft)" }} />;
}
