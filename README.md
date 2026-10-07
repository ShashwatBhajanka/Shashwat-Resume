# Shashwat Bhajanka | Portfolio

Personal portfolio and résumé site for Shashwat Bhajanka, a Computer Science student at Ashoka University. Live at [shashwatbhajanka.tech](https://shashwatbhajanka.tech).

Connected to [Lovable](https://lovable.dev): commits pushed to `main` sync back into the editor, so keep the branch working and don't rewrite pushed history.

## Stack

- React 19 + TypeScript, built with Vite
- Tailwind CSS v4 (theme tokens in `src/styles.css`)
- Framer Motion for animation, Three.js / react-three-fiber for the halftone hero
- Deployed on Vercel (`vercel.json`), packages managed with Bun

## Getting started

```bash
bun install
bun run dev       # local dev server
bun run build     # production build to dist/
bun run preview   # serve the production build
npx tsc --noEmit  # typecheck
```

## Structure

```
index.html                 Meta tags, JSON-LD schema, <noscript> fallback
media/                     Static assets served from the site root (images, robots.txt, favicon)
src/App.tsx                Page content (data arrays) and section layout
src/styles.css             Theme tokens (dark/light), fonts, utilities
src/components/portfolio/  Section components
src/components/ui/         Generic UI (GitHub-style activity calendar)
```

Sections, in order: Home, About, Education, Experience, Projects, Communities & Pursuits, Skills, Achievements (with Certifications), Contact.

## Updating content

All copy lives in constant arrays near the top of `src/App.tsx`:

| Array | Section |
| --- | --- |
| `EDUCATION`, `EXPERIENCE` | Education, Experience |
| `PROJECTS` | Projects (also add a matching entry to the `<noscript>` block in `index.html`) |
| `CLUBS` | Communities & Pursuits |
| `PROGRAMMING`, `ACHIEVEMENTS`, `CERTIFICATIONS` | Skills, Achievements |
| `LINKS` | Hero and Contact buttons |

Add images to `media/` and reference them by root path (e.g. `/ai4all-builders.jpg`).

## Notes

- The GitHub calendar in Projects is decorative (generated pattern); only the contribution count is fetched live from a public API and is hidden if the request fails.
- The Email button falls back to a Gmail compose window if the browser has no mail app registered.
- Respects `prefers-reduced-motion`; an accessibility menu in the nav offers larger text, contrast and spacing options.
- SEO: canonical URL, Open Graph/Twitter tags and a JSON-LD `@graph` (WebSite, ProfilePage, Person) in `index.html`. If the domain changes, update every `shashwatbhajanka.tech` reference there.
