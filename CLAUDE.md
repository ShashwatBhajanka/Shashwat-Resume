# CLAUDE.md

Portfolio site for Shashwat Bhajanka. See `README.md` for the overview and `AGENTS.md` for Lovable git rules (never force-push or rewrite pushed history; keep `main` working).

## Commands

- `bun run dev` / `bun run build` / `bun run preview`
- `npx tsc --noEmit` to typecheck (no test suite or linter is configured). Run it and a build after changes.

## Conventions

- Single-page React + Vite app. Content lives in constant arrays at the top of `src/App.tsx`; section components live in `src/components/portfolio/`, generic ones in `src/components/ui/`. Import via the `@/` alias.
- Static assets go in `media/` (it is Vite's `publicDir`), referenced from the root, e.g. `/foo.jpg`.
- Style with Tailwind v4 utilities and the CSS variable tokens (`--bg`, `--bg-elevated`, `--border`, `--text`, `--text-soft`, `--text-muted`, `--accent`). Never hardcode colours; everything must work in both dark and light themes.
- Typography utilities: `display-tight` (headings), `label-tag` (small caps labels), `font-mono`, `font-dots` (big numerals only).
- Use `Reveal` for scroll-in animation, and layout constants `CONTAINER` / `SECTION` (1100px column). Wide sections may exceed it deliberately (e.g. `ClubsAccordion` caps at 1440px).
- Respect accessibility: keep keyboard support, `aria-*` roles, visible focus, and `prefers-reduced-motion`.
- New sections need an `id` and an entry in `SECTIONS` in `Nav.tsx`.

## SEO / schema

`index.html` holds the meta tags, canonical URL and JSON-LD `@graph`. Keep it valid JSON, keep the `<noscript>` content in sync with the page (experience, projects, skills, contact), and keep the contact email `bhajankashashwat@gmail.com`.

## Git

Only commit or push when asked. Commit messages are short, lowercase and descriptive, matching the existing history.
