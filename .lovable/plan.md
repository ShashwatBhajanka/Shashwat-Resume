# MONOLOG-Inspired Portfolio Redesign

Full redesign to a bold, editorial, two-tone studio aesthetic inspired by bymonolog.com — huge Inter typography, warm cream light mode, and a signature halftone-dithered fluid shader used sparingly at the hero, achievements header, and closing CTA.

## Design system (src/styles.css)

- Replace current tokens with the exact two-tone palettes from the brief (dark bg `#0A0A0A` / text `#EDEDED` / accent `#D4A574`; light bg `#E7E4DC` warm cream / text `#141310` / accent `#8884D8`).
- Keep Inter + JetBrains Mono; add tight negative letter-spacing utilities for display type (clamp up to ~110px on hero).
- Remove the aurora ribbon keyframes/classes — replaced by the shader.
- Add `label-tag` eyebrow style (already present) and a large-numeral stat utility.

## Signature background shader (new)

New `src/components/portfolio/HalftoneField.tsx` — lazy-loaded R3F fullscreen quad with a custom fragment shader:

- FBM (2–3 octaves of simplex noise) drifting slowly to form a wide horizontal wave.
- Hardcoded 8×8 Bayer matrix threshold against the noise value → dot field (~5px cells).
- Uniforms: `uTime`, `uResolution`, `uMouse`, `uMouseDown` (eased 0→1), `uBg`, `uFg`, `uStrength`.
- On `pointerdown` hold, displaces noise coords radially outward from cursor; releases back to ambient.
- Output = `mix(uBg, uFg, dither)` — strictly two-tone.
- `prefers-reduced-motion` → renders a single static frame.
- Props: `strength` (0.7 hero, 0.5 achievements header, 1.0 footer), `interactive` (only footer + optionally hero), `height`.
- Reads theme colors from CSS vars, reacts to `data-theme` changes via MutationObserver.

Delete `AuroraBackground.tsx` and `Hero3D.tsx` / `Hero3DInner.tsx` (replaced).

## New reusable components

- `ImagePlaceholder.tsx` — dashed border box with camera icon + "Add photo" muted label; accepts aspect ratio.
- `ScrollBrightenText.tsx` — splits text into word spans; uses Framer Motion `useScroll` on the container mapped to per-word opacity ramp from `--text-muted` to `--text`.
- `PinnedImageHeadline.tsx` — sticky headline where a mid-sentence word slot cross-fades between 2–3 placeholder squares as the section scrolls through.
- Keep `Counter`, `SkillBar`, `Reveal`, `Nav`, `BackToTop`.

## FlipCard rework

Rewrite `FlipCard.tsx` for the new palette + tap-to-reveal:
- Keep click/tap toggle + keyboard `Enter`/`Space` + `aria-expanded`.
- Add image placeholder slot on the back face.
- Simpler cross-fade + subtle scale reveal (drop diagonal wipe — too decorative for editorial feel).
- Gradient tokens per-card from brief's exact hex pairs.

## Nav fix

Ensure toggle explicitly sets `data-theme="light"|"dark"` (already does) — verify no fallback-to-remove path. Add optional "Start a conversation" pill on the right.

## Route composition (`src/routes/index.tsx`)

Rebuild page structure using exact copy from Section 6:

1. **Hero** — full-bleed `HalftoneField` (strength 0.7) behind huge "Shashwat Bhajanka" wordmark (clamp 56–110px), role line, tagline, contact row. Subtle scrim behind text for legibility.
2. **About** — eyebrow "Introduction" → `ScrollBrightenText` paragraph → three large-numeral counters (0 Projects, 0 Years, 6 Sections) with hairline dividers.
3. **Pinned image headline** — "Built at the intersection of [image] data, code, and impact" with cross-fading placeholder square.
4. **Education** — flat, two entries with coursework chips exactly as specified.
5. **Experience** — vertical timeline (left rule + dot markers), 6 roles verbatim, tag chips.
6. **Clubs / Campus Life** — 2-column card grid with `ImagePlaceholder` on each card + Extracurriculars list with placeholders.
7. **Skills** — Programming rows with `SkillBar`, Tools chips, Competencies chips. Keep simple grid (skip the hover-swap panel for scope).
8. **Achievements & Certifications** — subtle `HalftoneField` (strength 0.5, non-interactive) behind section header only. Two grids of `FlipCard`s with exact gradient hex pairs from brief; placeholders marked clearly for entries without content.
9. **Closing CTA / Footer** — full-strength (1.0) interactive `HalftoneField` band (~450px tall), "Hold to disrupt" mono label, large closing line "Let's build something worth noticing", mono footer credit + last-updated.

## Technical

- Shader canvas: lazy via `React.lazy` + `Suspense`, `dpr={[1, 1.5]}` (1 on mobile), `frameloop="always"` but paused when off-screen via IntersectionObserver.
- All content sections stay flat `--bg`; shader only at hero / achievements header / footer.
- `prefers-reduced-motion` disables shader animation + word-brighten + counters snap to final.
- Preserve TanStack Start route structure and `__root.tsx` head metadata.

## Files touched

- Edit: `src/styles.css`, `src/routes/index.tsx`, `src/components/portfolio/Nav.tsx`, `src/components/portfolio/FlipCard.tsx`, `src/components/portfolio/Reveal.tsx`
- New: `src/components/portfolio/HalftoneField.tsx`, `HalftoneFieldInner.tsx`, `ImagePlaceholder.tsx`, `ScrollBrightenText.tsx`, `PinnedImageHeadline.tsx`
- Delete: `src/components/portfolio/AuroraBackground.tsx`, `Hero3D.tsx`, `Hero3DInner.tsx`
